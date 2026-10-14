/**
 * CodeQuest - Centralized Storage and State Management Module
 * Handles namespaced LocalStorage, state mutations, XP calculations,
 * streak evaluation, anti-farming caps, and achievement tracking.
 */

const CQ_STORAGE = (function() {
  const KEYS = {
    USER: "codequest_user",
    PROGRESS: "codequest_progress"
  };

  const DAILY_QUIZ_XP_CAP = 50; // Maximum quiz XP that can be earned per calendar day

  // Event subscribers
  const listeners = [];

  function subscribe(fn) {
    if (typeof fn === "function") {
      listeners.push(fn);
    }
  }

  function notify(event, payload) {
    listeners.forEach(fn => {
      try {
        fn(event, payload);
      } catch (e) {
        console.error("Storage listener error:", e);
      }
    });
  }

  // Helper: Format local date as YYYY-MM-DD
  function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Helper: Get difference in calendar days between two YYYY-MM-DD strings
  function getDayDifference(dateStrA, dateStrB) {
    if (!dateStrA || !dateStrB) return null;
    const a = new Date(dateStrA + "T00:00:00");
    const b = new Date(dateStrB + "T00:00:00");
    const diffMs = b - a;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  // Default Initial User State
  function getDefaultUser() {
    return {
      displayName: "Novice Explorer",
      preferredLanguage: "python", // 'python' or 'c'
      dailyGoalMinutes: 15, // 10, 20, 30
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    };
  }

  // Default Initial Progress State
  function getDefaultProgress() {
    return {
      xp: 0,
      level: 1,
      completedLessons: {},      // { [lessonId]: ISOString }
      lastAccessedLesson: null,  // { id, track, title, timestamp }
      completedChallenges: {},   // { [challengeId]: ISOString }
      unlockedAchievements: {},  // { [badgeId]: ISOString }
      quizHistory: [],           // Array of { id, date, language, score, total, percentage, xpEarned }
      dailyQuizXP: {},           // { [YYYY-MM-DD]: number }
      dailyQuests: {
        date: getTodayString(),
        quests: {},              // { [questId]: boolean }
        claimedBonus: false
      },
      activityLog: [],           // Array of { id, type, title, xp, timestamp }
      activityDates: [],         // Array of unique "YYYY-MM-DD"
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null
    };
  }

  // Load User Data
  function getUser() {
    try {
      const data = localStorage.getItem(KEYS.USER);
      if (!data) return getDefaultUser();
      const parsed = JSON.parse(data);
      return { ...getDefaultUser(), ...parsed };
    } catch (e) {
      console.warn("Malformed user data in storage, using default.", e);
      return getDefaultUser();
    }
  }

  // Save User Data
  function saveUser(user) {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
      notify("user_updated", user);
    } catch (e) {
      console.error("Failed to save user data to LocalStorage:", e);
    }
  }

  // Load Progress Data
  function getProgress() {
    try {
      const data = localStorage.getItem(KEYS.PROGRESS);
      let progress = data ? JSON.parse(data) : getDefaultProgress();
      progress = { ...getDefaultProgress(), ...progress };

      // Validate daily quests date rollover
      const today = getTodayString();
      if (!progress.dailyQuests || progress.dailyQuests.date !== today) {
        progress.dailyQuests = {
          date: today,
          quests: {},
          claimedBonus: false
        };
      }

      // Check for broken streak on load
      // If user hasn't had activity today AND last activity was before yesterday, current streak is broken (0)
      if (progress.lastActiveDate) {
        const diff = getDayDifference(progress.lastActiveDate, today);
        if (diff > 1) {
          progress.currentStreak = 0;
        }
      }

      return progress;
    } catch (e) {
      console.warn("Malformed progress data in storage, using default.", e);
      return getDefaultProgress();
    }
  }

  // Save Progress Data
  function saveProgress(progress) {
    try {
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
      notify("progress_updated", progress);
    } catch (e) {
      console.error("Failed to save progress to LocalStorage:", e);
    }
  }

  // Calculate Level based on Total XP
  function getLevelInfo(totalXP) {
    const levels = CQ_DATA.levels;
    let current = levels[0];
    let next = levels[1] || null;

    for (let i = 0; i < levels.length; i++) {
      if (totalXP >= levels[i].minXP) {
        current = levels[i];
        next = levels[i + 1] || null;
      }
    }

    const currentMin = current.minXP;
    const nextMin = next ? next.minXP : current.maxXP;
    const range = nextMin - currentMin;
    const progressXP = totalXP - currentMin;
    const percent = next ? Math.min(100, Math.max(0, Math.round((progressXP / range) * 100))) : 100;

    return {
      level: current.level,
      title: current.title,
      currentXP: totalXP,
      nextLevelMinXP: nextMin,
      xpNeededForNext: next ? Math.max(0, nextMin - totalXP) : 0,
      percent: percent,
      isMaxLevel: !next
    };
  }

  // Internal: Record Qualifying Activity for Streaks and Dates
  function recordActivity(progress, type, title, xpEarned) {
    const today = getTodayString();
    const timestamp = new Date().toISOString();

    // 1. Log activity item (limit log to last 50 entries)
    if (!progress.activityLog) progress.activityLog = [];
    progress.activityLog.unshift({
      id: "act_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      type: type, // 'lesson', 'quiz', 'challenge', 'quest'
      title: title,
      xp: xpEarned,
      timestamp: timestamp
    });
    if (progress.activityLog.length > 50) {
      progress.activityLog = progress.activityLog.slice(0, 50);
    }

    // 2. Update Streak
    if (!progress.activityDates) progress.activityDates = [];
    const isNewDate = !progress.activityDates.includes(today);

    if (isNewDate) {
      progress.activityDates.push(today);
      progress.activityDates.sort();

      if (!progress.lastActiveDate) {
        // First active day ever
        progress.currentStreak = 1;
      } else {
        const diff = getDayDifference(progress.lastActiveDate, today);
        if (diff === 1) {
          // Exactly consecutive day
          progress.currentStreak += 1;
        } else if (diff === 0) {
          // Same day, streak already counted
        } else {
          // Day was missed, reset streak to 1
          progress.currentStreak = 1;
        }
      }

      progress.lastActiveDate = today;

      if (progress.currentStreak > (progress.longestStreak || 0)) {
        progress.longestStreak = progress.currentStreak;
      }
    } else {
      // Already active today; ensure streak is at least 1
      if (progress.currentStreak === 0) {
        progress.currentStreak = 1;
      }
      progress.lastActiveDate = today;
    }
  }

  // Internal: Check and Unlock Achievements
  function checkAchievements(progress) {
    if (!progress.unlockedAchievements) progress.unlockedAchievements = {};
    const newlyUnlocked = [];
    const nowISO = new Date().toISOString();

    const lessonsCount = Object.keys(progress.completedLessons || {}).length;
    const challengesCount = Object.keys(progress.completedChallenges || {}).length;
    const quizzesCount = (progress.quizHistory || []).length;
    const distinctDates = (progress.activityDates || []).length;
    const totalXP = progress.xp || 0;

    // Count Python and C lessons
    let pyLessons = 0;
    let cLessons = 0;
    Object.keys(progress.completedLessons || {}).forEach(id => {
      if (id.startsWith("py-")) pyLessons++;
      if (id.startsWith("c-")) cLessons++;
    });

    // Check if any quiz scored 100%
    const hasPerfectQuiz = (progress.quizHistory || []).some(q => q.percentage === 100);

    CQ_DATA.achievements.forEach(badge => {
      if (progress.unlockedAchievements[badge.id]) return; // already unlocked

      let eligible = false;
      switch (badge.criteriaType) {
        case "lessons_count":
          eligible = lessonsCount >= badge.threshold;
          break;
        case "quizzes_count":
          eligible = quizzesCount >= badge.threshold;
          break;
        case "quiz_perfect":
          eligible = hasPerfectQuiz;
          break;
        case "challenges_count":
          eligible = challengesCount >= badge.threshold;
          break;
        case "distinct_dates":
          eligible = distinctDates >= badge.threshold;
          break;
        case "total_xp":
          eligible = totalXP >= badge.threshold;
          break;
        case "python_lessons_count":
          eligible = pyLessons >= badge.threshold;
          break;
        case "c_lessons_count":
          eligible = cLessons >= badge.threshold;
          break;
      }

      if (eligible) {
        progress.unlockedAchievements[badge.id] = nowISO;
        newlyUnlocked.push(badge);
      }
    });

    return newlyUnlocked;
  }

  // Complete a Lesson
  function completeLesson(lessonId, lessonTitle, track) {
    const progress = getProgress();
    const isFirstTime = !progress.completedLessons[lessonId];

    // Always update last accessed
    progress.lastAccessedLesson = {
      id: lessonId,
      title: lessonTitle,
      track: track,
      timestamp: new Date().toISOString()
    };

    if (!isFirstTime) {
      saveProgress(progress);
      return { success: true, isFirstTime: false, xpAwarded: 0 };
    }

    // Award XP only first time
    const xpReward = 20;
    const prevLevel = getLevelInfo(progress.xp).level;
    progress.xp += xpReward;
    progress.completedLessons[lessonId] = new Date().toISOString();

    // Check daily quest
    if (progress.dailyQuests && !progress.dailyQuests.quests["quest_lesson"]) {
      progress.dailyQuests.quests["quest_lesson"] = true;
    }

    recordActivity(progress, "lesson", `Completed lesson: ${lessonTitle}`, xpReward);
    const newLevelInfo = getLevelInfo(progress.xp);
    progress.level = newLevelInfo.level;

    const unlockedBadges = checkAchievements(progress);
    saveProgress(progress);

    const leveledUp = newLevelInfo.level > prevLevel;

    return {
      success: true,
      isFirstTime: true,
      xpAwarded: xpReward,
      leveledUp: leveledUp,
      newLevel: newLevelInfo,
      unlockedBadges: unlockedBadges
    };
  }

  // Record a Quiz Result
  function recordQuizResult(language, score, totalQuestions) {
    const progress = getProgress();
    const today = getTodayString();
    const percentage = Math.round((score / totalQuestions) * 100);

    // Calculate XP: 5 XP per correct answer, subject to daily cap
    if (!progress.dailyQuizXP) progress.dailyQuizXP = {};
    const currentDayQuizXP = progress.dailyQuizXP[today] || 0;
    const potentialXP = score * 5;
    const remainingCap = Math.max(0, DAILY_QUIZ_XP_CAP - currentDayQuizXP);
    const actualXPEarned = Math.min(potentialXP, remainingCap);

    progress.dailyQuizXP[today] = currentDayQuizXP + actualXPEarned;

    const quizEntry = {
      id: "quiz_" + Date.now(),
      date: today,
      language: language,
      score: score,
      total: totalQuestions,
      percentage: percentage,
      xpEarned: actualXPEarned,
      timestamp: new Date().toISOString()
    };

    if (!progress.quizHistory) progress.quizHistory = [];
    progress.quizHistory.unshift(quizEntry);

    const prevLevel = getLevelInfo(progress.xp).level;
    progress.xp += actualXPEarned;

    // Check daily quest (qualifies if score >= 60%)
    if (percentage >= 60 && progress.dailyQuests && !progress.dailyQuests.quests["quest_quiz"]) {
      progress.dailyQuests.quests["quest_quiz"] = true;
    }

    recordActivity(progress, "quiz", `Completed ${language.toUpperCase()} Quiz (${score}/${totalQuestions})`, actualXPEarned);

    const newLevelInfo = getLevelInfo(progress.xp);
    progress.level = newLevelInfo.level;

    const unlockedBadges = checkAchievements(progress);
    saveProgress(progress);

    return {
      score: score,
      total: totalQuestions,
      percentage: percentage,
      xpEarned: actualXPEarned,
      capped: actualXPEarned < potentialXP,
      dailyTotalXP: progress.dailyQuizXP[today],
      dailyCap: DAILY_QUIZ_XP_CAP,
      leveledUp: newLevelInfo.level > prevLevel,
      newLevel: newLevelInfo,
      unlockedBadges: unlockedBadges
    };
  }

  // Complete a Coding Challenge
  function completeChallenge(challengeId, challengeTitle) {
    const progress = getProgress();
    const isFirstTime = !progress.completedChallenges[challengeId];

    if (!isFirstTime) {
      return { success: true, isFirstTime: false, xpAwarded: 0 };
    }

    const xpReward = 30;
    const prevLevel = getLevelInfo(progress.xp).level;
    progress.xp += xpReward;
    progress.completedChallenges[challengeId] = new Date().toISOString();

    // Check daily quest
    if (progress.dailyQuests && !progress.dailyQuests.quests["quest_challenge"]) {
      progress.dailyQuests.quests["quest_challenge"] = true;
    }

    recordActivity(progress, "challenge", `Solved challenge: ${challengeTitle}`, xpReward);

    const newLevelInfo = getLevelInfo(progress.xp);
    progress.level = newLevelInfo.level;

    const unlockedBadges = checkAchievements(progress);
    saveProgress(progress);

    return {
      success: true,
      isFirstTime: true,
      xpAwarded: xpReward,
      leveledUp: newLevelInfo.level > prevLevel,
      newLevel: newLevelInfo,
      unlockedBadges: unlockedBadges
    };
  }

  // Claim Daily Quest Bonus (10 bonus XP)
  function claimDailyQuestBonus() {
    const progress = getProgress();
    if (!progress.dailyQuests) return { success: false, reason: "No quest data" };

    if (progress.dailyQuests.claimedBonus) {
      return { success: false, reason: "Bonus already claimed today" };
    }

    // Check if all quests are finished
    const allCompleted = CQ_DATA.dailyQuests.every(q => progress.dailyQuests.quests[q.id]);
    if (!allCompleted) {
      return { success: false, reason: "Not all daily quests are completed yet" };
    }

    const bonusXP = 10;
    const prevLevel = getLevelInfo(progress.xp).level;
    progress.xp += bonusXP;
    progress.dailyQuests.claimedBonus = true;

    recordActivity(progress, "quest", "Claimed Daily Quest Completion Bonus!", bonusXP);

    const newLevelInfo = getLevelInfo(progress.xp);
    progress.level = newLevelInfo.level;

    const unlockedBadges = checkAchievements(progress);
    saveProgress(progress);

    return {
      success: true,
      xpAwarded: bonusXP,
      leveledUp: newLevelInfo.level > prevLevel,
      newLevel: newLevelInfo,
      unlockedBadges: unlockedBadges
    };
  }

  // Get Weekly Activity for Last 7 Days (Array of { date, dayLabel, xp, activitiesCount, isToday })
  function getWeeklyActivity() {
    const progress = getProgress();
    const result = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const dayLabel = dayNames[d.getDay()];

      // Tally activities on this date from activityLog
      const logsOnDate = (progress.activityLog || []).filter(item => {
        return item.timestamp && item.timestamp.startsWith(dateStr);
      });

      const totalXPOnDate = logsOnDate.reduce((sum, item) => sum + (item.xp || 0), 0);

      result.push({
        date: dateStr,
        dayLabel: dayLabel,
        xp: totalXPOnDate,
        count: logsOnDate.length,
        isToday: i === 0,
        hasActivity: (progress.activityDates || []).includes(dateStr)
      });
    }

    return result;
  }

  // Reset Demo Data (Clears ONLY CodeQuest keys)
  function resetAllData() {
    try {
      localStorage.removeItem(KEYS.USER);
      localStorage.removeItem(KEYS.PROGRESS);
      // Remove any other codequest_ prefixed items if any were set
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("codequest_")) {
          toRemove.push(key);
        }
      }
      toRemove.forEach(k => localStorage.removeItem(k));

      notify("data_reset", null);
      return true;
    } catch (e) {
      console.error("Failed to reset storage:", e);
      return false;
    }
  }

  // Public API
  return {
    getUser: getUser,
    saveUser: saveUser,
    getProgress: getProgress,
    saveProgress: saveProgress,
    getLevelInfo: getLevelInfo,
    completeLesson: completeLesson,
    recordQuizResult: recordQuizResult,
    completeChallenge: completeChallenge,
    claimDailyQuestBonus: claimDailyQuestBonus,
    getWeeklyActivity: getWeeklyActivity,
    resetAllData: resetAllData,
    subscribe: subscribe,
    getTodayString: getTodayString
  };
})();

// Export to window
if (typeof window !== "undefined") {
  window.CQ_STORAGE = CQ_STORAGE;
}

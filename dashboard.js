/**
 * CodeQuest - Dashboard Controller
 * Handles rendering stats, weekly activity chart, daily quests,
 * continue learning card, and real recent activity logs.
 */

const CQ_DASHBOARD = (function() {
  // Format current date nicely
  function getFormattedDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  }

  // Format relative timestamp
  function timeAgo(isoString) {
    if (!isoString) return "Recently";
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  // Pick a quote based on day or random
  function getDailyQuote() {
    const quotes = CQ_DATA.quotes;
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % quotes.length;
    return quotes[index] || quotes[0];
  }

  // Find the next recommended lesson
  function getRecommendedLesson(user, progress) {
    // 1. If there is a last accessed lesson that is NOT completed, recommend it
    if (progress.lastAccessedLesson && !progress.completedLessons[progress.lastAccessedLesson.id]) {
      const allLessons = [...CQ_DATA.pythonLessons, ...CQ_DATA.cLessons];
      const match = allLessons.find(l => l.id === progress.lastAccessedLesson.id);
      if (match) return match;
    }

    // 2. Otherwise find the first uncompleted lesson in the user's preferred track
    const preferredTrackLessons = user.preferredLanguage === "c" ? CQ_DATA.cLessons : CQ_DATA.pythonLessons;
    const nextUncompleted = preferredTrackLessons.find(l => !progress.completedLessons[l.id]);
    if (nextUncompleted) return nextUncompleted;

    // 3. Otherwise find any uncompleted lesson in the other track
    const otherTrackLessons = user.preferredLanguage === "c" ? CQ_DATA.pythonLessons : CQ_DATA.cLessons;
    const otherUncompleted = otherTrackLessons.find(l => !progress.completedLessons[l.id]);
    if (otherUncompleted) return otherUncompleted;

    // 4. If all completed, return the first lesson of the preferred track
    return preferredTrackLessons[0];
  }

  // Calculate Overall Progress % across all curriculum items
  function calculateOverallProgress(progress) {
    const totalLessons = CQ_DATA.pythonLessons.length + CQ_DATA.cLessons.length; // 16
    const totalChallenges = CQ_DATA.challenges.length; // 10
    const totalMaxQuizzes = 2; // at least 1 Python and 1 C completed

    const doneLessons = Object.keys(progress.completedLessons || {}).length;
    const doneChallenges = Object.keys(progress.completedChallenges || {}).length;
    const doneQuizzes = Math.min(totalMaxQuizzes, (progress.quizHistory || []).length);

    const totalWeight = totalLessons + totalChallenges + totalMaxQuizzes;
    const completedWeight = doneLessons + doneChallenges + doneQuizzes;

    return Math.min(100, Math.round((completedWeight / totalWeight) * 100));
  }

  // Main Render Function
  function render() {
    const container = document.getElementById("dashboard-view");
    if (!container) return;

    const user = CQ_STORAGE.getUser();
    const progress = CQ_STORAGE.getProgress();
    const levelInfo = CQ_STORAGE.getLevelInfo(progress.xp);
    const quote = getDailyQuote();
    const nextLesson = getRecommendedLesson(user, progress);
    const overallPercent = calculateOverallProgress(progress);
    const weeklyActivity = CQ_STORAGE.getWeeklyActivity();

    const totalLessons = CQ_DATA.pythonLessons.length + CQ_DATA.cLessons.length;
    const completedLessonsCount = Object.keys(progress.completedLessons || {}).length;
    const quizzesCount = (progress.quizHistory || []).length;
    const challengesCount = Object.keys(progress.completedChallenges || {}).length;

    // Daily Quests Status
    const todayQuests = progress.dailyQuests || { quests: {}, claimedBonus: false };
    const allQuestsCompleted = CQ_DATA.dailyQuests.every(q => todayQuests.quests[q.id]);
    const claimedBonus = todayQuests.claimedBonus;

    container.innerHTML = `
      <!-- Welcome Header -->
      <section class="dashboard-header animate-fade-in" aria-label="Welcome Banner">
        <div class="welcome-text">
          <div class="badge-tag">
            <span class="pulse-dot"></span>
            ${user.preferredLanguage === 'c' ? 'C Systems Track' : 'Python Developer Track'}
          </div>
          <h1 class="welcome-title">Welcome back, <span class="gradient-text">${escapeHTML(user.displayName)}</span>!</h1>
          <p class="welcome-date"><i class="icon-calendar"></i> ${getFormattedDate()}</p>
        </div>
        <div class="quote-card">
          <div class="quote-icon">“</div>
          <p class="quote-text">${quote.text}</p>
          <span class="quote-author">— ${quote.author}</span>
        </div>
      </section>

      <!-- Key Stats Grid -->
      <section class="stats-grid" aria-label="Key Statistics">
        <!-- Card 1: Total XP & Level -->
        <div class="stat-card stat-xp">
          <div class="stat-header">
            <div class="stat-icon-wrapper xp-glow">
              <svg viewBox="0 0 24 24" class="stat-svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/></svg>
            </div>
            <span class="stat-badge">Level ${levelInfo.level}</span>
          </div>
          <div class="stat-body">
            <h3 class="stat-value">${progress.xp.toLocaleString()} <span class="stat-unit">XP</span></h3>
            <p class="stat-label">${levelInfo.title}</p>
            <div class="progress-bar-container" title="${levelInfo.percent}% to next level">
              <div class="progress-bar-fill xp-fill" style="width: ${levelInfo.percent}%;"></div>
            </div>
            <div class="stat-footnote">
              ${levelInfo.isMaxLevel ? 'Maximum Level Reached!' : `${levelInfo.xpNeededForNext} XP to Level ${levelInfo.level + 1}`}
            </div>
          </div>
        </div>

        <!-- Card 2: Current Streak -->
        <div class="stat-card stat-streak">
          <div class="stat-header">
            <div class="stat-icon-wrapper flame-glow">
              <svg viewBox="0 0 24 24" class="stat-svg"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="currentColor"/></svg>
            </div>
            <span class="stat-badge ${progress.currentStreak > 0 ? 'badge-active' : ''}">
              ${progress.currentStreak > 0 ? 'Active Today' : 'Inactive'}
            </span>
          </div>
          <div class="stat-body">
            <h3 class="stat-value">${progress.currentStreak} <span class="stat-unit">Days</span></h3>
            <p class="stat-label">Daily Streak</p>
            <div class="stat-detail-row">
              <span>Longest Streak:</span>
              <strong class="text-gold">${progress.longestStreak || progress.currentStreak} days</strong>
            </div>
            <div class="stat-footnote">
              ${progress.currentStreak > 0 ? 'Streak maintained! Keep learning.' : 'Complete an activity to start a streak!'}
            </div>
          </div>
        </div>

        <!-- Card 3: Lessons Completed -->
        <div class="stat-card stat-lessons">
          <div class="stat-header">
            <div class="stat-icon-wrapper blue-glow">
              <svg viewBox="0 0 24 24" class="stat-svg"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            </div>
            <span class="stat-badge">${completedLessonsCount} / ${totalLessons}</span>
          </div>
          <div class="stat-body">
            <h3 class="stat-value">${completedLessonsCount} <span class="stat-unit">Lessons</span></h3>
            <p class="stat-label">Curriculum Mastered</p>
            <div class="progress-bar-container">
              <div class="progress-bar-fill blue-fill" style="width: ${Math.round((completedLessonsCount / totalLessons) * 100)}%;"></div>
            </div>
            <div class="stat-footnote">
              ${Math.round((completedLessonsCount / totalLessons) * 100)}% of total curriculum
            </div>
          </div>
        </div>

        <!-- Card 4: Overall Progress -->
        <div class="stat-card stat-progress">
          <div class="stat-header">
            <div class="stat-icon-wrapper green-glow">
              <svg viewBox="0 0 24 24" class="stat-svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            </div>
            <span class="stat-badge">${quizzesCount} Quizzes | ${challengesCount} Solved</span>
          </div>
          <div class="stat-body">
            <h3 class="stat-value">${overallPercent}<span class="stat-unit">%</span></h3>
            <p class="stat-label">Overall Completion</p>
            <div class="progress-bar-container">
              <div class="progress-bar-fill green-fill" style="width: ${overallPercent}%;"></div>
            </div>
            <div class="stat-footnote">
              Lessons, Quizzes & Challenges combined
            </div>
          </div>
        </div>
      </section>

      <!-- Mid Section: Continue Learning & Daily Quests -->
      <section class="dashboard-mid-grid">
        <!-- Continue Learning Card -->
        <div class="card continue-learning-card" aria-label="Continue Learning Section">
          <div class="card-header-flex">
            <div>
              <span class="card-eyebrow">UP NEXT</span>
              <h2 class="card-heading">Continue Your Quest</h2>
            </div>
            <span class="track-pill ${nextLesson.track}">
              ${nextLesson.track === 'python' ? 'Python' : 'C Language'}
            </span>
          </div>
          <div class="continue-lesson-content">
            <div class="lesson-meta-row">
              <span class="meta-tag"><i class="icon-clock"></i> ${nextLesson.estimatedTime}</span>
              <span class="meta-tag difficulty-${nextLesson.difficulty.toLowerCase()}">${nextLesson.difficulty}</span>
              <span class="meta-tag text-purple">+${nextLesson.xpReward} XP</span>
              ${progress.completedLessons[nextLesson.id] ? '<span class="meta-tag tag-completed">Completed</span>' : ''}
            </div>
            <h3 class="continue-lesson-title">${nextLesson.title}</h3>
            <p class="continue-lesson-desc">${nextLesson.objective}</p>
          </div>
          <div class="continue-action-row">
            <button class="btn btn-primary" id="btn-continue-lesson" data-lesson-id="${nextLesson.id}" data-track="${nextLesson.track}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              ${progress.completedLessons[nextLesson.id] ? 'Review Lesson' : 'Start Lesson Now'}
            </button>
            <a href="#learn" class="btn btn-secondary">Browse All Lessons</a>
          </div>
        </div>

        <!-- Daily Quests Card -->
        <div class="card daily-quests-card" aria-label="Daily Quests">
          <div class="card-header-flex">
            <div>
              <span class="card-eyebrow">DAILY BOUNTY</span>
              <h2 class="card-heading">Daily Quests</h2>
            </div>
            <span class="quest-status-pill ${allQuestsCompleted ? 'completed' : ''}">
              ${allQuestsCompleted ? 'Ready to Claim' : 'In Progress'}
            </span>
          </div>
          <p class="card-subtext">Complete daily goals to maintain your momentum and earn bonus XP.</p>
          
          <div class="quests-list">
            ${CQ_DATA.dailyQuests.map(quest => {
              const isDone = !!todayQuests.quests[quest.id];
              return `
                <div class="quest-item ${isDone ? 'quest-done' : ''}">
                  <div class="quest-checkbox ${isDone ? 'checked' : ''}" aria-label="${isDone ? 'Completed' : 'Incomplete'}">
                    ${isDone ? '✓' : ''}
                  </div>
                  <div class="quest-info">
                    <div class="quest-title-row">
                      <strong class="quest-name">${quest.title}</strong>
                      <span class="quest-reward">+${quest.rewardXP} XP</span>
                    </div>
                    <p class="quest-desc">${quest.description}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="quest-claim-footer">
            ${claimedBonus ? `
              <div class="quest-claimed-msg">
                <span class="badge-check">✓</span> Daily Quest Bonus (+10 XP) Claimed for Today!
              </div>
            ` : `
              <button class="btn btn-gold btn-block" id="btn-claim-quest" ${allQuestsCompleted ? '' : 'disabled'}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ${allQuestsCompleted ? 'Claim Quest Bonus (+10 XP)' : 'Complete All 3 to Unlock Bonus'}
              </button>
            `}
          </div>
        </div>
      </section>

      <!-- Bottom Section: Weekly Activity & Recent Activity -->
      <section class="dashboard-bottom-grid">
        <!-- Weekly Activity Chart -->
        <div class="card weekly-chart-card" aria-label="Weekly Activity">
          <div class="card-header-flex">
            <div>
              <span class="card-eyebrow">CONSISTENCY</span>
              <h2 class="card-heading">Weekly Activity (Last 7 Days)</h2>
            </div>
            <span class="text-muted text-sm">${weeklyActivity.filter(d => d.hasActivity).length} active days</span>
          </div>
          <p class="card-subtext">Tracks XP earned and learning milestones completed each day.</p>

          <!-- CSS Bar Chart -->
          <div class="chart-container" role="img" aria-label="Bar chart showing XP earned over the last 7 days">
            ${renderWeeklyChart(weeklyActivity)}
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-color today-color"></span> Today</span>
            <span class="legend-item"><span class="legend-color active-color"></span> Active Days</span>
            <span class="legend-item"><span class="legend-color inactive-color"></span> Inactive</span>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="card recent-activity-card" aria-label="Recent Activity Stream">
          <div class="card-header-flex">
            <div>
              <span class="card-eyebrow">JOURNAL</span>
              <h2 class="card-heading">Recent Activity</h2>
            </div>
            <a href="#learn" class="link-action">Action Hub →</a>
          </div>

          <div class="activity-feed">
            ${(!progress.activityLog || progress.activityLog.length === 0) ? `
              <div class="empty-state-feed">
                <div class="empty-icon-shield">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#64748B" stroke-width="1.5"><polygon points="12 2 2 7 12 22 22 7 12 2"/></svg>
                </div>
                <h4>No activities recorded yet</h4>
                <p>Complete your first lesson, quiz, or challenge to see your learning journey recorded here in real-time!</p>
                <button class="btn btn-sm btn-primary" onclick="window.location.hash='#learn'">Start Exploring Lessons</button>
              </div>
            ` : `
              <div class="activity-timeline">
                ${progress.activityLog.slice(0, 7).map(item => `
                  <div class="timeline-item">
                    <div class="timeline-icon-wrap type-${item.type}">
                      ${getActivityIcon(item.type)}
                    </div>
                    <div class="timeline-content">
                      <div class="timeline-title-row">
                        <span class="timeline-title">${escapeHTML(item.title)}</span>
                        ${item.xp > 0 ? `<span class="timeline-xp">+${item.xp} XP</span>` : ''}
                      </div>
                      <span class="timeline-time">${timeAgo(item.timestamp)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </section>
    `;

    // Attach Dashboard Event Handlers
    attachEvents(nextLesson);
  }

  // Render pure CSS/SVG Bar Chart
  function renderWeeklyChart(weeklyData) {
    const maxXP = Math.max(100, ...weeklyData.map(d => d.xp));

    return `
      <div class="bar-chart-flex">
        ${weeklyData.map(day => {
          const heightPercent = day.xp > 0 ? Math.max(15, Math.round((day.xp / maxXP) * 100)) : 6;
          let barClass = "bar-inactive";
          if (day.isToday) {
            barClass = day.xp > 0 ? "bar-today active" : "bar-today";
          } else if (day.xp > 0 || day.hasActivity) {
            barClass = "bar-active";
          }

          return `
            <div class="chart-col ${day.isToday ? 'col-today' : ''}">
              <div class="bar-tooltip">${day.xp} XP (${day.count} tasks)</div>
              <div class="bar-track">
                <div class="bar-fill ${barClass}" style="height: ${heightPercent}%;"></div>
              </div>
              <span class="chart-day-label">${day.dayLabel}</span>
              <span class="chart-date-sub">${day.date.slice(8)}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Activity Icon Helper
  function getActivityIcon(type) {
    switch(type) {
      case 'lesson':
        return `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A.5.5 0 0 0 6 19.5v-15A2.5 2.5 0 0 1 8.5 2H20v15H6.5"/></svg>`;
      case 'quiz':
        return `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2"/></svg>`;
      case 'challenge':
        return `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
      case 'quest':
        return `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>`;
    }
  }

  // Escape HTML to prevent XSS
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Event Handlers
  function attachEvents(nextLesson) {
    const continueBtn = document.getElementById("btn-continue-lesson");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        if (window.CQ_LESSONS && nextLesson) {
          window.location.hash = "#learn";
          setTimeout(() => {
            window.CQ_LESSONS.openLesson(nextLesson.id);
          }, 50);
        }
      });
    }

    const claimBtn = document.getElementById("btn-claim-quest");
    if (claimBtn) {
      claimBtn.addEventListener("click", () => {
        const result = CQ_STORAGE.claimDailyQuestBonus();
        if (result.success) {
          if (window.CQ_APP) {
            window.CQ_APP.showToast("Daily Quest Completed!", `Earned +${result.xpAwarded} Bonus XP!`, "gold");
            if (result.leveledUp) {
              window.CQ_APP.showLevelUpModal(result.newLevel);
            }
            if (result.unlockedBadges && result.unlockedBadges.length > 0) {
              result.unlockedBadges.forEach(b => window.CQ_APP.showBadgeUnlock(b));
            }
          }
          render();
        } else {
          if (window.CQ_APP) {
            window.CQ_APP.showToast("Cannot Claim", result.reason, "info");
          }
        }
      });
    }
  }

  return {
    render: render
  };
})();

// Export to window
if (typeof window !== "undefined") {
  window.CQ_DASHBOARD = CQ_DASHBOARD;
}

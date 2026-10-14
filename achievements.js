/**
 * CodeQuest - Achievements & Badges Controller
 * Renders badges with locked/unlocked visual states, unlock timestamps,
 * criteria explanations, and filter tabs.
 */

const CQ_ACHIEVEMENTS = (function() {
  let activeFilter = "all"; // 'all', 'unlocked', 'locked'

  // Format date helper
  function formatUnlockDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Get SVG icon based on badge icon name
  function getBadgeIcon(iconName, isUnlocked) {
    const strokeColor = isUnlocked ? "#F59E0B" : "#64748B";
    const fillColor = isUnlocked ? "rgba(245, 158, 11, 0.2)" : "rgba(100, 116, 139, 0.1)";

    switch (iconName) {
      case "footsteps":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>`;
      case "trophy":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"><path d="M6 9V2h12v7a6 6 0 01-12 0zm0 0H2v2a4 4 0 004 4m12-6h4v2a4 4 0 01-4 4M9 22h6m-3-7v7"/></svg>`;
      case "star":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${isUnlocked ? '#F59E0B' : fillColor}" stroke="${strokeColor}" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      case "puzzle":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"><path d="M20.5 11H19V7a2 2 0 00-2-2h-4V3.5a2.5 2.5 0 00-5 0V5H4a2 2 0 00-2 2v4h1.5a2.5 2.5 0 010 5H2v4a2 2 0 002 2h4v-1.5a2.5 2.5 0 015 0V22h4a2 2 0 002-2v-4h1.5a2.5 2.5 0 000-5z"/></svg>`;
      case "book-open":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`;
      case "crown":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5z"/></svg>`;
      case "calendar":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
      case "zap":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${isUnlocked ? '#8B5CF6' : fillColor}" stroke="${strokeColor}" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      case "code":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
      case "shield":
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" width="32" height="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;
    }
  }

  // Calculate current progress towards badge criteria
  function getBadgeProgress(badge, progress) {
    const lessonsCount = Object.keys(progress.completedLessons || {}).length;
    const challengesCount = Object.keys(progress.completedChallenges || {}).length;
    const quizzesCount = (progress.quizHistory || []).length;
    const distinctDates = (progress.activityDates || []).length;
    const totalXP = progress.xp || 0;

    let pyLessons = 0;
    let cLessons = 0;
    Object.keys(progress.completedLessons || {}).forEach(id => {
      if (id.startsWith("py-")) pyLessons++;
      if (id.startsWith("c-")) cLessons++;
    });

    switch (badge.criteriaType) {
      case "lessons_count":
        return { current: lessonsCount, target: badge.threshold, unit: "lessons" };
      case "quizzes_count":
        return { current: quizzesCount, target: badge.threshold, unit: "quizzes" };
      case "quiz_perfect":
        const hasPerfect = (progress.quizHistory || []).some(q => q.percentage === 100);
        return { current: hasPerfect ? 1 : 0, target: 1, unit: "100% quiz" };
      case "challenges_count":
        return { current: challengesCount, target: badge.threshold, unit: "challenges" };
      case "distinct_dates":
        return { current: distinctDates, target: badge.threshold, unit: "days" };
      case "total_xp":
        return { current: totalXP, target: badge.threshold, unit: "XP" };
      case "python_lessons_count":
        return { current: pyLessons, target: badge.threshold, unit: "Python lessons" };
      case "c_lessons_count":
        return { current: cLessons, target: badge.threshold, unit: "C lessons" };
      default:
        return { current: 0, target: badge.threshold || 1, unit: "tasks" };
    }
  }

  // Main Render Function
  function render() {
    const container = document.getElementById("achievements-view");
    if (!container) return;

    const progress = CQ_STORAGE.getProgress();
    const badges = CQ_DATA.achievements;
    const unlockedMap = progress.unlockedAchievements || {};
    const unlockedCount = Object.keys(unlockedMap).length;
    const percentUnlocked = Math.round((unlockedCount / badges.length) * 100);

    // Filter badges
    const filteredBadges = badges.filter(badge => {
      const isUnlocked = !!unlockedMap[badge.id];
      if (activeFilter === "unlocked" && !isUnlocked) return false;
      if (activeFilter === "locked" && isUnlocked) return false;
      return true;
    });

    container.innerHTML = `
      <!-- Achievements Header -->
      <section class="achievements-header animate-fade-in" aria-label="Achievements Overview">
        <div class="achievements-header-text">
          <div class="badge-tag">
            <span class="pulse-dot"></span>
            Trophy Room
          </div>
          <h1 class="achievements-title">Achievements & Badges</h1>
          <p class="achievements-subtitle">
            Earn permanent recognition for learning milestones, study streaks, high quiz scores, and algorithm problem solving.
          </p>
        </div>

        <!-- Trophy Summary Card -->
        <div class="achievements-summary-card">
          <div class="trophy-meta-row">
            <div class="trophy-count-big">
              <span class="gold-text">${unlockedCount}</span> <span class="slash-total">/ ${badges.length}</span>
            </div>
            <div class="trophy-percent-badge">${percentUnlocked}% Complete</div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill gold-fill" style="width: ${percentUnlocked}%;"></div>
          </div>
          <span class="trophy-subtext">${badges.length - unlockedCount} more badges to conquer</span>
        </div>
      </section>

      <!-- Filter Tabs -->
      <div class="achievements-filter-tabs" role="tablist">
        <button class="ach-tab-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">
          All Badges (${badges.length})
        </button>
        <button class="ach-tab-btn ${activeFilter === 'unlocked' ? 'active' : ''}" data-filter="unlocked">
          Unlocked (${unlockedCount})
        </button>
        <button class="ach-tab-btn ${activeFilter === 'locked' ? 'active' : ''}" data-filter="locked">
          Locked (${badges.length - unlockedCount})
        </button>
      </div>

      <!-- Badges Grid -->
      <section class="achievements-grid" aria-label="Badges List">
        ${filteredBadges.map(badge => {
          const isUnlocked = !!unlockedMap[badge.id];
          const unlockDate = unlockedMap[badge.id];
          const prog = getBadgeProgress(badge, progress);
          const currentVal = Math.min(prog.target, prog.current);
          const progPercent = Math.min(100, Math.round((currentVal / prog.target) * 100));

          return `
            <div class="card badge-card ${isUnlocked ? 'badge-card-unlocked' : 'badge-card-locked'}">
              <div class="badge-icon-holder ${isUnlocked ? 'icon-glow-gold' : 'icon-dimmed'}">
                ${getBadgeIcon(badge.icon, isUnlocked)}
                ${isUnlocked ? '<div class="unlock-sparkle">★</div>' : ''}
              </div>

              <div class="badge-info">
                <div class="badge-title-row">
                  <h3 class="badge-title">${badge.title}</h3>
                  <span class="badge-state-pill ${isUnlocked ? 'pill-unlocked' : 'pill-locked'}">
                    ${isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <p class="badge-desc">${badge.description}</p>

                <!-- Progress / Date Footer -->
                <div class="badge-card-footer">
                  ${isUnlocked ? `
                    <div class="unlocked-date-badge">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Unlocked on ${formatUnlockDate(unlockDate)}
                    </div>
                  ` : `
                    <div class="badge-progress-box">
                      <div class="badge-progress-labels">
                        <span>Progress</span>
                        <span>${currentVal} / ${prog.target} ${prog.unit}</span>
                      </div>
                      <div class="progress-bar-container">
                        <div class="progress-bar-fill gold-fill" style="width: ${progPercent}%;"></div>
                      </div>
                    </div>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </section>
    `;

    attachEvents();
  }

  // Attach filter tab events
  function attachEvents() {
    document.querySelectorAll(".ach-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const f = e.currentTarget.dataset.filter;
        if (f) {
          activeFilter = f;
          render();
        }
      });
    });
  }

  return {
    render: render
  };
})();

// Export to window
if (typeof window !== "undefined") {
  window.CQ_ACHIEVEMENTS = CQ_ACHIEVEMENTS;
}

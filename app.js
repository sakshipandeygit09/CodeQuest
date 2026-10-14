/**
 * CodeQuest - Core Application Controller
 * Handles SPA hash routing, sidebar navigation, onboarding flow,
 * toast notifications, level-up celebrations, leaderboard, and profile/settings.
 */

const CQ_APP = (function() {
  // Routes mapping
  const ROUTES = ["dashboard", "learn", "quizzes", "challenges", "achievements", "leaderboard", "profile"];
  let currentRoute = "dashboard";

  // Init Application
  function init() {
    // 1. Initialize sub-controllers
    if (window.CQ_LESSONS) window.CQ_LESSONS.init();
    if (window.CQ_QUIZZES) window.CQ_QUIZZES.init();
    if (window.CQ_CHALLENGES) window.CQ_CHALLENGES.init();

    // 2. Setup hash change listener
    window.addEventListener("hashchange", handleRouteChange);

    // 3. Setup storage subscription to auto-update header stats
    CQ_STORAGE.subscribe((event, data) => {
      updateTopbarStats();
      if (event === "data_reset") {
        checkOnboarding();
        navigateTo("dashboard");
      }
    });

    // 4. Initial Topbar Stats
    updateTopbarStats();

    // 5. Check Onboarding
    checkOnboarding();

    // 6. Setup Global Navigation and Event Handlers
    attachGlobalEvents();

    // 7. Route to initial view
    handleRouteChange();
  }

  // Check if first-time user
  function checkOnboarding() {
    const user = CQ_STORAGE.getUser();
    const modal = document.getElementById("onboarding-modal");
    if (!modal) return;

    if (!user.onboardingCompleted) {
      modal.classList.add("modal-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-locked");
    } else {
      modal.classList.remove("modal-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-locked");
    }
  }

  // Handle Hash Route Change
  function handleRouteChange() {
    let hash = window.location.hash.replace("#", "").toLowerCase().trim();
    if (!hash || !ROUTES.includes(hash)) {
      hash = "dashboard";
    }
    navigateTo(hash, false);
  }

  // Navigate to specific route
  function navigateTo(routeName, updateHash = true) {
    if (!ROUTES.includes(routeName)) routeName = "dashboard";
    currentRoute = routeName;

    if (updateHash && window.location.hash !== `#${routeName}`) {
      window.location.hash = `#${routeName}`;
      return;
    }

    // Update active nav links
    document.querySelectorAll(".nav-link, .mobile-nav-item").forEach(link => {
      const linkRoute = link.getAttribute("data-route");
      if (linkRoute === routeName) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });

    // Toggle views visibility
    ROUTES.forEach(route => {
      const el = document.getElementById(`${route}-view`);
      if (el) {
        if (route === routeName) {
          el.classList.remove("hidden");
          el.setAttribute("aria-hidden", "false");
        } else {
          el.classList.add("hidden");
          el.setAttribute("aria-hidden", "true");
        }
      }
    });

    // Close mobile drawer if open
    closeMobileSidebar();

    // Scroll main window to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Render corresponding module view
    renderCurrentRoute(routeName);
  }

  // Render view by route
  function renderCurrentRoute(route) {
    switch(route) {
      case "dashboard":
        if (window.CQ_DASHBOARD) window.CQ_DASHBOARD.render();
        break;
      case "learn":
        if (window.CQ_LESSONS) window.CQ_LESSONS.render();
        break;
      case "quizzes":
        if (window.CQ_QUIZZES) window.CQ_QUIZZES.render();
        break;
      case "challenges":
        if (window.CQ_CHALLENGES) window.CQ_CHALLENGES.render();
        break;
      case "achievements":
        if (window.CQ_ACHIEVEMENTS) window.CQ_ACHIEVEMENTS.render();
        break;
      case "leaderboard":
        renderLeaderboard();
        break;
      case "profile":
        renderProfile();
        break;
    }
    updateTopbarStats();
  }

  // Update Topbar Stats Pill
  function updateTopbarStats() {
    const user = CQ_STORAGE.getUser();
    const progress = CQ_STORAGE.getProgress();
    const levelInfo = CQ_STORAGE.getLevelInfo(progress.xp);

    const xpPill = document.getElementById("topbar-xp");
    const streakPill = document.getElementById("topbar-streak");
    const levelPill = document.getElementById("topbar-level");
    const userNameEl = document.getElementById("topbar-username");
    const avatarEl = document.getElementById("topbar-avatar");

    if (xpPill) xpPill.textContent = `${progress.xp.toLocaleString()} XP`;
    if (streakPill) streakPill.textContent = `${progress.currentStreak}d`;
    if (levelPill) levelPill.textContent = `Lvl ${levelInfo.level}`;
    if (userNameEl) userNameEl.textContent = user.displayName;
    if (avatarEl) {
      const initials = user.displayName
        .split(" ")
        .map(n => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "CQ";
      avatarEl.textContent = initials;
    }
  }

  // Render Leaderboard View
  function renderLeaderboard() {
    const container = document.getElementById("leaderboard-view");
    if (!container) return;

    const user = CQ_STORAGE.getUser();
    const progress = CQ_STORAGE.getProgress();
    const levelInfo = CQ_STORAGE.getLevelInfo(progress.xp);

    // Build combined leaderboard with user and demo peers
    const userInitials = user.displayName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "YOU";

    const allProfiles = [
      ...CQ_DATA.leaderboardProfiles,
      {
        id: "current_user",
        name: user.displayName + " (You)",
        avatar: userInitials,
        xp: progress.xp,
        level: levelInfo.level,
        title: levelInfo.title,
        badge: levelInfo.level >= 4 ? "Gold" : levelInfo.level >= 2 ? "Silver" : "Bronze",
        isCurrentUser: true
      }
    ];

    // Sort descending by XP
    allProfiles.sort((a, b) => b.xp - a.xp);

    // Assign rank
    allProfiles.forEach((p, idx) => {
      p.rank = idx + 1;
    });

    const userRank = allProfiles.find(p => p.isCurrentUser).rank;

    container.innerHTML = `
      <section class="leaderboard-header animate-fade-in" aria-label="Leaderboard Overview">
        <div class="leaderboard-header-text">
          <div class="badge-tag">
            <span class="pulse-dot"></span>
            Peer Rankings
          </div>
          <h1 class="leaderboard-title">Campus Cohort Leaderboard</h1>
          <p class="leaderboard-subtitle">
            Compare your learning velocity against your study group. Stay consistent with daily lessons and quizzes to climb ranks!
          </p>
        </div>

        <div class="card user-rank-hero-card">
          <span class="card-eyebrow">YOUR CURRENT STANDING</span>
          <div class="user-rank-display">
            <div class="rank-number-box">
              <span class="rank-hash">#</span><span class="rank-big">${userRank}</span>
            </div>
            <div class="rank-details">
              <strong>${escapeHTML(user.displayName)}</strong>
              <span>${progress.xp.toLocaleString()} XP • Level ${levelInfo.level}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Transparent Demo Disclaimer -->
      <div class="card notice-banner">
        <div class="notice-icon-col">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div class="notice-text-col">
          <strong>Cohort Demo Simulation:</strong>
          Peer entries shown below (Sarah, Alex, Priya, etc.) represent sample student profiles from the 2026 CS cohort. Your own row is computed live from your local progress in LocalStorage.
        </div>
      </div>

      <!-- Leaderboard Table Card -->
      <div class="card leaderboard-table-card">
        <div class="table-responsive">
          <table class="data-table leaderboard-table" aria-label="Cohort rankings table">
            <thead>
              <tr>
                <th class="th-rank">Rank</th>
                <th class="th-student">Student</th>
                <th class="th-level">Level & Title</th>
                <th class="th-xp text-right">Total XP</th>
              </tr>
            </thead>
            <tbody>
              ${allProfiles.map(p => {
                let rankBadge = `<span class="rank-chip rank-${p.rank}">${p.rank}</span>`;
                if (p.rank === 1) rankBadge = `<span class="rank-medal medal-gold" title="1st Place">🥇 1</span>`;
                if (p.rank === 2) rankBadge = `<span class="rank-medal medal-silver" title="2nd Place">🥈 2</span>`;
                if (p.rank === 3) rankBadge = `<span class="rank-medal medal-bronze" title="3rd Place">🥉 3</span>`;

                return `
                  <tr class="${p.isCurrentUser ? 'highlight-user-row' : ''}">
                    <td class="td-rank">${rankBadge}</td>
                    <td class="td-student">
                      <div class="student-cell">
                        <div class="student-avatar ${p.isCurrentUser ? 'avatar-user' : ''}">
                          ${escapeHTML(p.avatar)}
                        </div>
                        <div class="student-info">
                          <strong class="student-name">
                            ${escapeHTML(p.name)}
                            ${p.isCurrentUser ? '<span class="you-badge">YOU</span>' : '<span class="demo-tag">Sample</span>'}
                          </strong>
                        </div>
                      </div>
                    </td>
                    <td class="td-level">
                      <span class="level-indicator">Level ${p.level}</span>
                      <span class="level-sub-title">${escapeHTML(p.title)}</span>
                    </td>
                    <td class="td-xp text-right">
                      <strong class="xp-number text-purple">${p.xp.toLocaleString()} XP</strong>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Render Profile / Settings View
  function renderProfile() {
    const container = document.getElementById("profile-view");
    if (!container) return;

    const user = CQ_STORAGE.getUser();
    const progress = CQ_STORAGE.getProgress();
    const levelInfo = CQ_STORAGE.getLevelInfo(progress.xp);

    const totalLessons = CQ_DATA.pythonLessons.length + CQ_DATA.cLessons.length;
    const completedLessonsCount = Object.keys(progress.completedLessons || {}).length;
    const quizzesCount = (progress.quizHistory || []).length;
    const challengesCount = Object.keys(progress.completedChallenges || {}).length;
    const badgesCount = Object.keys(progress.unlockedAchievements || {}).length;
    const totalBadges = CQ_DATA.achievements.length;

    container.innerHTML = `
      <section class="profile-header animate-fade-in" aria-label="Profile and Settings">
        <div class="profile-hero-card">
          <div class="profile-avatar-big">
            ${user.displayName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "CQ"}
          </div>
          <div class="profile-hero-info">
            <h1 class="profile-hero-name">${escapeHTML(user.displayName)}</h1>
            <p class="profile-hero-level">Level ${levelInfo.level}: <span class="gradient-text">${levelInfo.title}</span></p>
            <div class="profile-tag-row">
              <span class="meta-tag track-pill ${user.preferredLanguage}">
                Primary Track: ${user.preferredLanguage === 'c' ? 'C Language' : 'Python 3'}
              </span>
              <span class="meta-tag">Goal: ${user.dailyGoalMinutes} mins / day</span>
              <span class="meta-tag text-purple">${progress.xp.toLocaleString()} Total XP</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Profile Grid Layout -->
      <div class="profile-content-grid">
        <!-- Column 1: Editable Preferences Form -->
        <div class="card settings-card" aria-label="User Preferences">
          <div class="card-header-flex">
            <div>
              <span class="card-eyebrow">PREFERENCES</span>
              <h2 class="card-heading">Learning Settings</h2>
            </div>
          </div>
          <p class="card-subtext">Update your display moniker, primary curriculum focus, and daily target.</p>

          <form id="profile-settings-form" class="settings-form">
            <div class="form-group">
              <label for="input-display-name" class="form-label">Display Name</label>
              <input type="text" id="input-display-name" class="form-input" required maxlength="30" value="${escapeHTML(user.displayName)}" placeholder="e.g. Alex Hunter">
            </div>

            <div class="form-group">
              <label for="select-preferred-track" class="form-label">Preferred Programming Track</label>
              <select id="select-preferred-track" class="form-select">
                <option value="python" ${user.preferredLanguage === 'python' ? 'selected' : ''}>Python Developer Track</option>
                <option value="c" ${user.preferredLanguage === 'c' ? 'selected' : ''}>C Systems Programming Track</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Daily Learning Goal</label>
              <div class="goal-radio-row">
                <label class="goal-radio-chip ${user.dailyGoalMinutes === 10 ? 'active' : ''}">
                  <input type="radio" name="dailyGoal" value="10" ${user.dailyGoalMinutes === 10 ? 'checked' : ''}>
                  10 mins
                </label>
                <label class="goal-radio-chip ${user.dailyGoalMinutes === 20 ? 'active' : ''}">
                  <input type="radio" name="dailyGoal" value="20" ${user.dailyGoalMinutes === 20 ? 'checked' : ''}>
                  20 mins
                </label>
                <label class="goal-radio-chip ${user.dailyGoalMinutes === 30 ? 'active' : ''}">
                  <input type="radio" name="dailyGoal" value="30" ${user.dailyGoalMinutes === 30 ? 'checked' : ''}>
                  30 mins
                </label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" id="btn-save-settings">
              Save Preferences
            </button>
          </form>
        </div>

        <!-- Column 2: Lifetime Stats Overview -->
        <div class="card lifetime-stats-card" aria-label="Lifetime Statistics">
          <div class="card-header-flex">
            <div>
              <span class="card-eyebrow">RECORD</span>
              <h2 class="card-heading">Academic Dossier</h2>
            </div>
          </div>

          <div class="dossier-grid">
            <div class="dossier-item">
              <span class="dossier-num text-purple">${progress.xp.toLocaleString()}</span>
              <span class="dossier-label">Total XP Earned</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-num text-gold">${progress.currentStreak}d</span>
              <span class="dossier-label">Current Streak</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-num text-gold">${progress.longestStreak}d</span>
              <span class="dossier-label">Longest Streak</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-num text-blue">${completedLessonsCount} / ${totalLessons}</span>
              <span class="dossier-label">Lessons Completed</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-num text-blue">${quizzesCount}</span>
              <span class="dossier-label">Quizzes Finished</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-num text-green">${challengesCount} / 10</span>
              <span class="dossier-label">Challenges Solved</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-num text-gold">${badgesCount} / ${totalBadges}</span>
              <span class="dossier-label">Badges Unlocked</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-num">${(progress.activityDates || []).length}</span>
              <span class="dossier-label">Active Calendar Days</span>
            </div>
          </div>

          <!-- Danger Zone: Reset Data -->
          <div class="danger-zone-box">
            <div class="danger-zone-header">
              <h3 class="danger-title">Demo Reset Zone</h3>
              <p class="danger-desc">
                Clear all locally stored CodeQuest progress and restart the onboarding walkthrough. This action only affects CodeQuest LocalStorage keys.
              </p>
            </div>
            <button class="btn btn-danger" id="btn-open-reset-modal">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              Reset Demo Data...
            </button>
          </div>
        </div>
      </div>
    `;

    attachProfileEvents();
  }

  // Attach Profile Events
  function attachProfileEvents() {
    const form = document.getElementById("profile-settings-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("input-display-name");
        const trackSelect = document.getElementById("select-preferred-track");
        const goalRadios = document.querySelectorAll('input[name="dailyGoal"]:checked');

        const newName = nameInput ? nameInput.value.trim() : "";
        const newTrack = trackSelect ? trackSelect.value : "python";
        const newGoal = goalRadios.length ? parseInt(goalRadios[0].value, 10) : 15;

        if (!newName) {
          showToast("Name Required", "Please enter a valid display name.", "error");
          return;
        }

        const user = CQ_STORAGE.getUser();
        user.displayName = newName;
        user.preferredLanguage = newTrack;
        user.dailyGoalMinutes = newGoal;

        CQ_STORAGE.saveUser(user);
        showToast("Settings Saved", "Your profile preferences have been successfully updated.", "success");
        renderProfile();
      });
    }

    // Radio chips UI sync
    document.querySelectorAll(".goal-radio-chip input").forEach(radio => {
      radio.addEventListener("change", (e) => {
        document.querySelectorAll(".goal-radio-chip").forEach(c => c.classList.remove("active"));
        if (e.target.checked) {
          e.target.closest(".goal-radio-chip").classList.add("active");
        }
      });
    });

    // Reset button -> open modal
    const resetOpenBtn = document.getElementById("btn-open-reset-modal");
    const resetModal = document.getElementById("reset-confirm-modal");
    if (resetOpenBtn && resetModal) {
      resetOpenBtn.addEventListener("click", () => {
        resetModal.classList.add("modal-open");
        resetModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-locked");
      });
    }
  }

  // Attach Global App Events (Sidebar, Onboarding, Modals)
  function attachGlobalEvents() {
    // 1. Navigation items click
    document.querySelectorAll(".nav-link, .mobile-nav-item").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const route = link.getAttribute("data-route");
        if (route) {
          navigateTo(route);
        }
      });
    });

    // 2. Mobile sidebar drawer toggles
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileOverlay = document.getElementById("sidebar-overlay");
    const sidebar = document.getElementById("app-sidebar");

    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar-mobile-open");
        if (mobileOverlay) mobileOverlay.classList.toggle("overlay-visible");
      });
    }

    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", closeMobileSidebar);
    }

    // 3. Desktop Sidebar Collapse Toggle
    const toggleCollapseBtn = document.getElementById("btn-toggle-sidebar");
    if (toggleCollapseBtn && sidebar) {
      toggleCollapseBtn.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar-collapsed");
        document.body.classList.toggle("sidebar-is-collapsed");
      });
    }

    // 4. Onboarding Modal Form Submit
    const onboardingForm = document.getElementById("onboarding-form");
    if (onboardingForm) {
      onboardingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("onboarding-name");
        const trackRadios = document.querySelectorAll('input[name="onboardingTrack"]:checked');
        const goalRadios = document.querySelectorAll('input[name="onboardingGoal"]:checked');

        const name = nameInput ? nameInput.value.trim() : "";
        const track = trackRadios.length ? trackRadios[0].value : "python";
        const goal = goalRadios.length ? parseInt(goalRadios[0].value, 10) : 15;

        if (!name) {
          showToast("Name Required", "Please provide a display name to get started.", "error");
          return;
        }

        const user = CQ_STORAGE.getUser();
        user.displayName = name;
        user.preferredLanguage = track;
        user.dailyGoalMinutes = goal;
        user.onboardingCompleted = true;

        CQ_STORAGE.saveUser(user);

        const modal = document.getElementById("onboarding-modal");
        if (modal) {
          modal.classList.remove("modal-open");
          modal.setAttribute("aria-hidden", "true");
          document.body.classList.remove("modal-locked");
        }

        showToast("Welcome to CodeQuest!", `Greetings, ${name}! Your quest begins now.`, "gold");
        navigateTo("dashboard");
      });
    }

    // 5. Reset Confirm Modal Events
    const resetModal = document.getElementById("reset-confirm-modal");
    const confirmResetBtn = document.getElementById("btn-confirm-reset");
    const cancelResetBtn = document.getElementById("btn-cancel-reset");

    const closeResetModal = () => {
      if (resetModal) {
        resetModal.classList.remove("modal-open");
        resetModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-locked");
      }
    };

    if (cancelResetBtn) cancelResetBtn.addEventListener("click", closeResetModal);
    if (confirmResetBtn) {
      confirmResetBtn.addEventListener("click", () => {
        closeResetModal();
        CQ_STORAGE.resetAllData();
        showToast("Data Reset", "All demo progress has been cleared.", "info");
      });
    }

    // 6. Level Up Modal Close
    const levelUpModal = document.getElementById("levelup-modal");
    const levelUpCloseBtn = document.getElementById("btn-close-levelup");
    if (levelUpCloseBtn && levelUpModal) {
      levelUpCloseBtn.addEventListener("click", () => {
        levelUpModal.classList.remove("modal-open");
        levelUpModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-locked");
      });
    }
  }

  // Close Mobile Drawer
  function closeMobileSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    const mobileOverlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.remove("sidebar-mobile-open");
    if (mobileOverlay) mobileOverlay.classList.remove("overlay-visible");
  }

  // Show Toast Notification
  function showToast(title, message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type} animate-slide-in`;

    let iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>`;
    if (type === "success") {
      iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
    } else if (type === "gold") {
      iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon-wrap">${iconSvg}</div>
      <div class="toast-content">
        <h4 class="toast-title">${escapeHTML(title)}</h4>
        <p class="toast-message">${escapeHTML(message)}</p>
      </div>
      <button class="toast-close" aria-label="Dismiss">&times;</button>
    `;

    container.appendChild(toast);

    const close = () => {
      toast.classList.add("toast-hiding");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    toast.querySelector(".toast-close").addEventListener("click", close);
    setTimeout(close, 4500);
  }

  // Show Level-Up Modal
  function showLevelUpModal(levelInfo) {
    const modal = document.getElementById("levelup-modal");
    if (!modal) return;

    const levelNumEl = document.getElementById("levelup-number");
    const levelTitleEl = document.getElementById("levelup-title");

    if (levelNumEl) levelNumEl.textContent = `LEVEL ${levelInfo.level}`;
    if (levelTitleEl) levelTitleEl.textContent = levelInfo.title;

    modal.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-locked");
  }

  // Show Badge Unlock Toast
  function showBadgeUnlock(badge) {
    showToast("Badge Unlocked!", `Achievement: ${badge.title} — ${badge.description}`, "gold");
  }

  // Escape HTML
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Public API
  return {
    init: init,
    navigateTo: navigateTo,
    showToast: showToast,
    showLevelUpModal: showLevelUpModal,
    showBadgeUnlock: showBadgeUnlock
  };
})();

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  CQ_APP.init();
});

// Export to window
if (typeof window !== "undefined") {
  window.CQ_APP = CQ_APP;
}

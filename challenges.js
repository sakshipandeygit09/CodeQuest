/**
 * CodeQuest - Coding Challenges Controller
 * Handles 10 algorithmic problems, difficulty/search filtering,
 * interactive hints, Python/C dual solutions, algorithm explanations,
 * and single-reward "Mark as Solved" completion logic.
 */

const CQ_CHALLENGES = (function() {
  let searchQuery = "";
  let filterDifficulty = "all"; // 'all', 'easy', 'medium'
  let filterStatus = "all"; // 'all', 'solved', 'unsolved'
  let activeChallengeId = null;
  let activeLangTab = "python"; // 'python' or 'c'

  // Initialize
  function init() {
    const user = CQ_STORAGE.getUser();
    if (user && (user.preferredLanguage === "c" || user.preferredLanguage === "python")) {
      activeLangTab = user.preferredLanguage;
    }
  }

  // Filter challenges list
  function getFilteredChallenges() {
    const list = CQ_DATA.challenges;
    const progress = CQ_STORAGE.getProgress();

    return list.filter(ch => {
      // Search
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = ch.title.toLowerCase().includes(q);
        const matchStatement = ch.problemStatement.toLowerCase().includes(q);
        const matchCat = ch.category.toLowerCase().includes(q);
        if (!matchTitle && !matchStatement && !matchCat) return false;
      }

      // Difficulty
      if (filterDifficulty !== "all") {
        if (ch.difficulty.toLowerCase() !== filterDifficulty.toLowerCase()) return false;
      }

      // Status
      const isSolved = !!progress.completedChallenges[ch.id];
      if (filterStatus === "solved" && !isSolved) return false;
      if (filterStatus === "unsolved" && isSolved) return false;

      return true;
    });
  }

  // Main Render Function
  function render() {
    const container = document.getElementById("challenges-view");
    if (!container) return;

    const progress = CQ_STORAGE.getProgress();
    const all = CQ_DATA.challenges;
    const solvedCount = Object.keys(progress.completedChallenges || {}).length;
    const filtered = getFilteredChallenges();

    container.innerHTML = `
      <!-- Challenges Header -->
      <section class="challenges-header animate-fade-in" aria-label="Challenges Header">
        <div class="challenges-header-text">
          <div class="badge-tag">
            <span class="pulse-dot"></span>
            Algorithmic Problem Solving
          </div>
          <h1 class="challenges-title">Coding Challenges Arena</h1>
          <p class="challenges-subtitle">
            Hone your core algorithmic logic with foundational programming problems. Inspect problem statements, review test cases, study language implementations, and analyze algorithms.
          </p>
        </div>

        <div class="challenges-summary-card">
          <div class="milestone-header">
            <span class="milestone-label">Solved Progress</span>
            <span class="milestone-val text-green">${solvedCount} / ${all.length} Solved</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill green-fill" style="width: ${Math.round((solvedCount / all.length) * 100)}%;"></div>
          </div>
        </div>
      </section>

      <!-- Transparent Execution Notice -->
      <div class="card notice-banner">
        <div class="notice-icon-col">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div class="notice-text-col">
          <strong>Educational Reference Mode:</strong>
          CodeQuest provides verified, production-grade reference implementations in both Python and C with complete algorithm explanations. This static platform does not execute arbitrary code in-browser or connect to remote compilers for security and reliability.
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <section class="filter-controls-bar" aria-label="Challenge Filters">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" class="search-icon"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2"/></svg>
          <input type="text" id="challenge-search-input" class="search-input" placeholder="Search challenges by title, category, or problem..." value="${escapeHTML(searchQuery)}" aria-label="Search challenges">
          ${searchQuery ? `<button class="clear-search-btn" id="clear-challenge-search" title="Clear search">&times;</button>` : ''}
        </div>

        <div class="filter-dropdowns-group">
          <div class="select-wrapper">
            <label for="filter-ch-difficulty" class="sr-only">Difficulty</label>
            <select id="filter-ch-difficulty" class="filter-select" aria-label="Filter by difficulty">
              <option value="all" ${filterDifficulty === 'all' ? 'selected' : ''}>All Difficulties</option>
              <option value="easy" ${filterDifficulty === 'easy' ? 'selected' : ''}>Easy</option>
              <option value="medium" ${filterDifficulty === 'medium' ? 'selected' : ''}>Medium</option>
            </select>
          </div>

          <div class="select-wrapper">
            <label for="filter-ch-status" class="sr-only">Status</label>
            <select id="filter-ch-status" class="filter-select" aria-label="Filter by solved status">
              <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="unsolved" ${filterStatus === 'unsolved' ? 'selected' : ''}>Unsolved</option>
              <option value="solved" ${filterStatus === 'solved' ? 'selected' : ''}>Solved</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Challenges List -->
      <section class="challenges-grid" aria-label="Challenges List">
        ${filtered.length === 0 ? `
          <div class="empty-filter-state">
            <div class="empty-icon-shield">
              <svg viewBox="0 0 24 24" width="40" height="40" stroke="#94A3B8" fill="none" stroke-width="1.5"><polygon points="12 2 2 7 12 22 22 7 12 2"/></svg>
            </div>
            <h3>No matching challenges found</h3>
            <p>Try searching for a different keyword or reset your filters.</p>
            <button class="btn btn-secondary" id="btn-reset-ch-filters">Reset Filters</button>
          </div>
        ` : filtered.map(ch => {
          const isSolved = !!progress.completedChallenges[ch.id];
          return `
            <article class="card challenge-card ${isSolved ? 'challenge-card-solved' : ''}" data-challenge-id="${ch.id}">
              <div class="challenge-card-top">
                <span class="category-pill">${ch.category}</span>
                <span class="meta-tag difficulty-${ch.difficulty.toLowerCase()}">${ch.difficulty}</span>
              </div>
              <h3 class="challenge-card-title">${ch.title}</h3>
              <p class="challenge-card-desc">${ch.problemStatement}</p>

              <div class="challenge-card-footer">
                <div class="challenge-footer-left">
                  <span class="meta-chip text-purple">+${ch.xpReward} XP</span>
                </div>
                ${isSolved ? `
                  <span class="badge-status-completed"><span class="check-icon">✓</span> Solved</span>
                ` : `
                  <button class="btn btn-sm btn-primary open-challenge-btn" data-challenge-id="${ch.id}">
                    Solve Challenge
                  </button>
                `}
              </div>
            </article>
          `;
        }).join('')}
      </section>

      <!-- Challenge Detail Modal -->
      <div id="challenge-detail-modal" class="modal-backdrop" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="modal-dialog modal-xl modal-reader" id="challenge-detail-content">
          <!-- Dynamically populated by openChallenge() -->
        </div>
      </div>
    `;

    attachListEvents();
  }

  // Open Challenge Detail Modal
  function openChallenge(challengeId) {
    const ch = CQ_DATA.challenges.find(c => c.id === challengeId);
    if (!ch) return;

    activeChallengeId = challengeId;
    const progress = CQ_STORAGE.getProgress();
    const isSolved = !!progress.completedChallenges[ch.id];

    const modal = document.getElementById("challenge-detail-modal");
    const content = document.getElementById("challenge-detail-content");
    if (!modal || !content) return;

    content.innerHTML = `
      <!-- Header -->
      <div class="reader-header">
        <div class="reader-header-meta">
          <span class="category-pill">${ch.category}</span>
          <span class="meta-tag difficulty-${ch.difficulty.toLowerCase()}">${ch.difficulty}</span>
          <span class="meta-tag text-purple">+${ch.xpReward} XP</span>
          ${isSolved ? '<span class="meta-tag tag-completed">✓ Solved</span>' : ''}
        </div>
        <button class="modal-close-btn" id="btn-close-challenge" aria-label="Close modal">&times;</button>
      </div>

      <!-- Scrollable Body -->
      <div class="reader-body">
        <h2 class="reader-title">${ch.title}</h2>

        <!-- Problem Statement Box -->
        <section class="reader-section">
          <h3 class="reader-section-title"><span class="section-num">01</span> Problem Statement</h3>
          <p class="prose-p">${escapeHTML(ch.problemStatement)}</p>

          <div class="io-format-grid">
            <div class="io-box">
              <strong>Input Format:</strong>
              <p>${escapeHTML(ch.inputFormat)}</p>
            </div>
            <div class="io-box">
              <strong>Output Format:</strong>
              <p>${escapeHTML(ch.outputFormat)}</p>
            </div>
          </div>
        </section>

        <!-- Sample Test Cases -->
        <section class="reader-section">
          <h3 class="reader-section-title"><span class="section-num">02</span> Sample Test Cases</h3>
          <div class="test-cases-list">
            ${ch.sampleCases.map((tc, idx) => `
              <div class="test-case-item">
                <span class="test-case-badge">Case ${idx + 1}</span>
                <div class="test-case-body">
                  <div class="io-row">
                    <span class="io-label">Input:</span>
                    <code class="io-code">${escapeHTML(tc.input)}</code>
                  </div>
                  <div class="io-row">
                    <span class="io-label">Expected Output:</span>
                    <code class="io-code io-expected">${escapeHTML(tc.output)}</code>
                  </div>
                  <div class="tc-explanation">
                    <strong>Explanation:</strong> ${escapeHTML(tc.explanation)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Hint Accordion -->
        <section class="reader-section">
          <div class="accordion-item" id="hint-accordion">
            <button class="accordion-trigger" id="btn-toggle-hint" aria-expanded="false">
              <span class="accordion-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
                Need a Hint? Click to Reveal
              </span>
              <span class="accordion-arrow">▼</span>
            </button>
            <div class="accordion-content hidden" id="hint-content">
              <div class="hint-inner">
                <p>${escapeHTML(ch.hint)}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Solutions & Algorithm Explanation -->
        <section class="reader-section">
          <div class="accordion-item" id="solution-accordion">
            <button class="accordion-trigger" id="btn-toggle-solution" aria-expanded="false">
              <span class="accordion-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                View Verified Reference Solution & Algorithm Breakdown
              </span>
              <span class="accordion-arrow">▼</span>
            </button>
            <div class="accordion-content hidden" id="solution-content">
              <!-- Language Switcher Tabs for Code -->
              <div class="solution-tabs-header">
                <button class="sol-tab-btn ${activeLangTab === 'python' ? 'active' : ''}" data-sol-lang="python">Python Solution</button>
                <button class="sol-tab-btn ${activeLangTab === 'c' ? 'active' : ''}" data-sol-lang="c">C Solution</button>
              </div>

              <!-- Code Snippet Area -->
              <div class="code-block-wrapper">
                <div class="code-block-header">
                  <span class="code-lang-label" id="sol-lang-label">${activeLangTab === 'python' ? 'Python 3 Implementation' : 'C99 Implementation'}</span>
                  <button class="copy-code-btn" id="btn-copy-solution" data-code="${escapeAttribute(activeLangTab === 'python' ? ch.pythonSolution : ch.cSolution)}">Copy Code</button>
                </div>
                <pre class="code-snippet"><code id="solution-code-view">${escapeHTML(activeLangTab === 'python' ? ch.pythonSolution : ch.cSolution)}</code></pre>
              </div>

              <!-- Algorithm Explanation -->
              <div class="algo-explanation-box">
                <h4><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> Algorithm Breakdown</h4>
                <p>${escapeHTML(ch.algorithmExplanation)}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer Action -->
      <div class="reader-footer">
        <button class="btn btn-secondary" id="btn-modal-back">Back to Challenge List</button>
        <div class="reader-footer-action">
          ${isSolved ? `
            <div class="completed-indicator-pill">
              <span class="check-icon">✓</span> Challenge Solved (+30 XP Earned)
            </div>
          ` : `
            <button class="btn btn-success btn-lg" id="btn-solve-challenge" data-challenge-id="${ch.id}">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Mark as Solved (+30 XP)
            </button>
          `}
        </div>
      </div>
    `;

    modal.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-locked");

    attachModalEvents(ch);
  }

  // Attach List View Events
  function attachListEvents() {
    // Search input
    const searchInput = document.getElementById("challenge-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        render();
        const refreshed = document.getElementById("challenge-search-input");
        if (refreshed) {
          refreshed.focus();
          refreshed.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      });
    }

    // Clear search
    const clearBtn = document.getElementById("clear-challenge-search");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchQuery = "";
        render();
      });
    }

    // Difficulty filter
    const diffSelect = document.getElementById("filter-ch-difficulty");
    if (diffSelect) {
      diffSelect.addEventListener("change", (e) => {
        filterDifficulty = e.target.value;
        render();
      });
    }

    // Status filter
    const statusSelect = document.getElementById("filter-ch-status");
    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        filterStatus = e.target.value;
        render();
      });
    }

    // Reset filters
    const resetBtn = document.getElementById("btn-reset-ch-filters");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        searchQuery = "";
        filterDifficulty = "all";
        filterStatus = "all";
        render();
      });
    }

    // Click on challenge card
    document.querySelectorAll(".challenge-card, .open-challenge-btn").forEach(el => {
      el.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.challengeId;
        if (id) openChallenge(id);
      });
    });
  }

  // Attach Modal Events
  function attachModalEvents(ch) {
    const modal = document.getElementById("challenge-detail-modal");
    const closeBtn = document.getElementById("btn-close-challenge");
    const backBtn = document.getElementById("btn-modal-back");

    const closeModal = () => {
      if (modal) {
        modal.classList.remove("modal-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-locked");
      }
      render();
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (backBtn) backBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Toggle Hint Accordion
    const toggleHintBtn = document.getElementById("btn-toggle-hint");
    const hintContent = document.getElementById("hint-content");
    if (toggleHintBtn && hintContent) {
      toggleHintBtn.addEventListener("click", () => {
        const isHidden = hintContent.classList.contains("hidden");
        if (isHidden) {
          hintContent.classList.remove("hidden");
          toggleHintBtn.setAttribute("aria-expanded", "true");
          toggleHintBtn.querySelector(".accordion-arrow").textContent = "▲";
        } else {
          hintContent.classList.add("hidden");
          toggleHintBtn.setAttribute("aria-expanded", "false");
          toggleHintBtn.querySelector(".accordion-arrow").textContent = "▼";
        }
      });
    }

    // Toggle Solution Accordion
    const toggleSolBtn = document.getElementById("btn-toggle-solution");
    const solContent = document.getElementById("solution-content");
    if (toggleSolBtn && solContent) {
      toggleSolBtn.addEventListener("click", () => {
        const isHidden = solContent.classList.contains("hidden");
        if (isHidden) {
          solContent.classList.remove("hidden");
          toggleSolBtn.setAttribute("aria-expanded", "true");
          toggleSolBtn.querySelector(".accordion-arrow").textContent = "▲";
        } else {
          solContent.classList.add("hidden");
          toggleSolBtn.setAttribute("aria-expanded", "false");
          toggleSolBtn.querySelector(".accordion-arrow").textContent = "▼";
        }
      });
    }

    // Solution Language Tabs (Python vs C)
    document.querySelectorAll(".sol-tab-btn").forEach(tab => {
      tab.addEventListener("click", (e) => {
        const lang = e.currentTarget.dataset.solLang;
        if (lang) {
          activeLangTab = lang;
          document.querySelectorAll(".sol-tab-btn").forEach(t => t.classList.remove("active"));
          e.currentTarget.classList.add("active");

          const codeView = document.getElementById("solution-code-view");
          const langLabel = document.getElementById("sol-lang-label");
          const copyBtn = document.getElementById("btn-copy-solution");

          const codeStr = lang === "python" ? ch.pythonSolution : ch.cSolution;
          if (codeView) codeView.textContent = codeStr;
          if (langLabel) langLabel.textContent = lang === "python" ? "Python 3 Implementation" : "C99 Implementation";
          if (copyBtn) copyBtn.dataset.code = codeStr;
        }
      });
    });

    // Copy Solution Button
    const copySolBtn = document.getElementById("btn-copy-solution");
    if (copySolBtn) {
      copySolBtn.addEventListener("click", (e) => {
        const code = e.currentTarget.dataset.code;
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            const orig = e.currentTarget.textContent;
            e.currentTarget.textContent = "Copied!";
            setTimeout(() => {
              e.currentTarget.textContent = orig;
            }, 2000);
          }).catch(err => console.error("Clipboard copy error:", err));
        }
      });
    }

    // Mark as Solved Button
    const solveBtn = document.getElementById("btn-solve-challenge");
    if (solveBtn) {
      solveBtn.addEventListener("click", () => {
        const result = CQ_STORAGE.completeChallenge(ch.id, ch.title);
        if (result.success && result.isFirstTime) {
          if (window.CQ_APP) {
            window.CQ_APP.showToast("Challenge Solved!", `You solved "${ch.title}" (+${result.xpAwarded} XP)`, "success");
            if (result.leveledUp) {
              window.CQ_APP.showLevelUpModal(result.newLevel);
            }
            if (result.unlockedBadges && result.unlockedBadges.length > 0) {
              result.unlockedBadges.forEach(b => window.CQ_APP.showBadgeUnlock(b));
            }
          }
          openChallenge(ch.id);
        }
      });
    }
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

  // Escape attribute
  function escapeAttribute(str) {
    if (!str) return "";
    return String(str)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  return {
    init: init,
    render: render,
    openChallenge: openChallenge
  };
})();

// Export to window
if (typeof window !== "undefined") {
  window.CQ_CHALLENGES = CQ_CHALLENGES;
}

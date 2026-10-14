/**
 * CodeQuest - Lessons Module Controller
 * Handles track switching (Python / C), search, filters, progress track,
 * and the comprehensive interactive lesson reader with knowledge checks.
 */

const CQ_LESSONS = (function() {
  let currentTrack = "python"; // 'python' or 'c'
  let searchQuery = "";
  let filterDifficulty = "all"; // 'all', 'beginner', 'intermediate'
  let filterStatus = "all"; // 'all', 'completed', 'incomplete'
  let activeLessonId = null;

  // Initialize from user preference if available
  function init() {
    const user = CQ_STORAGE.getUser();
    if (user && (user.preferredLanguage === "c" || user.preferredLanguage === "python")) {
      currentTrack = user.preferredLanguage;
    }
  }

  // Get filtered lessons list
  function getFilteredLessons() {
    const lessons = currentTrack === "c" ? CQ_DATA.cLessons : CQ_DATA.pythonLessons;
    const progress = CQ_STORAGE.getProgress();

    return lessons.filter(lesson => {
      // Search
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = lesson.title.toLowerCase().includes(q);
        const matchObj = lesson.objective.toLowerCase().includes(q);
        if (!matchTitle && !matchObj) return false;
      }

      // Difficulty
      if (filterDifficulty !== "all") {
        if (lesson.difficulty.toLowerCase() !== filterDifficulty.toLowerCase()) return false;
      }

      // Status
      const isCompleted = !!progress.completedLessons[lesson.id];
      if (filterStatus === "completed" && !isCompleted) return false;
      if (filterStatus === "incomplete" && isCompleted) return false;

      return true;
    });
  }

  // Main Render Function
  function render() {
    const container = document.getElementById("learn-view");
    if (!container) return;

    const progress = CQ_STORAGE.getProgress();
    const allTrackLessons = currentTrack === "c" ? CQ_DATA.cLessons : CQ_DATA.pythonLessons;
    const completedCount = allTrackLessons.filter(l => progress.completedLessons[l.id]).length;
    const percent = Math.round((completedCount / allTrackLessons.length) * 100);
    const filtered = getFilteredLessons();

    container.innerHTML = `
      <!-- Track Header & Switcher -->
      <section class="learn-header animate-fade-in">
        <div class="learn-header-left">
          <div class="track-toggle-group" role="tablist" aria-label="Learning Track Switcher">
            <button class="track-toggle-btn ${currentTrack === 'python' ? 'active' : ''}" data-track="python" role="tab" aria-selected="${currentTrack === 'python'}">
              <svg viewBox="0 0 24 24" width="20" height="20" class="track-icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/></svg>
              Python Track
            </button>
            <button class="track-toggle-btn ${currentTrack === 'c' ? 'active' : ''}" data-track="c" role="tab" aria-selected="${currentTrack === 'c'}">
              <svg viewBox="0 0 24 24" width="20" height="20" class="track-icon"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/></svg>
              C Systems Track
            </button>
          </div>
          <p class="learn-subtitle">
            ${currentTrack === 'python' 
              ? 'Master modern Python 3 syntax, clean algorithmic logic, data structures, and problem solving.' 
              : 'Learn fundamental low-level systems programming, compilation, memory, and pointers in C.'}
          </p>
        </div>

        <!-- Track Progress Milestone Card -->
        <div class="track-milestone-card">
          <div class="milestone-header">
            <span class="milestone-label">${currentTrack === 'python' ? 'Python Mastery' : 'C Systems Mastery'}</span>
            <span class="milestone-val">${completedCount} / ${allTrackLessons.length} Done (${percent}%)</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill ${currentTrack === 'python' ? 'xp-fill' : 'blue-fill'}" style="width: ${percent}%;"></div>
          </div>
        </div>
      </section>

      <!-- Filter & Search Bar -->
      <section class="filter-controls-bar" aria-label="Lesson Filters">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" class="search-icon"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2"/></svg>
          <input type="text" id="lesson-search-input" class="search-input" placeholder="Search lessons by title or keyword..." value="${escapeHTML(searchQuery)}" aria-label="Search lessons">
          ${searchQuery ? `<button class="clear-search-btn" id="clear-lesson-search" title="Clear search">&times;</button>` : ''}
        </div>

        <div class="filter-dropdowns-group">
          <div class="select-wrapper">
            <label for="filter-difficulty" class="sr-only">Difficulty</label>
            <select id="filter-difficulty" class="filter-select" aria-label="Filter by difficulty">
              <option value="all" ${filterDifficulty === 'all' ? 'selected' : ''}>All Difficulties</option>
              <option value="beginner" ${filterDifficulty === 'beginner' ? 'selected' : ''}>Beginner</option>
              <option value="intermediate" ${filterDifficulty === 'intermediate' ? 'selected' : ''}>Intermediate</option>
            </select>
          </div>

          <div class="select-wrapper">
            <label for="filter-status" class="sr-only">Status</label>
            <select id="filter-status" class="filter-select" aria-label="Filter by completion status">
              <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="incomplete" ${filterStatus === 'incomplete' ? 'selected' : ''}>Incomplete</option>
              <option value="completed" ${filterStatus === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Lessons Grid -->
      <section class="lessons-grid" id="lessons-grid-container" aria-label="Lessons List">
        ${filtered.length === 0 ? `
          <div class="empty-filter-state">
            <div class="empty-icon-shield">
              <svg viewBox="0 0 24 24" width="40" height="40" stroke="#94A3B8" fill="none" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h3>No matching lessons found</h3>
            <p>Try adjusting your search query or reset your difficulty and status filters.</p>
            <button class="btn btn-secondary" id="btn-reset-filters">Reset All Filters</button>
          </div>
        ` : filtered.map(lesson => {
          const isDone = !!progress.completedLessons[lesson.id];
          return `
            <article class="card lesson-card ${isDone ? 'lesson-card-completed' : ''}" data-lesson-id="${lesson.id}">
              <div class="lesson-card-header">
                <span class="lesson-order-badge">Lesson ${lesson.order}</span>
                <span class="meta-tag difficulty-${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
              </div>
              <h3 class="lesson-card-title">${lesson.title}</h3>
              <p class="lesson-card-desc">${lesson.objective}</p>
              
              <div class="lesson-card-footer">
                <div class="lesson-meta-chips">
                  <span class="meta-chip"><i class="icon-clock"></i> ${lesson.estimatedTime}</span>
                  <span class="meta-chip text-purple">+${lesson.xpReward} XP</span>
                </div>
                ${isDone 
                  ? `<span class="badge-status-completed"><span class="check-icon">✓</span> Completed</span>` 
                  : `<button class="btn btn-sm btn-primary open-lesson-btn" data-lesson-id="${lesson.id}">Start Lesson</button>`}
              </div>
            </article>
          `;
        }).join('')}
      </section>

      <!-- Hidden Lesson Reader Modal Container -->
      <div id="lesson-reader-modal" class="modal-backdrop" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="modal-dialog modal-xl modal-reader" id="lesson-reader-content">
          <!-- Dynamically populated by openLesson() -->
        </div>
      </div>
    `;

    attachListEvents();
  }

  // Attach event listeners for list views
  function attachListEvents() {
    // Track Toggle
    document.querySelectorAll(".track-toggle-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const track = e.currentTarget.dataset.track;
        if (track && track !== currentTrack) {
          currentTrack = track;
          searchQuery = "";
          render();
        }
      });
    });

    // Search input
    const searchInput = document.getElementById("lesson-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        render();
        const refreshedInput = document.getElementById("lesson-search-input");
        if (refreshedInput) {
          refreshedInput.focus();
          refreshedInput.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      });
    }

    // Clear search
    const clearBtn = document.getElementById("clear-lesson-search");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchQuery = "";
        render();
      });
    }

    // Difficulty filter
    const diffSelect = document.getElementById("filter-difficulty");
    if (diffSelect) {
      diffSelect.addEventListener("change", (e) => {
        filterDifficulty = e.target.value;
        render();
      });
    }

    // Status filter
    const statusSelect = document.getElementById("filter-status");
    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        filterStatus = e.target.value;
        render();
      });
    }

    // Reset filters
    const resetBtn = document.getElementById("btn-reset-filters");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        searchQuery = "";
        filterDifficulty = "all";
        filterStatus = "all";
        render();
      });
    }

    // Lesson Card click -> Open Lesson
    document.querySelectorAll(".lesson-card, .open-lesson-btn").forEach(el => {
      el.addEventListener("click", (e) => {
        const lessonId = e.currentTarget.dataset.lessonId;
        if (lessonId) {
          openLesson(lessonId);
        }
      });
    });
  }

  // Open Lesson in Reader Modal
  function openLesson(lessonId) {
    const allLessons = [...CQ_DATA.pythonLessons, ...CQ_DATA.cLessons];
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    activeLessonId = lessonId;
    currentTrack = lesson.track;

    const modal = document.getElementById("lesson-reader-modal");
    const content = document.getElementById("lesson-reader-content");
    if (!modal || !content) return;

    const progress = CQ_STORAGE.getProgress();
    const isCompleted = !!progress.completedLessons[lesson.id];

    // Determine Prev and Next lessons in same track
    const trackList = lesson.track === "c" ? CQ_DATA.cLessons : CQ_DATA.pythonLessons;
    const currentIndex = trackList.findIndex(l => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? trackList[currentIndex - 1] : null;
    const nextLesson = currentIndex < trackList.length - 1 ? trackList[currentIndex + 1] : null;

    content.innerHTML = `
      <!-- Reader Header -->
      <div class="reader-header">
        <div class="reader-header-meta">
          <span class="track-pill ${lesson.track}">${lesson.track === 'python' ? 'Python Track' : 'C Systems Track'}</span>
          <span class="meta-tag difficulty-${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
          <span class="meta-tag"><i class="icon-clock"></i> ${lesson.estimatedTime}</span>
          <span class="meta-tag text-purple">+${lesson.xpReward} XP</span>
        </div>
        <button class="modal-close-btn" id="btn-close-reader" aria-label="Close reader">&times;</button>
      </div>

      <!-- Reader Scrollable Body -->
      <div class="reader-body">
        <div class="reader-title-area">
          <h2 class="reader-title">${lesson.title}</h2>
          <div class="reader-objective-box">
            <strong>Learning Objective:</strong>
            <p>${lesson.objective}</p>
          </div>
        </div>

        <!-- Section 1: Concept Explanation -->
        <section class="reader-section">
          <h3 class="reader-section-title"><span class="section-num">01</span> Concept & Theory</h3>
          <div class="reader-prose">
            ${formatExplanationText(lesson.explanation)}
          </div>
        </section>

        <!-- Section 2: Syntax Box -->
        ${lesson.syntaxExample ? `
          <section class="reader-section">
            <h3 class="reader-section-title"><span class="section-num">02</span> General Syntax Pattern</h3>
            <div class="code-block-wrapper">
              <div class="code-block-header">
                <span class="code-lang-label">Syntax Blueprint</span>
                <button class="copy-code-btn" data-code="${escapeAttribute(lesson.syntaxExample)}">Copy</button>
              </div>
              <pre class="code-snippet"><code>${escapeHTML(lesson.syntaxExample)}</code></pre>
            </div>
          </section>
        ` : ''}

        <!-- Section 3: Verified Code Example -->
        <section class="reader-section">
          <h3 class="reader-section-title"><span class="section-num">03</span> Working Code Example</h3>
          <div class="code-block-wrapper">
            <div class="code-block-header">
              <span class="code-lang-label">${lesson.track === 'python' ? 'Python 3' : 'C (C99 Standard)'}</span>
              <button class="copy-code-btn" data-code="${escapeAttribute(lesson.codeExample)}">Copy Code</button>
            </div>
            <pre class="code-snippet"><code>${escapeHTML(lesson.codeExample)}</code></pre>
          </div>
        </section>

        <!-- Section 4: Code Breakdown -->
        <section class="reader-section">
          <h3 class="reader-section-title"><span class="section-num">04</span> Code Breakdown</h3>
          <div class="reader-prose breakdown-box">
            ${formatExplanationText(lesson.codeExplanation)}
          </div>
        </section>

        <!-- Section 5: Interactive Knowledge Check -->
        <section class="reader-section knowledge-check-section">
          <h3 class="reader-section-title"><span class="section-num">05</span> Quick Knowledge Checks</h3>
          <p class="section-subtext">Answer these checkpoint questions to test your comprehension before completing the lesson.</p>

          <div class="checks-list">
            ${lesson.knowledgeCheck.map((check, qIdx) => `
              <div class="checkpoint-card" id="checkpoint-card-${qIdx}">
                <h4 class="checkpoint-question">${qIdx + 1}. ${check.question}</h4>
                <div class="checkpoint-options" data-question-index="${qIdx}">
                  ${check.options.map((opt, optIdx) => `
                    <button class="checkpoint-opt-btn" data-q-idx="${qIdx}" data-opt-idx="${optIdx}">
                      <span class="opt-letter">${String.fromCharCode(65 + optIdx)}</span>
                      <span class="opt-text">${escapeHTML(opt)}</span>
                    </button>
                  `).join('')}
                </div>
                <div class="checkpoint-feedback hidden" id="checkpoint-feedback-${qIdx}"></div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>

      <!-- Reader Footer Navigation -->
      <div class="reader-footer">
        <div class="reader-footer-nav">
          ${prevLesson ? `
            <button class="btn btn-secondary btn-nav-lesson" data-lesson-id="${prevLesson.id}">
              ← Previous: ${prevLesson.title.split('.')[1] || prevLesson.title}
            </button>
          ` : `<span></span>`}
        </div>

        <div class="reader-footer-action">
          ${isCompleted ? `
            <div class="completed-indicator-pill">
              <span class="check-icon">✓</span> Lesson Completed (+20 XP Earned)
            </div>
          ` : `
            <button class="btn btn-success btn-lg" id="btn-complete-lesson" data-lesson-id="${lesson.id}">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Mark as Complete (+20 XP)
            </button>
          `}
        </div>

        <div class="reader-footer-nav text-right">
          ${nextLesson ? `
            <button class="btn btn-secondary btn-nav-lesson" data-lesson-id="${nextLesson.id}">
              Next: ${nextLesson.title.split('.')[1] || nextLesson.title} →
            </button>
          ` : `<span></span>`}
        </div>
      </div>
    `;

    // Show modal
    modal.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-locked");

    attachReaderEvents(lesson);
  }

  // Attach interactive events inside reader
  function attachReaderEvents(lesson) {
    // Close button
    const closeBtn = document.getElementById("btn-close-reader");
    const modal = document.getElementById("lesson-reader-modal");
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", closeReader);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeReader();
      });
    }

    // Escape key
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeReader();
        document.removeEventListener("keydown", onKeyDown);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Prev / Next Lesson buttons
    document.querySelectorAll(".btn-nav-lesson").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const nextId = e.currentTarget.dataset.lessonId;
        if (nextId) openLesson(nextId);
      });
    });

    // Copy Code buttons
    document.querySelectorAll(".copy-code-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const code = e.currentTarget.dataset.code;
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            const originalText = e.currentTarget.textContent;
            e.currentTarget.textContent = "Copied!";
            setTimeout(() => {
              e.currentTarget.textContent = originalText;
            }, 2000);
          }).catch(err => {
            console.error("Clipboard write error:", err);
          });
        }
      });
    });

    // Knowledge Check Interactive Options
    lesson.knowledgeCheck.forEach((check, qIdx) => {
      const container = document.querySelector(`.checkpoint-options[data-question-index="${qIdx}"]`);
      const feedbackEl = document.getElementById(`checkpoint-feedback-${qIdx}`);
      if (!container || !feedbackEl) return;

      container.querySelectorAll(".checkpoint-opt-btn").forEach(optBtn => {
        optBtn.addEventListener("click", () => {
          const selectedIdx = parseInt(optBtn.dataset.optIdx, 10);
          const isCorrect = selectedIdx === check.answerIndex;

          // Disable options once clicked
          container.querySelectorAll(".checkpoint-opt-btn").forEach((b, idx) => {
            b.disabled = true;
            if (idx === check.answerIndex) {
              b.classList.add("opt-correct");
            } else if (idx === selectedIdx && !isCorrect) {
              b.classList.add("opt-incorrect");
            }
          });

          // Show feedback
          feedbackEl.classList.remove("hidden");
          if (isCorrect) {
            feedbackEl.className = "checkpoint-feedback feedback-correct";
            feedbackEl.innerHTML = `<strong>Correct!</strong> ${check.explanation}`;
          } else {
            feedbackEl.className = "checkpoint-feedback feedback-incorrect";
            feedbackEl.innerHTML = `<strong>Incorrect.</strong> ${check.explanation}`;
          }
        });
      });
    });

    // Complete Lesson Button
    const completeBtn = document.getElementById("btn-complete-lesson");
    if (completeBtn) {
      completeBtn.addEventListener("click", () => {
        const res = CQ_STORAGE.completeLesson(lesson.id, lesson.title, lesson.track);
        if (res.success) {
          if (res.isFirstTime) {
            if (window.CQ_APP) {
              window.CQ_APP.showToast("Lesson Completed!", `Earned +${res.xpAwarded} XP!`, "success");
              if (res.leveledUp) {
                window.CQ_APP.showLevelUpModal(res.newLevel);
              }
              if (res.unlockedBadges && res.unlockedBadges.length > 0) {
                res.unlockedBadges.forEach(b => window.CQ_APP.showBadgeUnlock(b));
              }
            }
          }
          // Refresh reader view
          openLesson(lesson.id);
        }
      });
    }
  }

  // Close Reader Modal
  function closeReader() {
    const modal = document.getElementById("lesson-reader-modal");
    if (modal) {
      modal.classList.remove("modal-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-locked");
    }
    // Re-render lessons list to reflect updated completion status
    render();
  }

  // Helper: Format line breaks and bullet points into readable paragraphs
  function formatExplanationText(text) {
    if (!text) return "";
    const lines = text.split("\n");
    let html = "";
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        return;
      }

      if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
        if (!inList) {
          html += '<ul class="prose-list">';
          inList = true;
        }
        const bulletText = trimmed.replace(/^[•-]\s*/, "");
        html += `<li>${formatInlineCode(escapeHTML(bulletText))}</li>`;
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<p class="prose-p">${formatInlineCode(escapeHTML(trimmed))}</p>`;
      }
    });

    if (inList) {
      html += "</ul>";
    }

    return html;
  }

  // Helper: Format backticks `...` into inline code spans
  function formatInlineCode(str) {
    return str.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  }

  // Escape HTML string
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Escape for attribute value
  function escapeAttribute(str) {
    if (!str) return "";
    return String(str)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  return {
    init: init,
    render: render,
    openLesson: openLesson
  };
})();

// Export to window
if (typeof window !== "undefined") {
  window.CQ_LESSONS = CQ_LESSONS;
}

/**
 * CodeQuest - Quizzes Module Controller
 * Handles quiz track selection, single-question progression, answer verification,
 * immediate feedback, anti-farming XP calculations, results screen, and history log.
 */

const CQ_QUIZZES = (function() {
  // Quiz State
  let state = {
    view: "start", // 'start', 'in_progress', 'results'
    selectedTrack: "python", // 'python' or 'c'
    questionCount: 10, // 5, 10, or 15
    activeQuestions: [],
    currentIndex: 0,
    selectedOption: null,
    isAnswerChecked: false,
    score: 0,
    answersLog: [] // { question, selected, correct, isCorrect }
  };

  // Initialize from user preference
  function init() {
    const user = CQ_STORAGE.getUser();
    if (user && (user.preferredLanguage === "c" || user.preferredLanguage === "python")) {
      state.selectedTrack = user.preferredLanguage;
    }
  }

  // Shuffle helper (Fisher-Yates)
  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Start a new Quiz session
  function startQuiz(track, count) {
    state.selectedTrack = track || state.selectedTrack;
    state.questionCount = count || 10;
    const pool = state.selectedTrack === "c" ? CQ_DATA.cQuizzes : CQ_DATA.pythonQuizzes;

    // Pick randomized sample of questions from pool
    const shuffled = shuffle(pool);
    state.activeQuestions = shuffled.slice(0, Math.min(state.questionCount, shuffled.length));
    state.currentIndex = 0;
    state.selectedOption = null;
    state.isAnswerChecked = false;
    state.score = 0;
    state.answersLog = [];
    state.view = "in_progress";

    render();
  }

  // Check answer for current question
  function checkCurrentAnswer() {
    if (state.selectedOption === null || state.isAnswerChecked) return;

    const currentQ = state.activeQuestions[state.currentIndex];
    const isCorrect = state.selectedOption === currentQ.answerIndex;
    if (isCorrect) {
      state.score += 1;
    }

    state.isAnswerChecked = true;
    state.answersLog.push({
      question: currentQ.question,
      selected: state.selectedOption,
      correct: currentQ.answerIndex,
      isCorrect: isCorrect,
      explanation: currentQ.explanation
    });

    render();
  }

  // Advance to next question or finish
  function nextQuestion() {
    if (state.currentIndex < state.activeQuestions.length - 1) {
      state.currentIndex += 1;
      state.selectedOption = null;
      state.isAnswerChecked = false;
      render();
    } else {
      finishQuiz();
    }
  }

  // Finish quiz and persist results
  function finishQuiz() {
    const total = state.activeQuestions.length;
    const score = state.score;
    const track = state.selectedTrack;

    const result = CQ_STORAGE.recordQuizResult(track, score, total);

    state.lastResult = result;
    state.view = "results";
    render();

    // Trigger celebration toast
    if (window.CQ_APP) {
      if (result.percentage >= 80) {
        window.CQ_APP.showToast("Outstanding Score!", `You scored ${result.percentage}% and earned +${result.xpEarned} XP!`, "gold");
      } else {
        window.CQ_APP.showToast("Quiz Completed!", `Scored ${result.percentage}% (+${result.xpEarned} XP)`, "info");
      }

      if (result.leveledUp) {
        window.CQ_APP.showLevelUpModal(result.newLevel);
      }
      if (result.unlockedBadges && result.unlockedBadges.length > 0) {
        result.unlockedBadges.forEach(b => window.CQ_APP.showBadgeUnlock(b));
      }
    }
  }

  // Main Render Function
  function render() {
    const container = document.getElementById("quizzes-view");
    if (!container) return;

    if (state.view === "start") {
      renderStartScreen(container);
    } else if (state.view === "in_progress") {
      renderQuizRunner(container);
    } else if (state.view === "results") {
      renderResultsScreen(container);
    }
  }

  // 1. Start Screen
  function renderStartScreen(container) {
    const progress = CQ_STORAGE.getProgress();
    const history = progress.quizHistory || [];
    const today = CQ_STORAGE.getTodayString();
    const todayQuizXP = (progress.dailyQuizXP && progress.dailyQuizXP[today]) || 0;

    container.innerHTML = `
      <section class="quiz-container animate-fade-in" aria-label="Quiz Setup">
        <!-- Start Card -->
        <div class="card quiz-start-card">
          <div class="quiz-hero-badge">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
          </div>
          <h1 class="quiz-main-title">Interactive Knowledge Arena</h1>
          <p class="quiz-desc">
            Test your programming comprehension with verified technical questions covering syntax, logic, operators, control flow, functions, and memory.
          </p>

          <!-- Daily Cap Status Pill -->
          <div class="daily-cap-status ${todayQuizXP >= 50 ? 'cap-reached' : ''}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Daily Quiz XP: <strong>${todayQuizXP} / 50 XP</strong> earned today</span>
            ${todayQuizXP >= 50 ? '<span class="text-gold">(Daily XP Cap Reached — practice mode)</span>' : ''}
          </div>

          <!-- Setup Form -->
          <div class="quiz-setup-grid">
            <!-- Language Selector -->
            <div class="setup-group">
              <label class="setup-label">Select Programming Track</label>
              <div class="track-choice-row">
                <button type="button" class="btn-track-choice ${state.selectedTrack === 'python' ? 'active' : ''}" data-track="python">
                  <span class="track-choice-title">Python 3</span>
                  <span class="track-choice-sub">15 Questions Available</span>
                </button>
                <button type="button" class="btn-track-choice ${state.selectedTrack === 'c' ? 'active' : ''}" data-track="c">
                  <span class="track-choice-title">C Language</span>
                  <span class="track-choice-sub">15 Questions Available</span>
                </button>
              </div>
            </div>

            <!-- Question Count -->
            <div class="setup-group">
              <label class="setup-label">Number of Questions</label>
              <div class="count-choice-row">
                <button type="button" class="btn-count-choice ${state.questionCount === 5 ? 'active' : ''}" data-count="5">5 Quick</button>
                <button type="button" class="btn-count-choice ${state.questionCount === 10 ? 'active' : ''}" data-count="10">10 Standard</button>
                <button type="button" class="btn-count-choice ${state.questionCount === 15 ? 'active' : ''}" data-count="15">15 Full Set</button>
              </div>
            </div>
          </div>

          <!-- Rules Card -->
          <div class="quiz-rules-box">
            <h4><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Rules & Rewards</h4>
            <ul>
              <li>Earn <strong>+5 XP</strong> per correct answer up to a daily limit of 50 XP to prevent farming.</li>
              <li>Score 60% or higher to fulfill your <strong>Daily Quest</strong>.</li>
              <li>Score 100% to unlock the prestigious <strong>Perfect Score</strong> badge.</li>
              <li>Immediate explanations are provided after submitting each response.</li>
            </ul>
          </div>

          <!-- Start Action -->
          <div class="quiz-start-actions">
            <button class="btn btn-primary btn-xl" id="btn-begin-quiz">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start ${state.selectedTrack === 'python' ? 'Python' : 'C'} Quiz (${state.questionCount} Questions)
            </button>
          </div>
        </div>

        <!-- Quiz History Log -->
        <div class="card quiz-history-card">
          <div class="card-header-flex">
            <div>
              <span class="card-eyebrow">ARCHIVE</span>
              <h2 class="card-heading">Previous Quiz Attempts</h2>
            </div>
            <span class="text-muted text-sm">${history.length} attempts recorded</span>
          </div>

          ${history.length === 0 ? `
            <div class="empty-state-feed">
              <p>No completed quizzes on record yet. Complete your first quiz above to start your test history!</p>
            </div>
          ` : `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Track</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>XP Earned</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.slice(0, 10).map(q => `
                    <tr>
                      <td>${q.date}</td>
                      <td><span class="track-pill ${q.language}">${q.language.toUpperCase()}</span></td>
                      <td><strong>${q.score} / ${q.total}</strong></td>
                      <td>
                        <span class="score-percent ${q.percentage >= 80 ? 'text-green' : q.percentage >= 50 ? 'text-gold' : 'text-red'}">
                          ${q.percentage}%
                        </span>
                      </td>
                      <td class="text-purple">+${q.xpEarned} XP</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </section>
    `;

    attachStartEvents();
  }

  // 2. Quiz Runner (Single question active)
  function renderQuizRunner(container) {
    const currentQ = state.activeQuestions[state.currentIndex];
    const totalQ = state.activeQuestions.length;
    const percent = Math.round(((state.currentIndex + 1) / totalQ) * 100);
    const hasSelection = state.selectedOption !== null;
    const isChecked = state.isAnswerChecked;

    container.innerHTML = `
      <section class="quiz-runner-container animate-fade-in" aria-label="Active Quiz">
        <!-- Runner Header & Progress -->
        <div class="runner-header-bar">
          <div class="runner-meta-flex">
            <span class="track-pill ${state.selectedTrack}">${state.selectedTrack.toUpperCase()} TRACK</span>
            <span class="runner-counter">Question <strong>${state.currentIndex + 1}</strong> of ${totalQ}</span>
            <span class="runner-score-live">Current Score: ${state.score}</span>
          </div>
          <div class="progress-bar-container runner-progress">
            <div class="progress-bar-fill xp-fill" style="width: ${percent}%;"></div>
          </div>
        </div>

        <!-- Question Card -->
        <div class="card question-card">
          <h2 class="question-prompt">${currentQ.question}</h2>

          <!-- Options Grid -->
          <div class="options-container" role="radiogroup" aria-label="Answer options">
            ${currentQ.options.map((opt, idx) => {
              let optClass = "quiz-opt-btn";
              if (state.selectedOption === idx) optClass += " selected";
              if (isChecked) {
                if (idx === currentQ.answerIndex) {
                  optClass += " opt-correct";
                } else if (idx === state.selectedOption && idx !== currentQ.answerIndex) {
                  optClass += " opt-incorrect";
                }
              }

              return `
                <button type="button" 
                  class="${optClass}" 
                  data-idx="${idx}" 
                  ${isChecked ? 'disabled' : ''} 
                  role="radio" 
                  aria-checked="${state.selectedOption === idx}">
                  <span class="opt-key">${String.fromCharCode(65 + idx)}</span>
                  <span class="opt-label">${escapeHTML(opt)}</span>
                  ${isChecked && idx === currentQ.answerIndex ? '<span class="status-icon">✓</span>' : ''}
                  ${isChecked && idx === state.selectedOption && idx !== currentQ.answerIndex ? '<span class="status-icon">✗</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Explanation Feedback Box (revealed only after check) -->
          ${isChecked ? `
            <div class="explanation-box animate-fade-in ${state.selectedOption === currentQ.answerIndex ? 'explanation-correct' : 'explanation-incorrect'}">
              <div class="explanation-header">
                <span class="explanation-icon">
                  ${state.selectedOption === currentQ.answerIndex ? '✓ Correct Answer!' : '✗ Not Quite Right'}
                </span>
              </div>
              <p class="explanation-text">${currentQ.explanation}</p>
            </div>
          ` : ''}

          <!-- Runner Action Footer -->
          <div class="runner-footer">
            <button class="btn btn-secondary" id="btn-quit-quiz">Quit Quiz</button>
            <div class="runner-action-right">
              ${!isChecked ? `
                <button class="btn btn-primary btn-lg" id="btn-check-answer" ${hasSelection ? '' : 'disabled'}>
                  Check Answer
                </button>
              ` : `
                <button class="btn btn-primary btn-lg" id="btn-next-question">
                  ${state.currentIndex === totalQ - 1 ? 'Finish & See Results' : 'Next Question →'}
                </button>
              `}
            </div>
          </div>
        </div>
      </section>
    `;

    attachRunnerEvents();
  }

  // 3. Results Screen
  function renderResultsScreen(container) {
    const res = state.lastResult;
    if (!res) {
      state.view = "start";
      render();
      return;
    }

    const isGood = res.percentage >= 60;
    const isPerfect = res.percentage === 100;

    container.innerHTML = `
      <section class="results-container animate-fade-in" aria-label="Quiz Results">
        <div class="card results-card">
          <!-- Celebration Badge -->
          <div class="results-badge-wrap ${isPerfect ? 'badge-gold' : isGood ? 'badge-green' : 'badge-blue'}">
            ${isPerfect ? `
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ` : isGood ? `
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            ` : `
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            `}
          </div>

          <span class="results-track-tag">${state.selectedTrack.toUpperCase()} ASSESSMENT</span>
          <h1 class="results-title">
            ${isPerfect ? 'Flawless Victory!' : isGood ? 'Great Achievement!' : 'Good Effort!'}
          </h1>
          <p class="results-subtext">
            ${isPerfect ? 'You answered every question correctly and demonstrated complete mastery!' : isGood ? 'You passed with flying colors and consolidated key core concepts.' : 'Review the questions and explanations below to improve your grasp.'}
          </p>

          <!-- Score Metrics Row -->
          <div class="results-metrics-grid">
            <div class="metric-box">
              <span class="metric-val text-green">${res.score} / ${res.total}</span>
              <span class="metric-lbl">Correct Answers</span>
            </div>
            <div class="metric-box">
              <span class="metric-val text-blue">${res.percentage}%</span>
              <span class="metric-lbl">Accuracy Score</span>
            </div>
            <div class="metric-box">
              <span class="metric-val text-purple">+${res.xpEarned} XP</span>
              <span class="metric-lbl">XP Earned</span>
            </div>
          </div>

          <!-- Daily Cap Notice if applicable -->
          ${res.capped ? `
            <div class="notice-box notice-warning">
              <strong>Anti-Farming Note:</strong> You earned ${res.xpEarned} XP. Daily quiz cap reached (50 XP max per day). Practice as much as you like; new XP resets tomorrow!
            </div>
          ` : ''}

          <!-- Review Answers Accordion -->
          <div class="answers-review-container">
            <h3 class="review-heading">Question-by-Question Review</h3>
            <div class="review-items-list">
              ${state.answersLog.map((log, i) => `
                <div class="review-item ${log.isCorrect ? 'review-correct' : 'review-incorrect'}">
                  <div class="review-item-header">
                    <span class="review-item-status">${log.isCorrect ? '✓' : '✗'}</span>
                    <strong class="review-item-q">${i + 1}. ${escapeHTML(log.question)}</strong>
                  </div>
                  <p class="review-item-explanation">${escapeHTML(log.explanation)}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Results Actions -->
          <div class="results-actions-row">
            <button class="btn btn-secondary" id="btn-retry-quiz">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
              Retry Quiz
            </button>
            <button class="btn btn-primary" id="btn-results-dash">
              Return to Dashboard
            </button>
          </div>
        </div>
      </section>
    `;

    attachResultsEvents();
  }

  // Start Screen Event Handlers
  function attachStartEvents() {
    // Track choice
    document.querySelectorAll(".btn-track-choice").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const track = e.currentTarget.dataset.track;
        if (track) {
          state.selectedTrack = track;
          render();
        }
      });
    });

    // Count choice
    document.querySelectorAll(".btn-count-choice").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const count = parseInt(e.currentTarget.dataset.count, 10);
        if (count) {
          state.questionCount = count;
          render();
        }
      });
    });

    // Begin quiz
    const beginBtn = document.getElementById("btn-begin-quiz");
    if (beginBtn) {
      beginBtn.addEventListener("click", () => {
        startQuiz(state.selectedTrack, state.questionCount);
      });
    }
  }

  // Quiz Runner Event Handlers
  function attachRunnerEvents() {
    // Option selection
    document.querySelectorAll(".quiz-opt-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        if (state.isAnswerChecked) return;
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        state.selectedOption = idx;
        render();
      });
    });

    // Check Answer
    const checkBtn = document.getElementById("btn-check-answer");
    if (checkBtn) {
      checkBtn.addEventListener("click", checkCurrentAnswer);
    }

    // Next Question
    const nextBtn = document.getElementById("btn-next-question");
    if (nextBtn) {
      nextBtn.addEventListener("click", nextQuestion);
    }

    // Quit Quiz
    const quitBtn = document.getElementById("btn-quit-quiz");
    if (quitBtn) {
      quitBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to exit the quiz? Current progress will not be saved.")) {
          state.view = "start";
          render();
        }
      });
    }
  }

  // Results Screen Event Handlers
  function attachResultsEvents() {
    const retryBtn = document.getElementById("btn-retry-quiz");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        startQuiz(state.selectedTrack, state.questionCount);
      });
    }

    const dashBtn = document.getElementById("btn-results-dash");
    if (dashBtn) {
      dashBtn.addEventListener("click", () => {
        window.location.hash = "#dashboard";
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

  return {
    init: init,
    render: render,
    startQuiz: startQuiz
  };
})();

// Export to window
if (typeof window !== "undefined") {
  window.CQ_QUIZZES = CQ_QUIZZES;
}

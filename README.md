# CodeQuest — Gamified Programming Learning Platform

> **"Learn. Code. Conquer."**  
> An interactive, gamified frontend web application designed for beginner computer science students to master Python and C fundamentals.

---

## 1. Project Abstract

**CodeQuest** is a client-side gamified learning platform developed as an individual college mini-project. It bridges the gap between passive reading and active engagement for novice programmers learning Python and C. By pairing structured, syllabus-aligned micro-lessons with interactive knowledge checkpoints, randomized quizzes, algorithm study challenges, daily learning streaks, XP-based level progression, and achievement badges, CodeQuest transforms early computing education into an adventure. The application operates entirely statically in the browser using HTML5, CSS3, and modern Vanilla JavaScript, relying on a robust LocalStorage architecture for data persistence without requiring server-side databases or third-party APIs.

---

## 2. Problem Statement & Objectives

### Problem Statement
Introductory programming students frequently struggle with abstract syntax and conceptual hurdles in both high-level dynamically-typed languages (Python) and low-level statically-typed systems languages (C). Traditional textbook learning often lacks immediate feedback loops, leading to loss of motivation, inconsistent practice habits, and high attrition rates in first-year computer science courses.

### Project Objectives
1. **Interactive Curriculum Delivery:** Provide bite-sized, curriculum-aligned lessons with clear objectives, annotated code snippets, syntax blueprints, and immediate knowledge-check feedback.
2. **Dual-Track Comparative Learning:** Offer parallel introductory curricula in both **Python 3** and **C (C99)** to help students appreciate both interpreted and compiled programming paradigms.
3. **Gamification & Habit Building:** Incentivize consistent daily coding through verifiable date-based streaks, level progression tiers, daily quests, and milestone badges.
4. **Honest, Sandboxed Educational Architecture:** Emphasize clean algorithm breakdown, I/O analysis, and test case evaluation without exposing users to security vulnerabilities associated with un-sandboxed arbitrary code execution.
5. **Zero-Setup Static Portability:** Deliver a fully functional, responsive, professional web application that runs directly in any modern browser without npm dependencies, build tools, or backend servers.

---

## 3. Technology Stack

- **HTML5:** Semantic markup, accessible modal dialogues, ARIA landmark roles, and responsive layouts.
- **CSS3:** Custom properties (CSS variables), modern Flexbox and CSS Grid architectures, GPU-accelerated transitions, and `@media (prefers-reduced-motion)` accessibility support.
- **Vanilla JavaScript (ES6+):** Modular IIFE/revealing-module design, hash-based single-page navigation router, custom pub/sub state events, and LocalStorage management.
- **Vector Graphics:** Handcrafted inline SVG icons and brand assets for sharp rendering and fast, dependency-free loading.
- **Browser Storage:** Namespaced JSON persistence via HTML5 `localStorage`.

---

## 4. Key Features

- **Onboarding Experience:** First-launch interactive setup modal capturing cadet name, preferred language track (Python or C), and daily study goal (10, 20, or 30 minutes).
- **Comprehensive Command Dashboard:**
  - Real-time statistics: Total XP, current level, curriculum completion %, active daily streak, and longest recorded streak.
  - Dynamic motivational quotes from computer science luminaries (Linus Torvalds, Dijkstra, Harold Abelson, etc.).
  - "Continue Your Quest" card highlighting the next uncompleted lesson in the user's preferred curriculum.
  - Three daily quests (Daily Study Sprint, Knowledge Duel, Problem Solver) with bonus XP rewards claimable once per day.
  - CSS-rendered 7-day weekly activity bar chart displaying XP earned per day with date tooltips.
  - Chronological recent activity journal recording timestamps and XP gains.
- **Dual Learning Modules (16 Complete Lessons):**
  - **Python Track (8 Lessons):** Introduction, Variables & Types, Operators, Conditionals, Loops, Functions & Scope, Lists & Dictionaries, Problem Solving.
  - **C Systems Track (8 Lessons):** Introduction to C & `main()`, Variables & Format Specifiers, Operators & Casting, Conditionals & `switch`, Loops (`for`, `while`, `do-while`), Functions & Prototypes, Arrays & Null-Terminated Strings, Pointers & Memory Addresses.
  - Live search by title, difficulty filters (Beginner, Intermediate), and completion status filters.
  - Interactive lesson reader with copyable code snippets, code breakdowns, and two multiple-choice knowledge checkpoints with instant feedback.
  - First-time completion bonus (+20 XP) with anti-farming protection on revisit.
- **Interactive Quiz Arena (30 Verified Questions):**
  - Track selection (Python or C) and flexible question sets (5 Quick, 10 Standard, 15 Full Set).
  - Single-question runner with real-time score indicator, progress bar, and instant explanation feedback.
  - Anti-farming XP cap (maximum 50 quiz XP per calendar day) to preserve progression balance.
  - Historical quiz attempt log recording date, score, percentage, and XP earned.
- **Coding Challenges Arena (10 Algorithmic Problems):**
  - Problems covering Print Messages, Sum of Two Numbers, Even/Odd, Maximum of Two, Factorials, String Reversal, Sum of Digits, Prime Verification, Multiplication Tables, and Maximum in Array.
  - Dual verified reference solutions in Python and C with expandable hint accordions and algorithm breakdown analyses.
  - One-time completion award (+30 XP) per problem.
- **Achievements & Badges System (10 Badges):**
  - First Steps, Quiz Starter, Perfect Score, Problem Solver, Knowledge Seeker, Dedicated Learner, Week Explorer, XP Collector, Python Pioneer, and C Vanguard.
  - Dynamically evaluated against live progress with unlocked date stamps and progress percentage indicators for locked badges.
- **Campus Cohort Leaderboard:**
  - Ranked table integrating the current user's profile with peer benchmark profiles from the CS cohort.
  - Live ranking calculation based on actual local XP.
- **Profile & Settings:**
  - Update display name, preferred track, and daily target.
  - Academic dossier with complete lifetime stats.
  - Safe "Reset Demo Data" option with modal confirmation that purges only application-specific LocalStorage keys.

---

## 5. Project Directory Structure

```text
CodeQuest/
├── index.html            # Main semantic HTML5 application shell & view templates
├── README.md             # Project documentation, college viva guide, and test checklists
├── assets/
│   └── favicon.svg       # Brand icon vector asset
├── css/
│   ├── style.css         # Design system tokens, typography, dark theme, and module styles
│   └── responsive.css    # Breakpoint media queries (Desktop, Tablet, Mobile Drawer & Bottom Nav)
└── js/
    ├── data.js           # Static educational curriculum, quizzes, challenges, and peer profiles
    ├── storage.js        # Centralized LocalStorage manager, XP rules, streaks, and achievements
    ├── dashboard.js      # Dashboard controller, weekly chart renderer, and daily quest evaluator
    ├── lessons.js        # Learning track switcher, lesson filter/search, and reader controller
    ├── quizzes.js        # Interactive quiz runner, instant feedback, anti-farming, and history
    ├── challenges.js     # Algorithmic problem viewer, dual-language solutions, and hint toggles
    ├── achievements.js   # Badge grid renderer, criteria evaluator, and unlock status
    └── app.js            # SPA hash router, modal coordinator, topbar stats, and toast engine
```

---

## 6. How to Run Locally

Because CodeQuest is built using pure client-side web standards, **no build step, Node.js environment, package manager, or backend server is required.**

### Option A: Direct Browser Launch
1. Clone or download the repository to your local computer.
2. Locate `index.html` in the project root directory.
3. Double-click `index.html` (or right-click and choose **Open With > Google Chrome / Microsoft Edge / Mozilla Firefox**).

### Option B: Local Development Server (Recommended for college presentations)
Using Python's built-in static server:
```bash
# In your terminal, navigate to the CodeQuest folder:
cd path/to/CodeQuest

# Python 3:
python -m http.server 8000

# Open your browser at:
# http://localhost:8000
```

Using Node's lightweight `serve` or VS Code Live Server:
```bash
npx serve .
```

---

## 7. LocalStorage Schema & Architecture

CodeQuest namespaces all data under unique keys to ensure it does not interfere with other sites running on `localhost`:

### 1. `codequest_user`
Stores user profile attributes:
```json
{
  "displayName": "Cadet Coder",
  "preferredLanguage": "python",
  "dailyGoalMinutes": 20,
  "onboardingCompleted": true,
  "createdAt": "2026-10-14T14:30:00.000Z"
}
```

### 2. `codequest_progress`
Stores all learning milestones, XP, streaks, and completion records:
```json
{
  "xp": 260,
  "level": 3,
  "completedLessons": {
    "py-01": "2026-10-14T14:35:12.000Z",
    "py-02": "2026-10-14T14:42:00.000Z"
  },
  "lastAccessedLesson": {
    "id": "py-02",
    "track": "python",
    "title": "2. Variables and Data Types",
    "timestamp": "2026-10-14T14:42:00.000Z"
  },
  "completedChallenges": {
    "ch-01": "2026-10-14T14:50:00.000Z"
  },
  "unlockedAchievements": {
    "first_steps": "2026-10-14T14:35:12.000Z",
    "xp_collector": "2026-10-14T14:50:00.000Z"
  },
  "quizHistory": [
    {
      "id": "quiz_1776157800000",
      "date": "2026-10-14",
      "language": "python",
      "score": 10,
      "total": 10,
      "percentage": 100,
      "xpEarned": 50,
      "timestamp": "2026-10-14T14:48:00.000Z"
    }
  ],
  "dailyQuizXP": {
    "2026-10-14": 50
  },
  "dailyQuests": {
    "date": "2026-10-14",
    "quests": {
      "quest_lesson": true,
      "quest_quiz": true,
      "quest_challenge": true
    },
    "claimedBonus": true
  },
  "activityLog": [
    {
      "id": "act_101",
      "type": "lesson",
      "title": "Completed lesson: 1. Introduction to Python",
      "xp": 20,
      "timestamp": "2026-10-14T14:35:12.000Z"
    }
  ],
  "activityDates": ["2026-10-14"],
  "currentStreak": 1,
  "longestStreak": 1,
  "lastActiveDate": "2026-10-14"
}
```

### Reset Behavior
When the user clicks **Reset Demo Data** in Settings:
- The system prompts for explicit confirmation.
- Only keys prefixed with `codequest_` are removed via `localStorage.removeItem()`.
- Global state automatically notifies all UI modules, restoring the first-time onboarding screen cleanly without deleting unrelated cookies or browser storage.

---

## 8. Anti-Farming & XP Economy

To simulate a balanced educational economy and prevent students from inflating statistics:
- **Lessons:** Award `+20 XP` only on the first completion. Re-reading or re-submitting an already completed lesson grants `0 XP`.
- **Challenges:** Award `+30 XP` only the first time a challenge is solved.
- **Quizzes:** Award `+5 XP` per correct answer, with a strict daily cap of `50 XP` per calendar date. Replaying a quiz once the daily cap has been met allows unlimited practice without granting additional XP.
- **Daily Quests:** Completing all three daily tasks allows the cadet to claim a one-time `+10 XP` bonus per calendar day.

### Level Progression Thresholds
| Level | Title | Min XP | Max XP | Progression Scope |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Novice Coder | 0 | 99 | Foundations & syntax basics |
| **2** | Syntax Apprentice | 100 | 249 | Control structures & loops |
| **3** | Logic Crafter | 250 | 449 | Modular functions & memory |
| **4** | Algorithm Explorer | 450 | 699 | Arrays & data manipulation |
| **5** | Code Knight | 700 | 999 | Advanced problem solving |
| **6** | Master Hacker | 1000+ | — | Full curriculum mastery |

---

## 9. Streaks & Date Calculation Logic

The streak engine uses local calendar dates (`YYYY-MM-DD`):
1. **Qualifying Activity:** Completing any lesson, completing any quiz, or solving any coding challenge logs an active event for the current calendar date.
2. **Consecutive Days:** If the last active date was yesterday (`difference = 1 day`), `currentStreak` increments by 1.
3. **Same Day:** Multiple actions on the same date keep `currentStreak` unchanged.
4. **Missed Days:** If the last active date was older than yesterday (`difference > 1 day`), `currentStreak` resets to 1 upon completing an activity today.
5. **Cold Start Verification:** Upon launching the app, if the user has not completed an activity today and the last active date is older than yesterday, `currentStreak` displays as 0 until a new qualifying activity is completed.
6. **Longest Streak:** Tracks the historical maximum consecutive streak achieved by the user.

---

## 10. Honest Disclosures & Limitations

1. **Static Client-Side Scope:** The platform does not incorporate a Node.js/Python server, backend database, or cloud authentication. All profile data resides locally in the user's browser.
2. **Demo-Based Leaderboard:** The leaderboard displays pre-configured peer profiles representing typical students in a college cohort alongside the user's live LocalStorage stats. It does not synchronize over a multi-client network.
3. **Challenge Execution Mode:** The Coding Challenges module serves as an educational problem laboratory with test case analysis, algorithm breakdowns, and verified dual-language reference solutions. It does not execute arbitrary code in a sandboxed compiler.
4. **Browser Cache Dependency:** Clearing browser site data or browsing in Incognito/Private mode will reset local progress.

---

## 11. Future Enhancements

- **WebAssembly Compiler Sandbox:** Integrate Pyodide (Python compiled to WASM) and Clang-in-browser / WebAssembly GCC to allow safe, client-side code execution without server overhead.
- **PWA (Progressive Web App):** Add a service worker and web app manifest to enable full offline support and home-screen installation.
- **Peer Multiplayer Quizzes:** Incorporate WebRTC or WebSocket connections for live, real-time classroom coding duels.
- **Export/Import Progress:** Provide a JSON export and import feature to transfer learning records between computers.

---

## 12. College Viva & Demonstration Guide

When presenting this project during a college viva:

1. **First-Time Launch (Onboarding):**
   - Open `index.html`. Explain that the onboarding modal automatically triggers when `codequest_user` is absent from LocalStorage.
   - Enter your name, select your preferred track (e.g. Python), choose a daily goal (20 mins), and click **Start My Quest**.
2. **Dashboard Overview:**
   - Highlight the personalized greeting, dynamic quote, and initial statistics (0 XP, Level 1 Novice Coder, 0d streak).
   - Point out the 7-day weekly activity chart and empty activity state.
3. **Completing a Lesson (XP & Level Up Verification):**
   - Click **Learn** in the sidebar or **Browse All Lessons** on the dashboard.
   - Select Lesson 1 (*Introduction to Python*). Walk the examiner through the learning objective, concept explanation, syntax blueprint, formatted code snippet, and code breakdown.
   - Answer the two knowledge checkpoint questions to demonstrate interactive feedback.
   - Click **Mark as Complete (+20 XP)**. Notice the green success toast notification and topbar XP update.
   - Navigate back to the lesson and show that the button is now marked *Completed*, proving no duplicate XP is granted.
4. **Interactive Quiz Arena:**
   - Navigate to **Quizzes**. Explain the anti-farming rules and daily 50 XP cap.
   - Start a 5-question quiz. Select options, click **Check Answer**, and highlight the immediate feedback and explanation.
   - Reach the results screen to show the percentage score, XP awarded, and entry in the quiz history table.
5. **Coding Challenges:**
   - Navigate to **Challenges**. Explain the educational reference model.
   - Open Challenge 3 (*Even or Odd Checker*). Review the sample test cases.
   - Toggle the **Need a Hint?** accordion, then reveal the **Verified Reference Solution** and switch between the Python and C tabs.
   - Click **Mark as Solved (+30 XP)**.
6. **Achievements & Leaderboard:**
   - Navigate to **Achievements** to show that badges such as *First Steps* and *Problem Solver* have automatically unlocked with timestamps.
   - Navigate to **Leaderboard** to demonstrate your profile dynamically sorted into the cohort rankings based on your accumulated XP.
7. **Profile & Reset:**
   - Navigate to **Profile & Settings**. Update your display name or preferred track.
   - Click **Reset Demo Data**, confirm the prompt, and demonstrate how the app cleanly wipes demo data and restarts onboarding.

---

## 13. Manual Testing Checklist

| Test Case | Description | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **TC-01** | First launch without stored data | Onboarding modal appears; requires valid display name. | Verified |
| **TC-02** | Complete Lesson 1 | +20 XP awarded, level updates, toast appears, lesson marked complete. | Verified |
| **TC-03** | Re-open completed lesson | Shows "Completed", button disabled or non-rewarding; 0 duplicate XP. | Verified |
| **TC-04** | Track filter switching | Toggling between Python and C correctly filters 8 track-specific lessons. | Verified |
| **TC-05** | Lesson search & filters | Searching "Loops" or filtering by "Intermediate" displays matching lessons. | Verified |
| **TC-06** | Quiz answer submission | Options locked after submission; correct/incorrect highlight with explanation. | Verified |
| **TC-07** | Quiz daily XP cap | Once daily quiz XP reaches 50 XP, subsequent quizzes award 0 XP with a warning note. | Verified |
| **TC-08** | Challenge solution toggle | Hint and solution accordions expand/collapse smoothly; language tabs swap code. | Verified |
| **TC-09** | Challenge solved reward | +30 XP awarded on first solve; challenge marked solved permanently. | Verified |
| **TC-10** | Badge unlock evaluation | Badges unlock automatically when threshold criteria (lessons, quizzes, XP) are met. | Verified |
| **TC-11** | Leaderboard sorting | User row correctly placed based on current XP among cohort peers. | Verified |
| **TC-12** | Settings update | Changing display name or track updates header, dashboard, and profile immediately. | Verified |
| **TC-13** | Demo reset confirmation | Reset prompt appears; confirming purges `codequest_*` keys and restarts onboarding. | Verified |
| **TC-14** | Page reload persistence | Refreshing the browser preserves XP, streak, completed lessons, and history. | Verified |
| **TC-15** | Responsive layout | Sidebar transforms into mobile drawer; bottom navigation bar renders on small screens. | Verified |

---

## 14. Author & Academic Context

- **Project Name:** CodeQuest
- **Course Context:** College Individual Mini-Project / Frontend Web Development Viva
- **Developer:** Senior Frontend Developer, UI/UX Designer & Software Tester
- **License:** MIT License (Open-source for educational review)

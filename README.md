<div align="center">
  <img src="assets/favicon.svg" alt="Original GearEx emblem" width="94" height="94" />
  <h1>GearEx</h1>
  <p><strong>Learn. Code. Trace. Build.</strong></p>
  <p>An open-source learning studio for seven programming languages, built for curious developers.</p>
  <p>
    <a href="https://nittinchughani.github.io/gearex/"><img alt="Live website" src="https://img.shields.io/badge/Website-Live-0ABDC6?style=for-the-badge"></a>
    <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-711C91?style=for-the-badge"></a>
    <img alt="Static site" src="https://img.shields.io/badge/Deployment-GitHub_Pages-133E7C?style=for-the-badge">
  </p>
</div>

---

## ⚡ What is GearEx?

**GearEx** is a free, no-signup educational website that combines lessons, a runnable code playground, practice challenges, quizzes, guided tracing and self-paced completion certificates. It is a reimagining of the original CodeLab Academy project, with a new identity and expanded curriculum.

**[Open GearEx](https://nittinchughani.github.io/gearex/)** · **[Report a bug](../../issues/new?template=bug_report.md)** · **[Contribute](CONTRIBUTING.md)**

The repository is published as **[NittinChughani/gearex](https://github.com/NittinChughani/gearex)**, with its current live deployment on GitHub Pages.

## ✨ At a glance

| Learning experience | Included |
|---|---|
| Languages | **C, C++, Python, JavaScript, Java, C#, SQL** |
| Guided lessons | **91** (51 original C/C++ + 40 new lessons) |
| Mixed/free quiz questions | **113** (73 original + 40 new questions) |
| Per-lesson knowledge checks | **5 per lesson (455 total)**, generated from that lesson's teaching material; pass with **4/5** |
| C/C++ coding challenges | **138**, including sample-input testing |
| C/C++ guided mini-projects | **12** |
| Code playground | Remote execution through **Wandbox** |
| Real execution visualization | **Python, C, C++, Java, JavaScript** using [Python Tutor](https://pythontutor.com/for-ai-assistants.html) iframe execution; local C#/SQL guided annotations only |
| Other demonstrations | Interactive loop, array and pointer exercises |
| Completion certificates | Five-question checks for every lesson, ≥70% final assessment, **70/30 weighted score out of 100**, one-time local name confirmation |
| Privacy | Local progress storage; no required account |

### 🎨 Five custom themes

| Theme | Palette |
|---|---|
| **Cyberpunk Neon** | `#091833` · `#133E7C` · `#0ABDC6` · `#EA00D9` · `#711C91` |
| **Quantum Teal** | `#041F2A` · `#00C2A8` · `#00E5FF` · `#B7C0CC` · `#F4F7FF` |
| **Synthwave Sunset** | `#260B68` · `#C231C9` · `#FF4900` · `#FFD319` · `#FF6E40` |
| **Bio-Digital Matrix** | `#0F172A` · `#0C1A2B` · `#D2FF26` · `#2DD4BF` · `#B2D5E9` |
| **Hologram Haze** | `#1A1033` · `#B45CFF` · `#FF4FD8` · `#E0F7FA` · `#D9A5CD` |

Themes are selectable from the **top-right corner** and persist in this browser.

## 🧠 A complete learning loop

1. Choose one of seven learning roadmaps. Read the lesson's intro, syntax, sample code and practice task.
2. Open the example in the playground. Click **Visualize this code** to transfer its exact source and language to the execution explorer.
3. Complete the **five-question check** after the lesson and score **4/5 or better**. Your best verified score counts toward your certificate.
4. Finish all the verified lessons in a language, then take its final assessment and score **70% or higher**.
5. Confirm your certificate recipient name once, review your score breakdown, and print or save the certificate as a PDF.

### Real execution explorer

For **Python, C, C++, Java, and JavaScript**, GearEx embeds the actual [Python Tutor](https://pythontutor.com/) runtime visualization. It can step through executed lines, stack frames, heap allocations, references, variable values and output. This is an external integration, **not a GearEx-developed debugger**. Press **Visualize this code** next to Run code or import directly from the editor; the language is synchronized, and a mismatch warning helps catch pasted code with the wrong selection. Source is sent to Python Tutor only when you click **Visualize execution**.

**Limits:** Python Tutor is optimized for short, single-file examples (conservatively under 2,000 source characters), is online-only, and does not support all libraries, I/O or asynchronous JavaScript. Its embedded UI supplies the step controls; use **Open full-page trace** if embedding is blocked. **C# and SQL remain educational source-order annotations**, not runtime heap/stack tracers. The playground uses the separate Wandbox service for executing code.

### Verified lessons and 100-mark certificates

Each of the **91 lessons** includes **five lesson-specific multiple-choice questions**, drawn from its actual topic, key points, worked syntax, explanation and exercise. At least **4/5** must be correct for that lesson to count as completed. Retakes are supported; the **best** recorded score counts.

| Component | Raw marks | Weight |
|---|---|---|
| Lesson checks | Best score of each lesson, summed (e.g., C has 125 possible points) | **70 marks** |
| Final language assessment | Earned / possible on the final quiz; pass threshold 70% | **30 marks** |
| **Certificate total** | Sum of weighted components, rounded | **100 marks** |

Certificates show learner name, language, both raw and weighted mark breakdowns, secured marks out of 100, overall performance, date and **Certified by creator: Nittin Chughani**. The recipient confirms their name **once for this browser**, and the site no longer offers a name-edit action afterward.

**Important:** GearEx uses browser-local storage and has no identity-verification backend. Users can clear or alter their browser data; the name lock and assessment scores are **not tamper-proof** or institution-accredited. Certificates are creator-issued evidence of self-paced completion, not independently verified qualifications. Earlier versions let visitors mark lessons completed without quizzes; the new system preserves those older IDs in an archival browser entry but requires re-verification with the lesson checks before they count toward awards.

## 🚀 Get started

This project is a static website. You don't need a build tool:

1. Clone or download this repository.
2. Open `index.html` in a modern browser, or serve the folder with a basic local HTTP server.
3. Follow a roadmap, open the playground, choose your language and press **Run code**.

Running code sends source and optional standard input to the free third-party **[Wandbox](https://wandbox.org/)** service. Execution needs internet access, depends on that service's available compilers and rate limits, and is **not** run within GitHub Pages. Avoid sending credentials or personal data in source.

## 🗂️ Project structure

```text
GearEx/
├── index.html                  # Main learning interface
├── assets/
│   ├── favicon.svg            # Original GearEx symbol
│   ├── style.css              # Responsive design + 5 themes
│   ├── unslop.css             # Workbench-inspired UI refinements
│   ├── data.js                # Original C/C++ lessons + quizzes
│   ├── challenges.js          # C/C++ coding challenges
│   ├── projects.js            # C/C++ guided projects
│   ├── gearex-courses.js      # 5 new language courses
│   ├── app.js                 # Core progress, quizzes, editor and compiler
│   ├── lesson-assessments.js  # Five-question lesson completion gate
│   └── gearex-features.js     # Theme selector, Python Tutor embed, certificates
├── docs/                       # Curriculum and development notes
├── scripts/check-content.cjs   # Content integrity test
└── .github/workflows/          # GitHub Actions validation
```

## 🔐 Progress & privacy

GearEx stores bookmarks, lessons, quiz history, work-in-progress code, themes and certificate records in **localStorage** on your device. No account or cloud sync is required. Use **Export progress** to keep a backup; clearing browser data can erase local progress.

The original general progress storage keys remain compatible with earlier GearEx and CodeLab Academy versions. Existing self-ticked lessons are archived as `gearex-legacy-completed-v1` and need quiz verification under the new system. New progress exports also contain lesson-check and final-assessment records. Certificate name confirmation persists separately so resetting lesson progress does not provide a name-edit control.

## 🤝 Contribute

Bug reports, accessibility fixes, corrections to teaching explanations, multilingual course material and new visualizers are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started. Please only submit code and learning material you have permission to share.

## Attribution and design direction

Execution diagrams are provided by **[Python Tutor](https://pythontutor.com/)**, created by Philip Guo, under that service's own terms and limitations. GearEx does not copy or reimplement Python Tutor's tracing engine.

The interface refresh follows the [Unslop](https://github.com/heydamir/unslop) design-review principles by Damir Sokolovsky (CC BY 4.0): deliberate spacing, quiet chrome, reduced gradient effects and greater attention to code as the primary visual element. This is a manual application of those principles, not a bundled copy of the Unslop tool.

## 👨‍💻 Creator

**Created by Nittin Chughani** — a Computer Science & Engineering student and open-source builder creating helpful tools and accessible programming education.

**[GitHub profile](https://github.com/NittinChughani)**

---

<div align="center"><sub>Made for learning, experimenting and building useful things. · MIT License</sub></div>

<div align="center">
  <img src="assets/favicon.svg" width="86" alt="GearEx emblem">
  <h1>GearEx</h1>
  <p><strong>Don't just run the code. Follow it.</strong></p>
  <p>A free, open-source programming workbench built around practice, understanding, and visible progress.</p>
  <p>
    <a href="https://nittinchughani.github.io/gearex/"><img src="https://img.shields.io/badge/OPEN_THE_STUDIO-207C7A?style=for-the-badge" alt="Open GearEx"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/LICENSE-MIT-394950?style=for-the-badge" alt="MIT license"></a>
  </p>
  <p><a href="https://nittinchughani.github.io/gearex/">Live website</a> · <a href="docs/CURRICULUM.md">Curriculum</a> · <a href="CONTRIBUTING.md">Contribute</a></p>
</div>

---

## The idea

Reading code is one thing. Understanding what happens inside a program is another. **GearEx** brings lessons, coding exercises, guided execution timelines and skill assessments together in a single place, without requiring an account.

The website is a static, responsive project built with HTML, CSS and JavaScript. It is open source, works on GitHub Pages and stores learning progress in the visitor's browser.

## What you can learn

| Language | Learning lessons | Core topics |
|:--|--:|:--|
| C | 25 | Variables, pointers, arrays, functions, memory, data structures |
| C++ | 26 | OOP, references, STL, templates, algorithms |
| Python | 8 | Values, loops, functions, collections, objects |
| JavaScript | 8 | Variables, arrays, functions, objects, asynchronous basics |
| Java | 8 | Data types, methods, objects, inheritance |
| C# | 8 | Methods, arrays, properties, LINQ |
| SQL | 8 | Queries, filtering, grouping, joins, updates |
| **Total** | **91** | Structured learning paths |

Alongside the lessons, GearEx provides **138 C/C++ coding challenges**, **12 guided C/C++ mini-projects**, and **113 general quiz questions**. Each lesson has an additional five-question knowledge check, for **455 lesson-check questions** altogether.

## The execution lab

The GearEx visualizer is an **original, locally implemented educational trace engine**. It doesn't embed another visualizer or send the visualization source to an outside service.

Open the **Trace lab** from the navigation, paste a small program, or select **Trace my code** from the playground. GearEx automatically recognizes common language syntax. Step forward or backward through an execution timeline, use autoplay, and inspect:

- The currently highlighted source line and explanation.
- Active function **call-stack frames** and their local variables.
- **Heap allocations**, arrays, objects, and shared references.
- Basic pointer relationships to named stack variables in C/C++.
- Standard output as it appears through supported output statements.

**Scope matters:** this is a bounded teaching interpreter, **not a complete compiler or production debugger**. Its supported subset includes simple declarations, expressions, conditions, counting loops, functions, arrays, objects, common printing operations, and basic pointers. Advanced language features, many libraries, file I/O, real system memory addresses and some class semantics are not implemented. The tracer stops and explains when a construct is outside its coverage rather than inventing execution results.

For SQL, the lab explains the sequence of query clauses but **does not execute a database query**. The normal playground remains the place to run supported programs using the separate online compiler service. The trace lab itself needs no network request.

## Learning checks and certificates

A lesson is **not completed just because it has been opened**.

1. Read the introduction, syntax notes, example and practice activity.
2. Complete the lesson's **five multiple-choice questions**.
3. Score **at least 4/5** to verify the lesson; retry as needed. Your best score is retained.
4. Verify every lesson for the chosen language.
5. Pass that language's final assessment at **70% or higher**.

Certificates have an explicit score calculation:

| Component | Calculation | Certificate marks |
|:--|:--|--:|
| Verified lessons | Sum of best lesson-check scores ÷ available lesson-check points | **70** |
| Final assessment | Correct final answers ÷ total final questions | **30** |
| **Combined score** | Weighted total, rounded | **100** |

The printable certificate displays the recipient's name, language, raw and weighted lesson-check marks, final-assessment marks, overall marks, performance, issue date and **Certified by creator: Nittin Chughani**.

A recipient confirms their name once per browser; the normal interface does not allow editing it afterward. **This is not identity verification.** Because progress is stored locally, a technically knowledgeable user could alter or clear their browser data. These are creator-issued records of self-paced participation, not independently authenticated or accredited credentials.

### Returning learners

Earlier versions allowed visitors to mark lessons completed without taking a test. Those legacy completion IDs are kept in an archive on the same device, but lessons must now pass their checks before counting toward certificates. The progress import/export workflow includes assessment records.

## Five user-selectable palettes

The top-right appearance menu provides:

| Palette | Main colors |
|:--|:--|
| Cyberpunk Neon | `#091833` · `#133E7C` · `#0ABDC6` · `#EA00D9` · `#711C91` |
| Quantum Teal | `#041F2A` · `#00C2A8` · `#00E5FF` · `#B7C0CC` · `#F4F7FF` |
| Synthwave Sunset | `#260B68` · `#C231C9` · `#FF4900` · `#FFD319` · `#FF6E40` |
| Bio-Digital Matrix | `#0F172A` · `#0C1A2B` · `#D2FF26` · `#2DD4BF` · `#B2D5E9` |
| Hologram Haze | `#1A1033` · `#B45CFF` · `#FF4FD8` · `#E0F7FA` · `#D9A5CD` |

The interface uses an instrument-inspired visual language: a memory diagram on the home page, a two-column execution workspace, consistent surfaces, and short state-change animations. Motion respects the operating system's **Reduce Motion** preference.

## Running GearEx

No framework, build step, paid API key or account is required to browse the lessons.

```bash
git clone https://github.com/NittinChughani/gearex.git
cd gearex
python -m http.server 8000
```

Visit `http://localhost:8000`, or visit the **[live website](https://nittinchughani.github.io/gearex/)**.

The standalone code playground uses **[Wandbox](https://wandbox.org/)** to compile and run supported languages. That service requires an internet connection, has its own limitations, and receives source entered for compilation. **Don't place passwords or private information in compiler submissions.** By contrast, the native educational trace lab processes source within the browser.

## Project map

```text
gearex/
├── index.html                   # Website layout and learning interfaces
├── assets/
│   ├── favicon.svg             # GearEx symbol
│   ├── style.css               # Original component layout and theme definitions
│   ├── studio.css              # Current interface design + trace lab layout
│   ├── studio-motion.js        # Reveal animation and active navigation states
│   ├── app.js                  # Lessons, quizzes, editor and compiler
│   ├── gearex-engine.js        # Browser-local educational interpreter
│   ├── gearex-trace-ui.js      # Stack, heap, code highlighting and playback
│   ├── gearex-features.js      # Appearance and certificates
│   ├── lesson-assessments.js   # Five-question checks and verification
│   ├── data.js                 # C/C++ curriculum
│   ├── gearex-courses.js       # Additional language curriculum
│   ├── challenges.js           # C/C++ coding exercises
│   └── projects.js             # C/C++ projects
├── docs/
│   ├── CURRICULUM.md
│   └── DEVELOPMENT.md
└── scripts/
    ├── check-content.cjs
    └── test-tracer.cjs
```

### Test the learning data and trace interpreter

```bash
node scripts/check-content.cjs
node scripts/test-tracer.cjs
```

GitHub Actions runs both checks when changes are pushed.

## Privacy and contributions

Learning data is stored in **localStorage** on each device. It doesn't sync automatically across browsers; use Export Progress to save a backup. Clearing local storage can erase progress.

Pull requests that improve the curriculum, runtime-trace coverage, accessibility, security, or documentation are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), and include tests for new interpreter features.

---

<div align="center">
  <p><strong>Built and maintained by Nittin Chughani</strong></p>
  <p>A Computer Science &amp; Engineering student building open-source tools that make learning and everyday tasks easier.</p>
  <small>MIT License · Made for learning through experimentation</small>
</div>

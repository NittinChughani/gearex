# Developing GearEx

GearEx is a dependency-free, browser-first learning platform. It is hosted as a static website and relies on third-party compilation only when someone clicks **Run code** in the Compiler. Its educational trace engine runs completely within the visitor's browser and does not compile arbitrary programs.

## Design architecture

The visual language follows a software lab: information-dense controls, monospace labels for execution state, restrained backgrounds, clear reading rhythm, and color reserved for meaningful status. The home page includes a handcrafted code/stack/heap demonstration. Short animations express real changes—active instruction, new heap value, entering a section—rather than decorating the entire interface.

Five appearance palettes are preserved through CSS custom properties. `assets/style.css` maintains existing components and theme definitions; `assets/studio.css` provides the core workbench layout; `assets/navigation-shell.css` adds the default light appearance, dark mode, palette launcher, and view transitions; `assets/studio-motion.js` adds route-change animations and card sequencing while respecting reduced-motion preferences. No framework or animation package is needed.

## Source map

| File | Responsibility |
|---|---|
| `index.html` | Semantic structure, editors, controls, runtime panels and metadata |
| `assets/data.js` | Original C/C++ lessons and general quizzes |
| `assets/gearex-courses.js` | Python, JavaScript, Java, C#, SQL teaching material |
| `assets/challenges.js` | C/C++ programming challenges |
| `assets/projects.js` | C/C++ guided projects |
| `assets/app.js` | Hash-routed views, appearance preferences, lessons, compiler UI and progress storage |
| `assets/compiler-service.js` | API submission/polling, status normalization and automatic remote-service failover |
| `assets/lesson-assessments.js` | Five-question checks, 4/5 pass rule, best marks and progress migration |
| `assets/gearex-engine.js` | Pure, browser-local educational expression and statement interpreter |
| `assets/gearex-trace-ui.js` | Language auto-detection, source stepping, stack/heap visualization, playback |
| `assets/gearex-features.js` | Appearance selector, final assessments, score-weighted printable certificates |
| `scripts/check-content.cjs` | Content validation, generated lesson-quiz verification, HTML integrity |
| `scripts/test-tracer.cjs` | Memory, control-flow, language detection and safety-limit unit tests |

## How the trace engine works

`GearExEngine.detect(source, fallback)` detects common syntax for seven language families. `GearExEngine.run(source, language)` returns:

```js
{
  lang: 'py',
  mode: 'interpreted-subset', // or 'sql-plan'
  steps: [
    {
      line: 3,
      note: 'Assign total = 6',
      frames: [{name: 'Global', vars: {total: '6'}}],
      heap: [{id: '#1', kind: 'array', items: [{key: '0', value: '6'}]}],
      output: '6\n'
    }
  ],
  warnings: [],
  lines: ['...']
}
```

The engine uses a small parser and a controlled interpreter. It **does not evaluate arbitrary source code using `eval` or a dynamic function constructor** and never sends trace input over the network. Array and object values receive synthetic heap IDs. Variables hold either scalar values or references to those IDs; repeated references share one heap object. Function calls create distinct stack frames, and snapshots show the state after each modeled statement.

Support currently targets introductory assignments, arithmetic, comparisons, conditional branches, counting/collection loops, simple functions, arrays, objects, basic printing and C/C++ stack pointers. This is **not a standards-compliant implementation** of C, C++, Python, JavaScript, Java or C#; unsupported classes, third-party libraries, input operations, advanced memory lifetimes and complex syntax stop with a visible coverage note. The SQL trace is a conceptual clause walkthrough and does not run a database.

Bounded step counts, loop limits and recursion-depth limits prevent deliberately infinite educational snippets from locking up the browser. For accurate behavior of full programs, visitors can use the separately hosted compiler.

### Adding support for an interpreter feature

1. Update the scanner/parser only for syntax that can be modeled correctly.
2. Implement the runtime operation without using direct source evaluation.
3. Add a reproducible test to `scripts/test-tracer.cjs`, including expected step count, output and memory state.
4. Add a learning example or correct a lesson explanation when relevant.
5. Check behavior on a small screen, keyboard controls and reduced-motion mode.

Avoid false claims about executing syntax that GearEx can only annotate.


## Navigation: one view at a time

The website is a hash-routed single-page application. All top-level panels use `data-view="section-id"` on direct children of `<main>`. A route such as `#learn`, `#playground` (displayed to users as **Compiler**), or `#trace` (displayed as **Code Visualizer**) shows its matching panel and hides the others with the `hidden` attribute. The Home screen includes the hero and introductory benefits strip. Deep links `#lesson/{id}`, `#challenge/{id}` and `#project/{id}` show the existing detail panels and highlight their parent navigation item. The browser's Back and Forward navigation works through `hashchange`.

**When adding a new view:** give the section a unique ID and `data-view`, keep the markup initially `hidden`, and add its route ID to `GEAR_VIEWS` in `assets/app.js`. Do not add a long scrolling duplicate of that section. The active section receives `data-active` to trigger a brief animation; visitors using Reduce Motion see instant navigation.

## Color mode and palettes

A keyboard-accessible switch (`#modeSwitch`) controls Light or Dark mode. A button with a nine-square icon (`#themeLauncher`) opens `#themeMenu`; it contains `data-palette` buttons for **No theme**, Cyberpunk Neon, Quantum Teal, Synthwave Sunset and Bio-Digital Matrix. The removed fifth theme must not appear in the menu, stylesheet, or storage validation. Light mode and No theme are the defaults for visitors without saved preferences.

The chosen `mode` and `theme` are stored independently in the existing versioned progress object in localStorage. `setTheme()` updates `document.body.dataset.mode`, `dataset.theme`, switch state, selected palette and the browser theme-color meta tag. User selections are remembered after reload and may be backed up with progress export/import. Existing saved palettes are retained unless the palette is no longer supported, in which case the neutral choice is used.

Theme CSS is split between `assets/studio.css` (dark palette definitions) and `assets/navigation-shell.css` (light-mode adaptation, neutral palette, switch and menu). Only new, relevant transitions should animate; prioritize focus visibility, accessible contrast, no hover-only controls and clear labels.

## Learning and certification

Every language track consists of lessons with an intro, concept explanation, syntax, executable example and practice task. The `lesson-assessments.js` module derives **five multiple-choice questions from the specific lesson content** and requires 4/5 to verify a lesson. Best scores are stored in `gearex-lesson-checks-v1` and included in imported/exported progress.

Certificates unlock when all lessons for a language have verified checks and the final assessment reaches 70%. A certificate receives up to 70 marks from lesson checks and 30 from the final assessment, for a combined score out of 100. The recipient enters their name once; the website stores it in browser localStorage and does not provide an editing control afterward.

**Browser-only limitation:** this cannot prevent browser-data resets, manual edits or identity substitution. This is a self-paced, creator-issued record, not secure or accredited verification. Do not market it as tamper-proof.

## Coding practices

Never inject untrusted source text through `innerHTML`; use `textContent` and explicit DOM creation for previews, output and variable values. The educational tracer must not make network calls, access local files, or run arbitrary user JavaScript. The compiler feature discloses that entered code is sent to the separate service.

New learning tasks must have meaningful input/output examples. Quiz distractors must be distinct and technically defensible, and each lesson must have enough educational material to produce a valid check.

## Test and release

Run these commands before merging:

```bash
node scripts/check-content.cjs
node --test scripts/test-tracer.cjs
```

The `.github/workflows/validate.yml` workflow also checks the syntax of every production JavaScript file. Verify the live GitHub Pages deployment separately before announcing changes; successful lint checks alone do not validate interactive rendering or third-party compilation.

## Online Compiler reliability

The **Compiler** submits source and stdin to remote sandboxed services. The standalone `assets/compiler-service.js` first tries Judge0 CE (using a known language ID and asynchronous submission-token polling), then uses Wandbox as backup when the request fails, times out, the queue is unreachable, or a container runtime error is returned (including `OCI runtime error: crun: clone: Resource temporarily unavailable`). The backup uses a cached compiler catalog and prefers stable releases over HEAD builds.

`assets/app.js` detects recognizable source syntax through `GearExEngine.detect`, updates the language selector on a confident mismatch, and submits the chosen language to `GearExCompiler.compile`. The output shows which backend completed the run and how long the run took. Genuine code errors return unsuccessful results and **must not trigger a second execution**. A successful sample test still compares raw stdout against the sample's expected output, and is only counted for the correct challenge language.

Both remote services are independent of GitHub Pages and may rate-limit requests, be unavailable, or have a backlog. Never imply local compilation or guarantee runtime success when both are offline; errors should explain that the external service did not execute the code. A JavaScript browser sandbox is not a safe substitute for real multi-language program execution. The Code Visualizer remains a separate educational interpreter with deliberately limited syntax coverage.

Test local service behavior without making real network calls:

```
node --test scripts/test-compiler.cjs
```

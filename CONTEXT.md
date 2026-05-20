# CONTEXT.md
**Timestamp:** 2026-05-20 (Nepal Time)

---

## 1. Project Status

| Module | Status |
|---|---|
| Theme system (globals.css, ThemeContext, ThemeToggle) | ✅ Complete |
| Dropdown component | ✅ Complete |
| Navbar | ✅ Complete |
| Sidebar | ✅ Complete |
| AppShell (state + layout wiring) | ✅ Complete |
| layout.tsx + page.tsx | ✅ Complete |
| MainContent (all 6 section views + sub-components) | ✅ Complete |
| FilterBar (by topic, by question number) | ❌ Not started |
| Collapse/minimize toggles on topic sections | ❌ Not started |
| Polish pass (animations, edge cases) | ❌ Not started |

---

## 2. Last Completed Task

Built and delivered all core layout and content files in one session:
- `Navbar.tsx` — subject buttons (abbreviated labels), theme toggle, hamburger on mobile
- `Sidebar.tsx` — section nav buttons, subject dropdown on mobile, theme toggle row on mobile
- `AppShell.tsx` — client shell that owns all state, exposes `AppStateContext`
- `layout.tsx` — root Next.js layout wrapping `ThemeProvider` + `AppShell`
- `page.tsx` — reads `AppStateContext`, passes to `MainContent`
- `MainContent.tsx` — loads correct JSON, routes to section view, contains all sub-components

---

## 3. Next Task

**FilterBar component** — sits at the top of the main content area, filters visible questions by topic and by question number. Spec:
- Filter by topic (dropdown, populated from the active subject's `topics` array)
- Filter by question number (input or multi-select)
- Filters apply to past papers and mock papers sections only; other sections ignore them
- Clear filters button
- Filter state should live in `MainContent.tsx` or a child, not in `AppShell`

After FilterBar: collapse/minimize toggles on each topic group and paper year block.

---

## 4. Current JSON Schema

**DO NOT CHANGE without flagging.**

```json
{
  "subject": "string",
  "code": "string",
  "topics": [
    {
      "id": "string",
      "name": "string",
      "unit": "string",
      "priority": "high | medium | low",
      "appearedIn": [
        {
          "year": "string",
          "questionNumbers": [1, 2]
        }
      ]
    }
  ],
  "papers": [
    {
      "year": "string",
      "questions": [
        {
          "number": 1,
          "part": "a | b | null",
          "topic": "topicId",
          "question": "string",
          "answer": "string",
          "marks": 5
        }
      ]
    }
  ],
  "mockPapers": [
    {
      "id": "mock-1",
      "questions": [
        {
          "number": 1,
          "part": "a | b | null",
          "topic": "topicId",
          "question": "string",
          "answer": "string",
          "marks": 5
        }
      ]
    }
  ],
  "patternAnalysis": {
    "guaranteed": ["topicId"],
    "likely": ["topicId"],
    "wildcards": ["topicId"],
    "priorityOrder": ["topicId"],
    "notes": "string"
  }
}
```

---

## 5. Completed Modules — File Paths

```
app/globals.css                        ✅ theme tokens, reset, typography, utilities
app/layout.tsx                         ✅ root layout — ThemeProvider + AppShell
app/page.tsx                           ✅ root page — reads AppStateContext → MainContent

context/ThemeContext.tsx               ✅ ThemeProvider, useTheme hook, localStorage persistence

components/
  ui/
    Dropdown.tsx                       ✅ generic dropdown — flat/grouped, accent dots, icons, sizes
    ThemeToggle.tsx                    ✅ sun/moon button — calls useTheme().toggleTheme()
  layout/
    Navbar.tsx                         ✅ subject buttons, theme toggle, hamburger (mobile)
    Sidebar.tsx                        ✅ section nav, subject dropdown (mobile), slide-in
    AppShell.tsx                       ✅ state owner, AppStateContext, main layout wrapper
    MainContent.tsx                    ✅ JSON loader, 6 section views, QuestionCard, TopicList, PaperBlock
```

---

## 6. Current Folder Structure

```
projectroot/
  app/
    data/
      CSC314_DAA.json          subject data — Design and Analysis of Algorithms
      CSC315_SAD.json          subject data — System Analysis and Design
      CSC316_Cryptography.json subject data — Cryptography
      CSC317_Simulation.json   subject data — Simulation and Modeling
      CSC318_WebTech.json      subject data — Web Technology
      CSC319_Multimedia.json   subject data — Multimedia Computing
    globals.css                theme tokens + global reset
    layout.tsx                 root Next.js layout
    page.tsx                   root page component
    favicon.ico
  components/
    layout/
      AppShell.tsx             state shell + AppStateContext
      MainContent.tsx          section router + all content sub-components
      Navbar.tsx               top navigation bar
      Sidebar.tsx              left sidebar panel
    ui/
      Dropdown.tsx             reusable dropdown
      ThemeToggle.tsx          light/dark toggle button
  context/
    ThemeContext.tsx            theme state + useTheme hook
  public/                      static assets (Next.js default)
  .gitignore
  next.config.ts
  package.json
  tsconfig.json
  eslint.config.mjs
  postcss.config.mjs
  CONTEXT.md                   this file
```

---

## 7. Unresolved Decisions / Open Questions

- **Filter persistence** — should filter selections reset when the user switches subject or section? (Assumption: yes, reset on subject change. Confirm before building FilterBar.)
- **Answer formatting** — answers in the JSON contain raw text with some markdown-like formatting (numbered lists, code snippets). Currently rendered as `white-space: pre-wrap` plain text. A future task should decide whether to parse markdown or keep plain text.
- **Collapse state persistence** — should collapsed/expanded state of topic groups persist across section switches, or always reset to expanded? Not decided.

---

## 8. Agreed Deviations from Original Instructions

- `Theme.tsx` was named `ThemeToggle.tsx` instead — more accurately describes what it renders. User was notified and did not object.
- `Sidebar.tsx` uses inline `<nav>` buttons for section selection instead of the `Dropdown` component. Reason: on desktop the sidebar is always visible and a persistent list is better UX than a dropdown. The `Dropdown` is used only for the subject switcher inside the sidebar on mobile, as specified.
- `AppShell.tsx` owns `AppStateContext` rather than having a separate `context/AppState.tsx` file — kept co-located to reduce file count while the app is small. Can be extracted later.

---

## 9. Known Bugs / Issues

- **Sidebar `aria-hidden` via CSS** — the mobile slide-in uses `aria-hidden` set as a static HTML attribute and toggled via CSS `[aria-hidden="true"]` selector. React does not reactively update this attribute via the style-based approach used. The `aria-hidden` prop on the `<aside>` is correctly passed as a React prop (it will update in the DOM), but the CSS selector approach for the transform is coupled to it. **Verify in browser that `aria-hidden` is being set/removed correctly on toggle.** If not, a small `useEffect` setting `element.setAttribute('aria-hidden', ...)` may be needed. File: `components/layout/Sidebar.tsx`.

- **`@/` path alias** — all imports use `@/` alias. Requires `"paths": { "@/*": ["./*"] }` in `tsconfig.json`. Standard Next.js scaffold includes this but confirm before first `npm run dev`.

- **JSON import types** — `MainContent.tsx` imports JSON files directly and casts to `unknown` then to local interfaces. TypeScript may warn depending on `tsconfig` `resolveJsonModule` setting. Add `"resolveJsonModule": true` to `tsconfig.json` if errors appear on JSON imports.

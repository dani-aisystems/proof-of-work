# Proof of Work

A personal AI engineering academy. It teaches Claude Code, HTTP and the agent loop through interactive labs. Progress counts only evidence: first-attempt answers, completed exercises, and passed spaced reviews.

## What's in it

- **Module 01: Claude Code, properly.** Six lessons: the agentic loop, explore → plan → implement → commit, context and CLAUDE.md, reviewing generated diffs, skills/hooks/subagents/MCP, and permissions and prompt injection. Each lesson has a hands-on lab, and the module ends with a checkpoint quiz.
- **Module 02: HTTP and APIs, precisely.** Request anatomy and status codes, practiced against a simulated Lead API (no network).
- **Skill map.** Each skill moves through Introduced → Practiced → Demonstrated → Ready to apply, based on evidence.
- **Spaced review.** A wrong answer comes back the same day. A right answer comes back after 3, 7, 16, then 35 days.
- **Roadmap** of 11 modules, ending in a capstone: an AI lead-handling agent.

Every lesson follows the same eight steps: Problem → Explain → See it → In your work → Try it → Test → Feedback → Apply.

## Running it

It's a single self-contained page. No framework, no dependencies.

```bash
npm run build          # writes dist/index.html and dist/artifact.html
open dist/index.html   # or deploy dist/ to Vercel or GitHub Pages
```

| Feature | As a Claude artifact | Standalone (`dist/index.html`) |
|---|---|---|
| Lessons, labs, quizzes, review | Yes | Yes |
| Progress | Private per-user store in your Claude account | This browser's localStorage |
| AI tutor and AI grading | Yes, through the viewer's Claude account | Hidden; falls back to model answers |
| Export / import progress | Yes | Yes (copy and paste) |

## Your profile

On first launch the app asks for a name, three questions about how you work, and an eight-question diagnostic. Diagnostic misses are flagged across the dashboard and skill map, and the tutor uses your answers to pitch explanations at your level. All of it is stored with your progress, not in the code. You can redo it any time from **Profile and data**.

To skip setup in your own build, copy `src/profile.local.example.js` to `src/profile.local.js` (gitignored) and fill it in. `npm run build` then also writes `private/artifact.html` (gitignored) with your profile pre-filled. The committed `dist/` files never contain it.

## Structure

```
src/
  content.js   curriculum: lessons, questions, setup and diagnostic, lab data, sources
  app.js       engine: routing, mastery model, storage, labs, tutor
  styles.css   design tokens (light + dark) and components
  profile.local.example.js   template for an optional private profile preset
scripts/
  build.mjs    assembles src/ into dist/
dist/          built pages (committed so the app runs without a build step)
```

To add a lesson, add an entry to `LESSONS` in `src/content.js`, list its id in a module's `lessons` array in `MODULES`, and rebuild.

## Sources

Claude Code facts were checked against [code.claude.com/docs](https://code.claude.com/docs/en/best-practices) on 25 Oct 2026. HTTP material follows [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview). Video links were checked against YouTube's own metadata on the same date. Their contents weren't reviewed in full.

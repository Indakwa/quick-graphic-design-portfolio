# Backlog

## Project case-study modal (parked)

**What it was:** clicking a project's "View project →" button opened a full-height sheet with the full case study: label, title, tags, role / year / client, three columns (The brief, The wrong idea, The result), a gallery laid out full / 2-up / full / 3-up, a process strip of rejected directions, a "My role" paragraph, and previous / next project buttons. The sheet synced with the URL (`/#pm-kenya`, `/#bigfoot-tees`, `/#nobody-asked`), so links could be shared and the back button closed it.

**Why it's parked:** the site now uses a simpler interaction. Clicking any image opens it larger in a lightbox (`components/Lightbox.tsx`).

**What's still in the repo, unused:**

| File | Role |
|---|---|
| `components/ProjectModal.tsx` | The sheet, gallery template, focus trap, keyboard and swipe-to-close |
| `lib/useHashModal.ts` | URL hash ⇄ open project, back-button handling, deep links |
| `components/Cta.tsx` | The "View project →" button |
| `lib/content.ts` | Each project still has `brief`, `wrongIdea`, `result`, `roleDetail`, `gallery`, `process` and `cta` filled in with dummy copy |

**To bring it back:**

1. In `components/Portfolio.tsx`, call `useHashModal(projects.map(p => p.slug))` and render `<ProjectModal slug={slug} onClose={close} onNavigate={open} />`.
2. Add a `<Cta slug={project.slug} onClick={…}>` back into `ProjectSplit`, `ProjectStacked` and `NobodyAsked`. Git history has the exact versions (the commit before "Replace project modal with image lightbox").
3. Write real `gallery` and `process` media and the case-study copy in `lib/content.ts`.
4. Decide whether clicking an image should still open the lightbox or open the case study instead.

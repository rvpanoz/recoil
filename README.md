# Recoil

A 2D browser physics game where you can only move by shooting: every shot pushes you the opposite way.

Built with [Phaser 4](https://phaser.io), Matter.js, TypeScript and Vite.

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
npm install
npm run dev
```

## Commands

| Command             | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Vite dev server with HMR (physics debug on)       |
| `npm run build`     | Typecheck and production build to `dist/`         |
| `npm run preview`   | Serve the production build locally                |
| `npm run typecheck` | `tsc --noEmit`                                    |
| `npm run lint`      | ESLint + Prettier check                           |
| `npm run format`    | Format everything with Prettier                   |
| `npm run test`      | Vitest unit tests for `src/core`                  |
| `npm run check`     | typecheck + lint + test (run before every commit) |

## Deployment

Every push to `main` is checked, built and deployed to GitHub Pages by `.github/workflows/ci.yml`.
In the repository settings, set **Pages → Source** to **GitHub Actions**.

## Docs

- [PLAN.md](./PLAN.md): vision, architecture and phases
- [PROGRESS.md](./PROGRESS.md): current status and session log
- [CLAUDE.md](./CLAUDE.md): conventions for AI coding agents

## License

[MIT](./LICENSE)

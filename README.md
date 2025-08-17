# Recipes (Vite + React + TS)

 Read-only, offline-capable recipe app. Web (GitHub Pages) + Desktop (Tauri).

## Scripts

- dev: start Vite dev server
- build: production build
- preview: preview build
- test: run Vitest
- tauri: desktop dev/build

## Notes

- First run seeds IndexedDB from `src/data/recipes` (TypeScript modules).
- PWA enabled; works offline after first load.
- Pages deploy auto-detects correct base for GitHub Pages; for a custom domain, build with base `/`.

## Recipes format (TypeScript)

- Recipes live as typed modules under `src/data/recipes/` (one file per recipe) and are auto-discovered at build time.
- The aggregator `src/data/recipes/index.ts` uses `import.meta.glob` to include every `*.ts` file in that folder.
- The app seeds IndexedDB on first run and also updates existing recipes when content changes.

Add a new recipe

1. Create a file in `src/data/recipes/`, e.g. `lasagne.ts`, exporting a default `Recipe` object (typed from `src/lib/schema.ts`).
2. No need to edit an index—new files are auto-included.
3. Reload the app. If you previously loaded the app, content updates are detected automatically. If needed, clear localStorage for a clean reseed.

## Publish to GitHub Pages

1. Create a GitHub repository and push this project:

```bash
git init
git add -A
git commit -m "init"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

1. The included GitHub Actions workflow builds the app and deploys it to Pages automatically on pushes to `main`.

Notes:

- The workflow sets the Vite `base` dynamically to `/${repo}/` and copies `index.html` to `404.html` for SPA routing.
- If you use a custom domain or user/organization site, set `--base=/` in the build step.

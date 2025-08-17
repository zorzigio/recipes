# Recipes (Vite + React + TS)

 Read-only, offline-capable recipe app. Web (GitHub Pages) + Desktop (Tauri).

## Scripts

- dev: start Vite dev server
- build: production build
- preview: preview build
- test: run Vitest
- tauri: desktop dev/build

## Notes

- First run seeds IndexedDB from `src/data/recipes.ts`.
- PWA enabled; works offline after first load.
- Pages deploy uses base `/recipes_v2/`.

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

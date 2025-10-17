<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/13Vcd8D0nB6hGhtaVOUVAEKysVTtIILO7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy (GitHub Pages)

This project is preconfigured to deploy to GitHub Pages via GitHub Actions.

1. Push to the `main` branch on GitHub.
2. In your repository, go to Settings → Pages, and ensure:
   - Source: "GitHub Actions"
3. The deploy workflow (`.github/workflows/deploy.yml`) builds and publishes the `dist` directory to Pages.

Notes:
- Vite `base` is set to `/Ryutashimada/`. If your repo name differs, update `vite.config.ts` → `base` accordingly.
- Your site will be available at: `https://<your-username>.github.io/<your-repo>/` (e.g., `https://yourname.github.io/Ryutashimada/`).

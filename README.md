<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ClearSpend — AI-Powered Financial Statement Analyzer

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```
   npm install
   ```

2. Copy the env template and add your Gemini API key:
   ```
   cp .env.example .env.local
   ```
   Edit `.env.local` and set `VITE_GEMINI_API_KEY` to your key.  
   Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).

3. Start the dev server:
   ```
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploy to Production

1. Set the `VITE_GEMINI_API_KEY` environment variable in your hosting platform (Render, Railway, Heroku, etc.).

2. Build the frontend:
   ```
   npm run build
   ```

3. Start the production server:
   ```
   npm run start
   ```

The server reads `PORT` from the environment (default: `3000`) and serves the built frontend from `dist/`.

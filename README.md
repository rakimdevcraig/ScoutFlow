# ScoutFlow

ScoutFlow is a weekend MVP for basketball coaches: enter opponent notes and generate a structured pre-game scouting report.

## What it does

- Basketball-only scouting form
- Dynamic opponent player tendency notes
- Zod validation for scouting input and report output
- OpenRouter integration: primary `nvidia/nemotron-3-nano-30b-a3b:free` (Nemotron 3 Nano), with automatic fallback to `openai/gpt-oss-20b:free` when the primary model’s HTTP request fails (optional overrides: `OPENROUTER_MODEL`, `OPENROUTER_FALLBACK_MODEL`)
- Regenerate report, copy player brief, and download Markdown report

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## OpenRouter key (required for generation)

Create **`.env.local`** in the project root (note the leading dot):

```bash
OPENROUTER_API_KEY=your_key_here
```

Restart `npm run dev` after adding or changing the key.

Without `OPENROUTER_API_KEY`, report generation returns an error from the API. The report page shows an empty state until you successfully generate a report in this browser session.

## Demo flow

1. Open the home page (`/`) — the create-report form
2. Click **Use demo data**
3. Click **Generate report**
4. On the report page, try **Regenerate report**, **Copy player brief**, and **Download Markdown**

## Checks

```bash
npm test
npm run build
npm run lint
```

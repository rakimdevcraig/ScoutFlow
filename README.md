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

# ScoutFlow — Basketball AI scouting report generator

## Problem statement

This was created because I have a friend who is a high school basketball coach and he needed a way to generate scouting reports for his players in a way that was easy for them to understand.

## Solution overview

The user fills out a short form with opponent details such as pace of play, offensive and defensive style, top strengths and weaknesses, key players, things to watch for, and player-specific tendencies. The app then generates a structured scouting report with sections like opponent summary, top threats, exploitable weaknesses, defensive priorities, offensive priorities, and more.

## AI integration

ScoutFlow uses the **OpenRouter Chat Completions API** with **NVIDIA Nemotron 3 Nano** (`nvidia/nemotron-3-nano-30b-a3b:free`) as the primary model and **OpenAI GPT OSS 20B** (`openai/gpt-oss-20b:free`) as a fallback if the primary API request fails. OpenRouter was chosen so capable free models could be tried through one API.

The product is not a fully autonomous agent. The main pattern is **generate → validate with Zod → extract JSON → one repair retry**. The system prompt instructs the model to act as a basketball scouting assistant, use only the coach’s notes, avoid unsupported details, and return JSON. After the model responds, the app validates output against a fixed scouting report schema. If the response includes extra text or malformed JSON, the app extracts JSON when possible and retries once with a repair prompt.

The AI integration exceeded expectations in organizing scattered notes into useful sections (threats, weaknesses, priorities, matchups, player-facing brief). It fell short on reliability when input was thin—the model could sound confident—so the report **surfaces missing information** instead of inventing stats or details the coach did not provide.

## Architecture and design

ScoutFlow is a **Next.js** app with a simple frontend-to-backend flow. The frontend collects scouting notes (game context, opponent profile, player tendencies, coaching goals). Before calling the AI, the app normalizes form data and validates it with **Zod**.

A **server route** validates the request again, then calls OpenRouter. Prompt building, the OpenRouter request, JSON extraction, fallback handling, and repair retry live in separate **AI helper** modules so the route stays thin.

**Data flow:** coach submits the form → validated scouting input → backend sends a structured prompt to OpenRouter → model returns JSON → app validates with Zod → UI renders coach sections and a player brief. The latest report lives in **session storage** for the current browser session (regenerate, copy player brief, download Markdown) without a full database.

Structured JSON (not freeform prose) makes validation, rendering, and export reliable. The schema includes **missing information** and internal **confidence** on key items (confidence is validated but not shown in the UI).

**MCP:** not used in the app; external AI is OpenRouter only.

**Tradeoff:** simpler architecture, but dependence on valid structured output and OpenRouter availability—mitigated with Zod, extraction, repair retry, and fallback model.

**Assumption:** coaches provide enough useful notes for a good report. The UI warns on sparse input, and the model is asked to list missing information rather than invent details.

## AI coding tools

**Cursor** sped up scaffolding, forms, schemas, prompt files, and wiring the UI to report generation. Markdown specs under **`prompts/`** (project goal, schema, system prompt, implementation plan) gave the coding assistant concrete instructions so generated code stayed aligned with ScoutFlow.

Early models/APIs were unreliable (including server errors), which motivated the **fallback model** and stronger error handling.

## Testing and error handling

Tests use **Vitest**: mocked OpenRouter for success, malformed output, repair retry, fallback on primary failure, and missing API key; separate tests for **JSON extraction** (markdown fences, extra prose, braces inside strings). An **optional live OpenRouter smoke test** runs when `OPENROUTER_API_KEY` is set.

**Error handling:** validate input before generation and output after; one retry on bad JSON; fallback model on API failure; clear errors when generation still fails.

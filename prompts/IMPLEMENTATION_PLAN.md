# ScoutFlow Implementation Plan

## Milestone 1 - App Scaffold and Form

Goal:
Set up the app structure and build the core basketball scouting input flow.

Tasks:

- scaffold Next.js app structure
- create landing page
- create create-report page
- build basketball scouting form
- add dynamic player tendency entries
- create basic report page shell
- use mock data only for now

## Milestone 2 - Schemas and UI Rendering

Goal:
Add strong validation and render a structured report cleanly.

Tasks:

- create Zod schemas
- infer TypeScript types
- add input normalization helpers
- add completeness scoring
- create mock sample input/output
- render report sections from structured JSON
- hide confidence fields in the UI

## Milestone 3 - AI Integration

Goal:
Connect the app to OpenRouter and generate real reports.

Tasks:

- add prompt helpers
- implement OpenRouter request
- parse JSON safely
- validate model output
- retry once on malformed output
- return mock data when no API key exists

## Milestone 4 - Polish and Demo Readiness

Goal:
Make the app polished and ready for submission/demo.

Tasks:

- add loading states
- add error states
- add regenerate flow
- add copy/export actions
- improve styling
- write README
- prepare demo seed data

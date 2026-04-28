# ScoutFlow - Basketball Project Spec

## Overview

ScoutFlow is an AI-powered pre-game scouting report generator for basketball coaches. It helps coaches turn fragmented opponent notes, player tendencies, and recent observations into a structured, actionable game plan.

## Problem

Basketball coaches often prepare for opponents using scattered notes, memory, assistant feedback, text messages, and partial stat sheets. The challenge is not collecting observations — it is turning incomplete and messy information into a clear, prioritized scouting report that players and coaches can actually use before a game.

## Primary User

A high school or youth basketball coach preparing for an upcoming game.

## MVP Goal

A coach can enter opponent scouting notes, click Generate Report, and receive:

- opponent summary
- top threats
- exploitable weaknesses
- defensive priorities
- offensive priorities
- key matchups
- first-quarter checklist
- in-game adjustment triggers
- missing information
- player-facing brief

## Sport Scope

Basketball only for MVP.

## Why AI

The hard part of scouting is not storing notes — it is synthesizing incomplete information into a useful game plan. Coaches often have:

- qualitative notes
- partial stat knowledge
- observations about specific players
- tendencies gathered from film or prior matchups

A static template can organize this information, but AI is useful for turning these fragmented observations into a structured, prioritized report with actionable recommendations.

## Primary Value Proposition

ScoutFlow helps coaches prepare faster and communicate more clearly by turning messy opponent notes into:

- a structured coach-facing scouting report
- a concise player-facing brief
- clear tactical priorities and matchup notes

## MVP Inputs

### Game Context

- opponentName
- gameDate
- location (home / away / neutral)
- gameImportance (league / playoffs / tournament / scrimmage)

### Opponent Profile

- paceOfPlay
- offensiveStyle
- defensiveStyle
- topStrengths
- topWeaknesses
- keyPlayers
- thingsToLookOutFor
- freeformOpponentNotes

### Player Tendencies

The coach can add one or more opponent players and notes for each player.

Each player entry should include:

- playerIdentifier (name, number, or both)
- playerRole (optional)
- tendencyNotes

Example:

- Player 0
- Guard
- Likes to drive left into pull-up jumpers and drive right to attack the rim

### Coaching Objectives

- topGamePriority
- riskLevel (conservative / balanced / aggressive)
- outputTone (tactical / simple / motivational)

## MVP Outputs

### Coach Report Sections

- opponentSummary
- topThreats
- exploitableWeaknesses
- defensivePriorities
- offensivePriorities
- keyMatchups
- firstQuarterChecklist
- adjustmentTriggers
- missingInformation

### Player Brief

- whatToExpect
- focusPoints
- whatToAvoid
- mindsetMessage

## Confidence Handling

The AI output should include internal per-item confidence fields for major analytical sections such as topThreats and exploitableWeaknesses.

These confidence fields are:

- used internally in the structured output
- validated in the backend schema
- available for future ranking/filtering/debugging
- not shown in the user interface

Uncertainty should be surfaced to the user primarily through the missingInformation section rather than visible confidence labels.

## Product Principles

- structured output over freeform text blobs
- grounded only in user-provided input
- concise and practical recommendations
- useful for real basketball prep, not generic advice
- simple enough to complete quickly before a game

## Non-AI Logic

The app should include deterministic logic for:

- validating form input with Zod
- normalizing text fields into structured arrays
- validating player tendency entries
- computing an input completeness score
- warning the user when the report may be weaker due to sparse input
- storing generated reports locally or in SQLite

## Technical Stack

- Next.js
- TypeScript
- Tailwind CSS
- Zod
- OpenRouter API
- models: primary `google/gemma-4-31b-it:free`, fallback `minimax/minimax-m2.5:free`

## AI Integration Requirements

The model should return structured JSON.
The app should:

- validate the JSON response
- render it as readable sections in the UI
- hide internal confidence fields from the frontend display
- handle malformed model output robustly
- use mock fallback report data in development if needed

## Error Handling

Handle:

- missing required inputs
- low-information submissions
- malformed model JSON
- model timeouts or failures
- retry / regenerate flows

## Nice-to-have Features

- report history
- export to Markdown
- copy player brief
- sample demo input preset

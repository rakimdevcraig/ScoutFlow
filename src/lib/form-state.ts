import { normalizeToStringList } from "./normalize";
import type { ScoutingInput } from "./types";

export type GameContextForm = {
  opponentName: string;
  gameDate: string;
  location: "" | "home" | "away" | "neutral";
  gameImportance: "" | "league" | "playoffs" | "tournament" | "scrimmage";
};

export type OpponentProfileForm = {
  paceOfPlay: string;
  offensiveStyle: string;
  defensiveStyle: string;
  topStrengths: string;
  topWeaknesses: string;
  keyPlayers: string;
  thingsToLookOutFor: string;
  freeformOpponentNotes: string;
};

export type PlayerRowForm = {
  playerIdentifier: string;
  playerRole: string;
  tendencyNotes: string;
};

export type CoachingObjectivesForm = {
  topGamePriority: string;
  riskLevel: "" | "conservative" | "balanced" | "aggressive";
  outputTone: "" | "tactical" | "simple" | "motivational";
};

export type ScoutingFormState = {
  game: GameContextForm;
  opponent: OpponentProfileForm;
  players: PlayerRowForm[];
  coaching: CoachingObjectivesForm;
};

export function getInitialFormState(): ScoutingFormState {
  return {
    game: {
      opponentName: "",
      gameDate: "",
      location: "",
      gameImportance: "",
    },
    opponent: {
      paceOfPlay: "",
      offensiveStyle: "",
      defensiveStyle: "",
      topStrengths: "",
      topWeaknesses: "",
      keyPlayers: "",
      thingsToLookOutFor: "",
      freeformOpponentNotes: "",
    },
    players: [
      { playerIdentifier: "", playerRole: "", tendencyNotes: "" },
    ],
    coaching: {
      topGamePriority: "",
      riskLevel: "",
      outputTone: "",
    },
  };
}

/** Map UI form to API-shaped input (arrays, optional undefined). */
export function formStateToScoutingInput(form: ScoutingFormState): ScoutingInput {
  const playerTendencies = form.players
    .filter(
      (p) =>
        p.playerIdentifier.trim() ||
        p.playerRole.trim() ||
        p.tendencyNotes.trim(),
    )
    .map((p) => ({
      playerIdentifier: p.playerIdentifier.trim(),
      playerRole: p.playerRole.trim() || undefined,
      tendencyNotes: p.tendencyNotes.trim(),
    }));

  return {
    opponentName: form.game.opponentName.trim(),
    gameDate: form.game.gameDate.trim() || undefined,
    location: form.game.location || undefined,
    gameImportance: form.game.gameImportance || undefined,
    paceOfPlay: form.opponent.paceOfPlay.trim() || undefined,
    offensiveStyle: form.opponent.offensiveStyle.trim() || undefined,
    defensiveStyle: form.opponent.defensiveStyle.trim() || undefined,
    topStrengths: normalizeToStringList(form.opponent.topStrengths),
    topWeaknesses: normalizeToStringList(form.opponent.topWeaknesses),
    keyPlayers: normalizeToStringList(form.opponent.keyPlayers),
    thingsToLookOutFor: normalizeToStringList(form.opponent.thingsToLookOutFor),
    freeformOpponentNotes:
      form.opponent.freeformOpponentNotes.trim() || undefined,
    playerTendencies,
    topGamePriority: form.coaching.topGamePriority.trim() || undefined,
    riskLevel: form.coaching.riskLevel || undefined,
    outputTone: form.coaching.outputTone || undefined,
  };
}

/** Input snapshot for completeness (ignore partially filled player rows). */
export function formStateForCompleteness(form: ScoutingFormState): ScoutingInput {
  const base = formStateToScoutingInput(form);
  return {
    ...base,
    playerTendencies: base.playerTendencies.filter(
      (p) => p.playerIdentifier.length > 0 && p.tendencyNotes.length > 0,
    ),
  };
}

const listToTextarea = (items: string[]) => items.join("\n");

/** Populate the form from validated input (used by the demo preset). */
export function scoutingInputToFormState(input: ScoutingInput): ScoutingFormState {
  const players =
    input.playerTendencies.length > 0
      ? input.playerTendencies.map((p) => ({
          playerIdentifier: p.playerIdentifier,
          playerRole: p.playerRole ?? "",
          tendencyNotes: p.tendencyNotes,
        }))
      : [{ playerIdentifier: "", playerRole: "", tendencyNotes: "" }];

  return {
    game: {
      opponentName: input.opponentName,
      gameDate: input.gameDate ?? "",
      location: input.location ?? "",
      gameImportance: input.gameImportance ?? "",
    },
    opponent: {
      paceOfPlay: input.paceOfPlay ?? "",
      offensiveStyle: input.offensiveStyle ?? "",
      defensiveStyle: input.defensiveStyle ?? "",
      topStrengths: listToTextarea(input.topStrengths),
      topWeaknesses: listToTextarea(input.topWeaknesses),
      keyPlayers: listToTextarea(input.keyPlayers),
      thingsToLookOutFor: listToTextarea(input.thingsToLookOutFor),
      freeformOpponentNotes: input.freeformOpponentNotes ?? "",
    },
    players,
    coaching: {
      topGamePriority: input.topGamePriority ?? "",
      riskLevel: input.riskLevel ?? "",
      outputTone: input.outputTone ?? "",
    },
  };
}

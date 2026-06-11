/**
 * DOMAIN: Pure scoring logic (no side effects)
 * f(prediction, result) → points
 */

export interface Prediction {
  pred_home: number;
  pred_away: number;
}

export interface Result {
  real_home: number;
  real_away: number;
}

/**
 * Calculate points for a single match prediction.
 * 3 pts = exact score | 1 pt = correct result (W/L/D) | 0 = wrong
 */
export function calculatePoints(pred: Prediction, result: Result): 0 | 1 | 3 {
  // Exact score
  if (pred.pred_home === result.real_home && pred.pred_away === result.real_away) {
    return 3;
  }

  const predOutcome = Math.sign(pred.pred_home - pred.pred_away);
  const realOutcome = Math.sign(result.real_home - result.real_away);

  if (predOutcome === realOutcome) return 1;
  return 0;
}

/**
 * Get readable outcome label
 */
export function getOutcome(home: number, away: number): 'home' | 'draw' | 'away' {
  if (home > away) return 'home';
  if (home < away) return 'away';
  return 'draw';
}

/**
 * Format score as "X - Y"
 */
export function formatScore(home: number, away: number): string {
  return `${home} - ${away}`;
}

/**
 * Phase display names in Spanish
 */
export const PHASE_LABELS: Record<string, string> = {
  GROUP: 'Fase de Grupos',
  R32:   'Dieciseisavos',
  R16:   'Octavos de Final',
  QF:    'Cuartos de Final',
  SF:    'Semifinales',
  TPP:   'Tercer Lugar',
  FINAL: 'Final',
};

/**
 * Group name helper
 */
export function getGroupLabel(groupId: string): string {
  return `Grupo ${groupId}`;
}

export const AVATARS = ['⚽', '🥅', '🏆', '🥇', '⭐', '🔥', '🦁', '🦅', '🐉', '🦊'];

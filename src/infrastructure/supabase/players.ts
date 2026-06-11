import { supabase, QuinielaPlayer, QuinielaPrediction, LeaderboardEntry, MatchPoints } from './client';

export async function getPlayers(): Promise<QuinielaPlayer[]> {
  const { data, error } = await supabase
    .from('quiniela_players')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function createPlayer(name: string, avatar = '⚽'): Promise<QuinielaPlayer> {
  const { data, error } = await supabase
    .from('quiniela_players')
    .insert({ name, avatar })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePlayer(id: string): Promise<void> {
  const { error } = await supabase.from('quiniela_players').delete().eq('id', id);
  if (error) throw error;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('quiniela_leaderboard')
    .select('*');
  if (error) throw error;
  return data ?? [];
}

export async function getPlayerPredictions(playerId: string): Promise<QuinielaPrediction[]> {
  const { data, error } = await supabase
    .from('quiniela_predictions')
    .select('*')
    .eq('player_id', playerId);
  if (error) throw error;
  return data ?? [];
}

export async function getPlayerMatchPoints(playerId: string): Promise<MatchPoints[]> {
  const { data, error } = await supabase
    .from('quiniela_match_points')
    .select('*')
    .eq('player_id', playerId)
    .order('match_number');
  if (error) throw error;
  return data ?? [];
}

export async function getAllMatchPoints(): Promise<MatchPoints[]> {
  const { data, error } = await supabase
    .from('quiniela_match_points')
    .select('*')
    .order('match_number');
  if (error) throw error;
  return data ?? [];
}

export async function upsertPrediction(
  playerId: string,
  matchId: number,
  predHome: number,
  predAway: number
): Promise<void> {
  const { error } = await supabase
    .from('quiniela_predictions')
    .upsert(
      { player_id: playerId, match_id: matchId, pred_home: predHome, pred_away: predAway, updated_at: new Date().toISOString() },
      { onConflict: 'player_id,match_id' }
    );
  if (error) throw error;
}

export async function bulkUpsertPredictions(
  predictions: { player_id: string; match_id: number; pred_home: number; pred_away: number }[]
): Promise<void> {
  const { error } = await supabase
    .from('quiniela_predictions')
    .upsert(predictions.map(p => ({ ...p, updated_at: new Date().toISOString() })), {
      onConflict: 'player_id,match_id',
    });
  if (error) throw error;
}

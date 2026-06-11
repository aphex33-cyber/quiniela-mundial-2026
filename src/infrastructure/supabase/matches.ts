import { supabase, QuinielaMatch, QuinielaTeam } from './client';

export async function getGroupMatches(groupId?: string): Promise<QuinielaMatch[]> {
  let query = supabase
    .from('quiniela_matches')
    .select(`
      *,
      team_home:quiniela_teams!quiniela_matches_team_home_id_fkey(*),
      team_away:quiniela_teams!quiniela_matches_team_away_id_fkey(*)
    `)
    .eq('phase', 'GROUP')
    .order('match_date');

  if (groupId) {
    query = query.eq('group_id', groupId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as QuinielaMatch[];
}

export async function getKnockoutMatches(): Promise<QuinielaMatch[]> {
  const { data, error } = await supabase
    .from('quiniela_matches')
    .select(`
      *,
      team_home:quiniela_teams!quiniela_matches_team_home_id_fkey(*),
      team_away:quiniela_teams!quiniela_matches_team_away_id_fkey(*)
    `)
    .in('phase', ['R32', 'R16', 'QF', 'SF', 'TPP', 'FINAL'])
    .order('match_number');

  if (error) throw error;
  return (data ?? []) as QuinielaMatch[];
}

export async function getAllMatches(): Promise<QuinielaMatch[]> {
  const { data, error } = await supabase
    .from('quiniela_matches')
    .select(`
      *,
      team_home:quiniela_teams!quiniela_matches_team_home_id_fkey(*),
      team_away:quiniela_teams!quiniela_matches_team_away_id_fkey(*)
    `)
    .order('match_number');

  if (error) throw error;
  return (data ?? []) as QuinielaMatch[];
}

export async function getUpcomingMatches(limit = 5): Promise<QuinielaMatch[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('quiniela_matches')
    .select(`
      *,
      team_home:quiniela_teams!quiniela_matches_team_home_id_fkey(*),
      team_away:quiniela_teams!quiniela_matches_team_away_id_fkey(*)
    `)
    .gte('match_date', now)
    .in('status', ['SCHEDULED', 'OPEN'])
    .not('team_home_id', 'is', null)
    .order('match_date')
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as QuinielaMatch[];
}

export async function getRecentResults(limit = 5): Promise<QuinielaMatch[]> {
  const { data, error } = await supabase
    .from('quiniela_matches')
    .select(`
      *,
      team_home:quiniela_teams!quiniela_matches_team_home_id_fkey(*),
      team_away:quiniela_teams!quiniela_matches_team_away_id_fkey(*)
    `)
    .eq('status', 'FINISHED')
    .not('real_home', 'is', null)
    .order('match_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as QuinielaMatch[];
}

export async function updateMatchResult(
  matchId: number,
  realHome: number,
  realAway: number
): Promise<void> {
  const { error } = await supabase
    .from('quiniela_matches')
    .update({ real_home: realHome, real_away: realAway, status: 'FINISHED' })
    .eq('id', matchId);
  if (error) throw error;
}

export async function unlockKnockoutMatch(
  matchId: number,
  teamHomeId: string,
  teamAwayId: string
): Promise<void> {
  const { error } = await supabase
    .from('quiniela_matches')
    .update({ team_home_id: teamHomeId, team_away_id: teamAwayId, status: 'OPEN' })
    .eq('id', matchId);
  if (error) throw error;
}

export async function getGroupStandings(groupId: string): Promise<GroupStanding[]> {
  // Get all finished group matches for this group
  const { data: matches, error } = await supabase
    .from('quiniela_matches')
    .select(`
      *,
      team_home:quiniela_teams!quiniela_matches_team_home_id_fkey(*),
      team_away:quiniela_teams!quiniela_matches_team_away_id_fkey(*)
    `)
    .eq('phase', 'GROUP')
    .eq('group_id', groupId);

  if (error) throw error;

  // Get teams in this group
  const { data: teams, error: teamsError } = await supabase
    .from('quiniela_teams')
    .select('*')
    .eq('group_id', groupId);

  if (teamsError) throw teamsError;

  return computeGroupStandings(teams ?? [], (matches ?? []) as QuinielaMatch[]);
}

export interface GroupStanding {
  team: QuinielaTeam;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

function computeGroupStandings(teams: QuinielaTeam[], matches: QuinielaMatch[]): GroupStanding[] {
  const standings: Record<string, GroupStanding> = {};

  for (const team of teams) {
    standings[team.id] = { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 };
  }

  for (const match of matches) {
    if (match.real_home === null || match.real_away === null) continue;
    if (!match.team_home_id || !match.team_away_id) continue;

    const home = standings[match.team_home_id];
    const away = standings[match.team_away_id];
    if (!home || !away) continue;

    home.played++;
    away.played++;
    home.gf += match.real_home;
    home.ga += match.real_away;
    away.gf += match.real_away;
    away.ga += match.real_home;

    if (match.real_home > match.real_away) {
      home.won++; home.points += 3;
      away.lost++;
    } else if (match.real_home < match.real_away) {
      away.won++; away.points += 3;
      home.lost++;
    } else {
      home.drawn++; home.points++;
      away.drawn++; away.points++;
    }
  }

  return Object.values(standings)
    .map(s => ({ ...s, gd: s.gf - s.ga }))
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
}

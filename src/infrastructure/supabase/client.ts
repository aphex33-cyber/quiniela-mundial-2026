import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for all quiniela tables
export type Phase = 'GROUP' | 'R32' | 'R16' | 'QF' | 'SF' | 'TPP' | 'FINAL';
export type MatchStatus = 'SCHEDULED' | 'LOCKED' | 'OPEN' | 'FINISHED';

export interface QuinielaTeam {
  id: string;
  name: string;
  flag_emoji: string;
  group_id: string;
}

export interface QuinielaGroup {
  id: string;
  name: string;
}

export interface QuinielaMatch {
  id: number;
  match_number: number;
  phase: Phase;
  group_id: string | null;
  team_home_id: string | null;
  team_away_id: string | null;
  match_date: string | null;
  venue: string | null;
  status: MatchStatus;
  real_home: number | null;
  real_away: number | null;
  slot_home_desc: string | null;
  slot_away_desc: string | null;
  // Joined
  team_home?: QuinielaTeam;
  team_away?: QuinielaTeam;
}

export interface QuinielaPlayer {
  id: string;
  name: string;
  avatar: string;
  created_at: string;
}

export interface QuinielaPrediction {
  id: string;
  player_id: string;
  match_id: number;
  pred_home: number;
  pred_away: number;
  created_at: string;
  updated_at: string;
}

export interface MatchPoints {
  player_id: string;
  player_name: string;
  avatar: string;
  match_id: number;
  match_number: number;
  phase: Phase;
  group_id: string | null;
  team_home: string;
  flag_home: string;
  team_away: string;
  flag_away: string;
  real_home: number | null;
  real_away: number | null;
  pred_home: number;
  pred_away: number;
  points: number | null;
}

export interface LeaderboardEntry {
  player_id: string;
  player_name: string;
  avatar: string;
  total_points: number;
  exact_scores: number;
  correct_results: number;
  wrong_predictions: number;
}

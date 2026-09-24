import type { Game } from './game'

export type PlayStatus = 'want_to_play' | 'playing' | 'completed'

export interface LibraryEntry {
  id: string
  user_id: string
  game_id: string
  status: PlayStatus
  rating: number | null
  created_at: string
  updated_at: string
  game?: Game
}

export interface AddLibraryEntryRequest {
  game_id: string
}

export interface UpdateLibraryEntryRequest {
  status?: PlayStatus
  rating?: number | null
}

export interface UserStats {
  total_games: number
  want_to_play_count: number
  playing_count: number
  completed_count: number
  average_rating: number | null
}

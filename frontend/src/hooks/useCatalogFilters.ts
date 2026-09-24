import { useState } from 'react'
import type { GameFilterParams } from '@/types'

export const AVAILABLE_GENRES = [
  'All',
  'RPG',
  'Action',
  'Adventure',
  'Shooter',
  'MMORPG',
  'Strategy',
  'Battle Royale',
  'MOBA',
  'Fighting',
  'Card Game',
  'Sports',
  'Racing',
  'Roguelike',
  'Metroidvania',
  'Indie',
  'Simulation',
] as const

export const AVAILABLE_PLATFORMS = [
  'All',
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Web Browser',
] as const

export function useCatalogFilters() {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState<string>('All')
  const [platform, setPlatform] = useState<string>('All')

  const queryParams: GameFilterParams = {
    search: search.trim() || undefined,
    genre: genre !== 'All' ? genre : undefined,
    platform: platform !== 'All' ? platform : undefined,
  }

  const clearFilters = () => {
    setSearch('')
    setGenre('All')
    setPlatform('All')
  }

  const hasActiveFilters = search.trim() !== '' || genre !== 'All' || platform !== 'All'

  return {
    search,
    setSearch,
    genre,
    setGenre,
    platform,
    setPlatform,
    clearFilters,
    hasActiveFilters,
    queryParams,
    genres: AVAILABLE_GENRES,
    platforms: AVAILABLE_PLATFORMS,
  }
}

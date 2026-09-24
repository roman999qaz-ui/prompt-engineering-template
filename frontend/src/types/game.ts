export interface Game {
  id: string
  title: string
  description: string
  cover_image: string
  genres: string[]
  platforms: string[]
  release_year: number
  developer: string
}

export interface GameFilterParams {
  search?: string
  genre?: string
  platform?: string
}

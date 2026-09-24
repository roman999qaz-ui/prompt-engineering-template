import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/lib/config'
import type { Game, GameFilterParams } from '@/types'

export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Game'],
  endpoints: (builder) => ({
    getGames: builder.query<Game[], GameFilterParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params?.search) queryParams.set('search', params.search)
        if (params?.genre) queryParams.set('genre', params.genre)
        if (params?.platform) queryParams.set('platform', params.platform)
        const qs = queryParams.toString()
        return qs ? `/games?${qs}` : '/games'
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Game' as const, id })),
              { type: 'Game', id: 'LIST' },
            ]
          : [{ type: 'Game', id: 'LIST' }],
    }),
    getGame: builder.query<Game, string>({
      query: (id) => `/games/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Game', id }],
    }),
  }),
})

export const { useGetGamesQuery, useGetGameQuery } = gamesApi

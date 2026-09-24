import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/lib/config'
import type {
  AddLibraryEntryRequest,
  LibraryEntry,
  PlayStatus,
  UpdateLibraryEntryRequest,
  UserStats,
} from '@/types'

export const libraryApi = createApi({
  reducerPath: 'libraryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('gamelibrary_token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Library', 'Stats'],
  endpoints: (builder) => ({
    getLibrary: builder.query<LibraryEntry[], PlayStatus | void>({
      query: (status) => (status ? `/library?status=${status}` : '/library'),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Library' as const, id })),
              { type: 'Library', id: 'LIST' },
            ]
          : [{ type: 'Library', id: 'LIST' }],
    }),
    addToLibrary: builder.mutation<LibraryEntry, AddLibraryEntryRequest>({
      query: (body) => ({
        url: '/library',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Library', 'Stats'],
    }),
    updateLibraryEntry: builder.mutation<
      LibraryEntry,
      { id: string; body: UpdateLibraryEntryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/library/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Library', id },
        'Library',
        'Stats',
      ],
    }),
    removeFromLibrary: builder.mutation<void, string>({
      query: (id) => ({
        url: `/library/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Library', 'Stats'],
    }),
    getUserStats: builder.query<UserStats, void>({
      query: () => '/users/me/stats',
      providesTags: ['Stats'],
    }),
  }),
})

export const {
  useGetLibraryQuery,
  useAddToLibraryMutation,
  useUpdateLibraryEntryMutation,
  useRemoveFromLibraryMutation,
  useGetUserStatsQuery,
} = libraryApi

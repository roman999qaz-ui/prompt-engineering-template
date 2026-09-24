import {
  useAddToLibraryMutation,
  useGetLibraryQuery,
  useGetUserStatsQuery,
  useRemoveFromLibraryMutation,
  useUpdateLibraryEntryMutation,
} from '@/store/api/libraryApi'
import { useAuth } from '@/hooks/useAuth'
import type { PlayStatus, UpdateLibraryEntryRequest } from '@/types'

export function useLibrary(statusFilter?: PlayStatus) {
  const { isAuthenticated, openLoginModal } = useAuth()

  const {
    data: entries = [],
    isLoading: isLibraryLoading,
    refetch: refetchLibrary,
  } = useGetLibraryQuery(statusFilter, { skip: !isAuthenticated })

  const { data: stats, isLoading: isStatsLoading } = useGetUserStatsQuery(
    undefined,
    { skip: !isAuthenticated }
  )

  const [addMutation, { isLoading: isAdding }] = useAddToLibraryMutation()
  const [updateMutation, { isLoading: isUpdating }] =
    useUpdateLibraryEntryMutation()
  const [removeMutation, { isLoading: isRemoving }] =
    useRemoveFromLibraryMutation()

  const addToLibrary = async (gameId: string) => {
    if (!isAuthenticated) {
      openLoginModal()
      return
    }
    return await addMutation({ game_id: gameId }).unwrap()
  }

  const updateEntry = async (id: string, body: UpdateLibraryEntryRequest) => {
    return await updateMutation({ id, body }).unwrap()
  }

  const removeEntry = async (id: string) => {
    return await removeMutation(id).unwrap()
  }

  const isInLibrary = (gameId: string): boolean => {
    return entries.some((e) => e.game_id === gameId)
  }

  const getEntryForGame = (gameId: string) => {
    return entries.find((e) => e.game_id === gameId)
  }

  return {
    entries,
    stats,
    isLoading: isLibraryLoading || isStatsLoading,
    isMutating: isAdding || isUpdating || isRemoving,
    addToLibrary,
    updateEntry,
    removeEntry,
    isInLibrary,
    getEntryForGame,
    refetchLibrary,
  }
}

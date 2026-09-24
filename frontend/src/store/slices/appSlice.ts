import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LibraryEntry, PlayStatus } from '@/types'

export type AppView = 'catalog' | 'details' | 'library' | 'profile'
export type LibraryFilter = 'all' | PlayStatus

interface AppState {
  currentView: AppView
  selectedGameId: string | null
  libraryFilter: LibraryFilter
  isStatusDialogOpen: boolean
  statusDialogEntry: LibraryEntry | null
}

const initialState: AppState = {
  currentView: 'catalog',
  selectedGameId: null,
  libraryFilter: 'all',
  isStatusDialogOpen: false,
  statusDialogEntry: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentView(state, action: PayloadAction<AppView>) {
      state.currentView = action.payload
      if (action.payload !== 'details') {
        state.selectedGameId = null
      }
    },
    openGameDetails(state, action: PayloadAction<string>) {
      state.selectedGameId = action.payload
      state.currentView = 'details'
    },
    setLibraryFilter(state, action: PayloadAction<LibraryFilter>) {
      state.libraryFilter = action.payload
    },
    openStatusDialog(state, action: PayloadAction<LibraryEntry>) {
      state.isStatusDialogOpen = true
      state.statusDialogEntry = action.payload
    },
    closeStatusDialog(state) {
      state.isStatusDialogOpen = false
      state.statusDialogEntry = null
    },
  },
})

export const {
  setCurrentView,
  openGameDetails,
  setLibraryFilter,
  openStatusDialog,
  closeStatusDialog,
} = appSlice.actions

export default appSlice.reducer

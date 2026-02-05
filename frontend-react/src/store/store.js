import { configureStore } from '@reduxjs/toolkit'
import { bookingsReducer } from './slices/bookingsSlice.js'
import { uiReducer } from './slices/uiSlice.js'
import { videosReducer } from './slices/videosSlice.js'

export const store = configureStore({
  reducer: {
    bookings: bookingsReducer,
    ui: uiReducer,
    videos: videosReducer,
  },
})

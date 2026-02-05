import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  loadingMessage: '',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showLoading(state, action) {
      state.loading = true
      state.loadingMessage = action.payload?.message || 'Loading...'
    },
    hideLoading(state) {
      state.loading = false
      state.loadingMessage = ''
    },
  },
})

export const { showLoading, hideLoading } = uiSlice.actions
export const uiReducer = uiSlice.reducer

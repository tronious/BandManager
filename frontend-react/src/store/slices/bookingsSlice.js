import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_KEY = import.meta.env.VITE_API_KEY

export const submitBooking = createAsyncThunk(
  'bookings/submitBooking',
  async (form, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to send inquiry'
        try {
          const errorData = await response.json()
          errorMessage = errorData?.error || errorMessage
        } catch {
          // ignore
        }
        return rejectWithValue(errorMessage)
      }

      return await response.json()
    } catch (err) {
      return rejectWithValue(err?.message || 'Something went wrong. Please try again.')
    }
  },
)

const initialState = {
  status: 'idle',
  error: null,
  success: false,
}

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBookingStatus(state) {
      state.status = 'idle'
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBooking.pending, (state) => {
        state.status = 'pending'
        state.error = null
        state.success = false
      })
      .addCase(submitBooking.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
        state.success = true
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Something went wrong. Please try again.'
        state.success = false
      })
  },
})

export const { clearBookingStatus } = bookingsSlice.actions
export const bookingsReducer = bookingsSlice.reducer

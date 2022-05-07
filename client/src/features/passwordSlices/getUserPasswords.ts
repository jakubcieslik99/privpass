import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const getUserPasswords = createAsyncThunk('passwords/getUserPasswords', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/passwords/getUserPasswords`)
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export { getUserPasswords }

interface getUserPasswordsState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  message: unknown | string | null
  passwords:
    | [
        {
          _id: string
          name: string
          password: string
        }
      ]
    | []
}

export const getUserPasswordsSlice = createSlice({
  name: 'getUserPasswords',
  initialState: {
    loading: 'idle',
    message: null,
    passwords: [],
  } as getUserPasswordsState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUserPasswords.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(getUserPasswords.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.passwords = action.payload.passwords
    })
    builder.addCase(getUserPasswords.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })
  },
})

export default getUserPasswordsSlice.reducer

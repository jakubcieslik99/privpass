import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface getUserPasswordData {
  id: string
}

const getUserPassword = createAsyncThunk('passwords/getUserPassword', async (sendData: getUserPasswordData, thunkAPI) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/passwords/getUserPassword/${sendData.id}`)
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export { getUserPassword }

interface getUserPasswordState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  message: unknown | string | null
  id: string | null
  password: string | null
}

export const getUserPasswordSlice = createSlice({
  name: 'getUserPassword',
  initialState: {
    loading: 'idle',
    message: null,
    id: null,
    password: null,
  } as getUserPasswordState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUserPassword.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(getUserPassword.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.id = action.payload.id
      state.password = action.payload.password
    })
    builder.addCase(getUserPassword.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })
  },
})

export default getUserPasswordSlice.reducer

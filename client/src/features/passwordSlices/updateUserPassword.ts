import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface updateUserPasswordData {
  id: string
  name: string
  password: string
}

const updateUserPassword = createAsyncThunk(
  'users/updateUserPassword',
  async (sendData: updateUserPasswordData, thunkAPI) => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/users/updateUserPassword/${sendData.id}`, {
        name: sendData.name,
        password: sendData.password,
      })
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export { updateUserPassword }

interface updateUserPasswordState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  message: unknown | string | null
  name: string | null
}

export const updateUserPasswordSlice = createSlice({
  name: 'updateUserPassword',
  initialState: {
    loading: 'idle',
    message: null,
    name: null,
  } as updateUserPasswordState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(updateUserPassword.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(updateUserPassword.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.message = action.payload.message
      state.name = action.payload.name
    })
    builder.addCase(updateUserPassword.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })
  },
})

export default updateUserPasswordSlice.reducer

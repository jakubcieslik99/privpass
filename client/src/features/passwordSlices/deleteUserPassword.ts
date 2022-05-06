import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface deleteUserPasswordData {
  id: string
}

const deleteUserPassword = createAsyncThunk(
  'users/deleteUserPassword',
  async (sendData: deleteUserPasswordData, thunkAPI) => {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/users/deleteUserPassword/${sendData.id}`)
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export { deleteUserPassword }

interface deleteUserPasswordState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  message: unknown | string | null
}

export const deleteUserPasswordSlice = createSlice({
  name: 'deleteUserPassword',
  initialState: {
    loading: 'idle',
    message: null,
  } as deleteUserPasswordState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(deleteUserPassword.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(deleteUserPassword.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.message = action.payload.message
    })
    builder.addCase(deleteUserPassword.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })
  },
})

export default deleteUserPasswordSlice.reducer

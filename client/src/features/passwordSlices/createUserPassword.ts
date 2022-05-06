import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface createUserPasswordData {
  name: string
  password: string
}

const createUserPassword = createAsyncThunk(
  'users/createUserPassword',
  async (sendData: createUserPasswordData, thunkAPI) => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/createUserPassword`, {
        name: sendData.name,
        password: sendData.password,
      })
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export { createUserPassword }

interface createUserPasswordState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  message: unknown | string | null
  name: string | null
}

export const createUserPasswordSlice = createSlice({
  name: 'createUserPassword',
  initialState: {
    loading: 'idle',
    message: null,
    name: null,
  } as createUserPasswordState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createUserPassword.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(createUserPassword.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.message = action.payload.message
      state.name = action.payload.name
    })
    builder.addCase(createUserPassword.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })
  },
})

export default createUserPasswordSlice.reducer

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

interface getUserPasswordData {
  id: string
}

const getUserPassword = createAsyncThunk('passwords/getUserPassword', async (sendData: getUserPasswordData, thunkAPI) => {
  try {
    const { listUser } = thunkAPI.getState() as RootState

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/passwords/getUserPassword/${sendData.id}`, {
      headers: {
        Authorization: 'Bearer ' + listUser?.userInfo?.accessToken,
      },
    })
    return data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export { getUserPassword }

interface getUserPasswordState {
  loading: boolean
  error: boolean
  errorMessage: string
  id: string
  password: string
}

export const getUserPasswordSlice = createSlice({
  name: 'passwords',
  initialState: {
    loading: false,
    error: false,
    errorMessage: '',
    id: '',
    password: '',
  } as getUserPasswordState,
  reducers: {
    idPasswordReset: state => {
      state.id = ''
      state.password = ''
    },
  },
  extraReducers: builder => {
    builder.addCase(getUserPassword.pending, state => {
      state.loading = true
      state.error = false
    })
    builder.addCase(getUserPassword.fulfilled, (state, action) => {
      state.loading = false
      state.id = action.payload._id
      state.password = action.payload.password
    })
    builder.addCase(getUserPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.errorMessage = action.payload
    })
  },
})

export const { idPasswordReset } = getUserPasswordSlice.actions
export default getUserPasswordSlice.reducer

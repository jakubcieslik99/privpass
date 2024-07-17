import { createAsyncThunk, Slice, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axiosProtected from '../../api/axiosProtected'

interface getUserPasswordData {
  id: string
}

const getUserPassword = createAsyncThunk('passwords/getUserPassword', async (sendData: getUserPasswordData, thunkAPI) => {
  try {
    const { data } = await axiosProtected.get(`/passwords/getUserPassword/${sendData.id}`)
    return data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const getUserPasswordSlice: Slice<getUserPasswordState> = createSlice({
  name: 'passwords/getUserPassword',
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder.addCase(getUserPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      if (action.payload) {
        state.error = true
        state.errorMessage = action.payload
      }
    })
  },
})

export const { idPasswordReset } = getUserPasswordSlice.actions
export const getUserPasswordReducer = getUserPasswordSlice.reducer

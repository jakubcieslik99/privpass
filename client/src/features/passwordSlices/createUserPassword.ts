import { createAsyncThunk, Slice, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axiosProtected from '../../api/axiosProtected'

interface createUserPasswordData {
  name: string
  password: string
}

const createUserPassword = createAsyncThunk(
  'passwords/createUserPassword',
  async (sendData: createUserPasswordData, thunkAPI) => {
    try {
      const { data } = await axiosProtected.post('/passwords/createUserPassword', {
        name: sendData.name,
        password: sendData.password,
      })
      return data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  },
)

export { createUserPassword }

interface createUserPasswordState {
  loading: boolean
  success: boolean
  successMessage: string
  error: boolean
  errorMessage: string
}

export const createUserPasswordSlice: Slice<createUserPasswordState> = createSlice({
  name: 'passwords/createUserPassword',
  initialState: {
    loading: false,
    success: false,
    successMessage: '',
    error: false,
    errorMessage: '',
  } as createUserPasswordState,
  reducers: {
    successReset: state => {
      state.success = false
    },
    errorReset: state => {
      state.error = false
    },
  },
  extraReducers: builder => {
    builder.addCase(createUserPassword.pending, state => {
      state.loading = true
      state.success = false
      state.error = false
    })
    builder.addCase(createUserPassword.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.successMessage = action.payload.message
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder.addCase(createUserPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      if (action.payload) {
        state.error = true
        state.errorMessage = action.payload
      }
    })
  },
})

export const { successReset, errorReset } = createUserPasswordSlice.actions
export const createUserPasswordReducer = createUserPasswordSlice.reducer

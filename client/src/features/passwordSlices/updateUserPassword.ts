import { createAsyncThunk, Slice, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axiosProtected from '../../api/axiosProtected'

interface updateUserPasswordData {
  id: string
  name: string
  password: string
}

const updateUserPassword = createAsyncThunk(
  'passwords/updateUserPassword',
  async (sendData: updateUserPasswordData, thunkAPI) => {
    try {
      const { data } = await axiosProtected.put(`/passwords/updateUserPassword/${sendData.id}`, {
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

export { updateUserPassword }

interface updateUserPasswordState {
  loading: boolean
  success: boolean
  successMessage: string
  error: boolean
  errorMessage: string
}

export const updateUserPasswordSlice: Slice<updateUserPasswordState> = createSlice({
  name: 'passwords/updateUserPassword',
  initialState: {
    loading: false,
    success: false,
    successMessage: '',
    error: false,
    errorMessage: '',
  } as updateUserPasswordState,
  reducers: {
    successReset: state => {
      state.success = false
    },
    errorReset: state => {
      state.error = false
    },
  },
  extraReducers: builder => {
    builder.addCase(updateUserPassword.pending, state => {
      state.loading = true
      state.success = false
      state.error = false
    })
    builder.addCase(updateUserPassword.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.successMessage = action.payload.message
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder.addCase(updateUserPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      if (action.payload) {
        state.error = true
        state.errorMessage = action.payload
      }
    })
  },
})

export const { successReset, errorReset } = updateUserPasswordSlice.actions
export const updateUserPasswordReducer = updateUserPasswordSlice.reducer

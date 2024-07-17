import { createAsyncThunk, Slice, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axiosProtected from '../../api/axiosProtected'

interface deleteUserPasswordData {
  id: string
}

const deleteUserPassword = createAsyncThunk(
  'passwords/deleteUserPassword',
  async (sendData: deleteUserPasswordData, thunkAPI) => {
    try {
      const { data } = await axiosProtected.delete(
        `${import.meta.env.VITE_API_URL}/passwords/deleteUserPassword/${sendData.id}`,
      )
      return data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  },
)

export { deleteUserPassword }

interface deleteUserPasswordState {
  loading: boolean
  success: boolean
  successMessage: string
  error: boolean
  errorMessage: string
}

export const deleteUserPasswordSlice: Slice<deleteUserPasswordState> = createSlice({
  name: 'passwords/deleteUserPassword',
  initialState: {
    loading: false,
    success: false,
    successMessage: '',
    error: false,
    errorMessage: '',
  } as deleteUserPasswordState,
  reducers: {
    successReset: state => {
      state.success = false
    },
    errorReset: state => {
      state.error = false
    },
  },
  extraReducers: builder => {
    builder.addCase(deleteUserPassword.pending, state => {
      state.loading = true
      state.success = false
      state.error = false
    })
    builder.addCase(deleteUserPassword.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.successMessage = action.payload.message
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder.addCase(deleteUserPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      if (action.payload) {
        state.error = true
        state.errorMessage = action.payload
      }
    })
  },
})

export const { successReset, errorReset } = deleteUserPasswordSlice.actions
export const deleteUserPasswordReducer = deleteUserPasswordSlice.reducer

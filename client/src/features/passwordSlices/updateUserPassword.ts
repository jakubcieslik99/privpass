import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
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
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export { updateUserPassword }

interface updateUserPasswordState {
  loading: boolean
  success: boolean
  successMessage: string
  error: boolean
  errorMessage: string
}

export const updateUserPasswordSlice = createSlice({
  name: 'passwords',
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
    builder.addCase(updateUserPassword.pending, (state, _action) => {
      state.loading = true
      state.success = false
      state.error = false
    })
    builder.addCase(updateUserPassword.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.successMessage = action.payload.message
    })
    builder.addCase(updateUserPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.errorMessage = action.payload
    })
  },
})

export const { successReset, errorReset } = updateUserPasswordSlice.actions
export default updateUserPasswordSlice.reducer

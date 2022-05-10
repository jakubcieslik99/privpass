import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

interface deleteUserPasswordData {
  id: string
}

const deleteUserPassword = createAsyncThunk(
  'passwords/deleteUserPassword',
  async (sendData: deleteUserPasswordData, thunkAPI) => {
    try {
      const { listUser } = thunkAPI.getState() as RootState

      const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/passwords/deleteUserPassword/${sendData.id}`, {
        headers: {
          Authorization: 'Bearer ' + listUser?.userInfo?.accessToken,
        },
      })
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  }
)

export { deleteUserPassword }

interface deleteUserPasswordState {
  loading: boolean
  success: boolean
  successMessage: string
  error: boolean
  errorMessage: string
}

export const deleteUserPasswordSlice = createSlice({
  name: 'passwords',
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
    builder.addCase(deleteUserPassword.pending, (state, _action) => {
      state.loading = true
      state.success = false
      state.error = false
    })
    builder.addCase(deleteUserPassword.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.successMessage = action.payload.message
    })
    builder.addCase(deleteUserPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.errorMessage = action.payload
    })
  },
})

export const { successReset, errorReset } = deleteUserPasswordSlice.actions
export default deleteUserPasswordSlice.reducer

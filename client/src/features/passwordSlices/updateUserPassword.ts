import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

interface updateUserPasswordData {
  id: string
  name: string
  password: string
}

const updateUserPassword = createAsyncThunk(
  'passwords/updateUserPassword',
  async (sendData: updateUserPasswordData, thunkAPI) => {
    try {
      const { listUser } = thunkAPI.getState() as RootState

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/passwords/updateUserPassword/${sendData.id}`,
        {
          name: sendData.name,
          password: sendData.password,
        },
        {
          headers: {
            Authorization: 'Bearer ' + listUser?.userInfo?.accessToken,
          },
        }
      )
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
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

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

interface createUserPasswordData {
  name: string
  password: string
}

const createUserPassword = createAsyncThunk(
  'passwords/createUserPassword',
  async (sendData: createUserPasswordData, thunkAPI) => {
    try {
      const { listUser } = thunkAPI.getState() as RootState

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/passwords/createUserPassword`,
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
      const message = error?.response?.data?.message || error?.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export { createUserPassword }

interface createUserPasswordState {
  loading: boolean
  success: boolean
  successMessage: string
  error: boolean
  errorMessage: string
}

export const createUserPasswordSlice = createSlice({
  name: 'passwords',
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
    builder.addCase(createUserPassword.pending, (state, _action) => {
      state.loading = true
      state.success = false
      state.error = false
    })
    builder.addCase(createUserPassword.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.successMessage = action.payload.message
    })
    builder.addCase(createUserPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.errorMessage = action.payload
    })
  },
})

export const { successReset, errorReset } = createUserPasswordSlice.actions
export default createUserPasswordSlice.reducer

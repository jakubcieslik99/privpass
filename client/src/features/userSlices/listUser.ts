import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axiosPublic from '../../api/axiosPublic'

interface registerSendCodeData {
  email: string
}
interface loginSendCodeData {
  email: string
}
interface confirmCodeData {
  code: string
  email: string
}

const registerSendCode = createAsyncThunk('listUser/registerSendCode', async (sendData: registerSendCodeData, thunkAPI) => {
  try {
    const { data } = await axiosPublic.post(`/users/registerSendCode`, {
      email: sendData.email,
    })
    return data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
const loginSendCode = createAsyncThunk('listUser/loginSendCode', async (sendData: loginSendCodeData, thunkAPI) => {
  try {
    const { data } = await axiosPublic.post(`/users/loginSendCode`, {
      email: sendData.email,
    })
    return data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
const confirmCode = createAsyncThunk('listUser/confirmCode', async (sendData: confirmCodeData, thunkAPI) => {
  try {
    const { data } = await axiosPublic.post(
      `/users/confirmCode`,
      {
        code: sendData.code,
        email: sendData.email,
      },
      { withCredentials: true }
    )

    data?.userInfo && localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
    data?.accessToken && localStorage.setItem('accessToken', JSON.stringify(data.accessToken))

    return data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

const logoutUser = createAsyncThunk('listUser/logoutUser', async (_, thunkAPI) => {
  try {
    const { data } = await axiosPublic.get(`/users/logoutUser`, { withCredentials: true })
    return data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export { registerSendCode, loginSendCode, confirmCode, logoutUser }

interface listUserState {
  loading: boolean
  success: boolean
  successMessage: string
  error: boolean
  errorMessage: string
  userInfo: {
    id: string
    email: string
  } | null
}

const userInfo = localStorage.getItem('userInfo')

export const listUserSlice = createSlice({
  name: 'listUser',
  initialState: {
    loading: false,
    success: false,
    successMessage: '',
    error: false,
    errorMessage: '',
    userInfo: userInfo ? JSON.parse(userInfo) : null,
  } as listUserState,
  reducers: {
    successReset: state => {
      state.success = false
    },
    errorReset: state => {
      state.error = false
    },
    messageReset: state => {
      state.successMessage = ''
      state.errorMessage = ''
    },
    userInfoReset: state => {
      state.userInfo = null
      localStorage.removeItem('userInfo')
      localStorage.removeItem('accessToken')
    },
  },
  extraReducers: builder => {
    //registerSendCode
    builder.addCase(registerSendCode.pending, state => {
      state.loading = true
    })
    builder.addCase(registerSendCode.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.successMessage = action.payload.message
    })
    builder.addCase(registerSendCode.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.errorMessage = action.payload
    })
    //loginSendCode
    builder.addCase(loginSendCode.pending, state => {
      state.loading = true
    })
    builder.addCase(loginSendCode.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.successMessage = action.payload.message
    })
    builder.addCase(loginSendCode.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.errorMessage = action.payload
    })
    //confirmCode
    builder.addCase(confirmCode.pending, state => {
      state.loading = true
      state.success = false
      state.error = false
    })
    builder.addCase(confirmCode.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.successMessage = action.payload.message
      state.userInfo = action.payload.userInfo
    })
    builder.addCase(confirmCode.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.errorMessage = action.payload
      state.userInfo = null
    })
    //logoutUser
    builder.addCase(logoutUser.pending, state => {
      state.loading = true
      state.success = false
      state.error = false
    })
    builder.addCase(logoutUser.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(logoutUser.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.errorMessage = action.payload
    })
  },
})

export const { successReset, errorReset, messageReset, userInfoReset } = listUserSlice.actions
export default listUserSlice.reducer

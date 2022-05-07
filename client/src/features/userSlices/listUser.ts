import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

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
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/registerSendCode`, {
      email: sendData.email,
    })
    return data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue({ message })
  }
})
const loginSendCode = createAsyncThunk('listUser/loginSendCode', async (sendData: loginSendCodeData, thunkAPI) => {
  try {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/loginSendCode`, {
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
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/confirmCode`, {
      code: sendData.code,
      email: sendData.email,
    })

    data?.userInfo && localStorage.setItem('userInfo', JSON.stringify(data.userInfo))

    return data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

const refreshAccessToken = createAsyncThunk('listUser/refreshAccessToken', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/refreshAccessToken`)

    data?.userInfo && localStorage.setItem('userInfo', JSON.stringify(data.userInfo))

    return data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
const logoutUser = createAsyncThunk('listUser/logoutUser', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/logoutUser`)
    return data
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export { registerSendCode, loginSendCode, confirmCode, refreshAccessToken, logoutUser }

interface listUserState {
  loading: boolean
  success: boolean
  successMessage: string
  error: boolean
  errorMessage: string

  message: string
  userInfo: {
    id: string
    email: string
    accessToken: string
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

    message: '',
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
      state.message = ''
    },
    userInfoReset: state => {
      state.userInfo = null
      localStorage.removeItem('userInfo')
    },
  },
  extraReducers: builder => {
    //registerSendCode
    builder.addCase(registerSendCode.pending, state => {
      state.loading = true
      //state.success = false
      //state.error = false
    })
    builder.addCase(registerSendCode.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.message = action.payload.message
    })
    builder.addCase(registerSendCode.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.message = action.payload.message
    })
    //loginSendCode
    builder.addCase(loginSendCode.pending, state => {
      state.loading = true
      //state.success = false
      //state.error = false
    })
    builder.addCase(loginSendCode.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.message = action.payload.message
    })
    builder.addCase(loginSendCode.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.message = action.payload.message
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
      state.message = action.payload.message
      state.userInfo = action.payload.userInfo
    })
    builder.addCase(confirmCode.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.message = action.payload
      state.userInfo = null
    })
    //refreshAccessToken
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.userInfo = action.payload.userInfo
    })
    builder.addCase(refreshAccessToken.rejected, (state, action: PayloadAction<any>) => {
      state.message = action.payload
    })
    //logoutUser
    builder.addCase(logoutUser.pending, state => {
      state.loading = true
      state.message = ''
    })
    builder.addCase(logoutUser.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(logoutUser.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.message = action.payload
    })
  },
})

export const { successReset, errorReset, messageReset, userInfoReset } = listUserSlice.actions
export default listUserSlice.reducer

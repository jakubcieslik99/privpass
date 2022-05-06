import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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

const registerSendCode = createAsyncThunk('users/registerSendCode', async (sendData: registerSendCodeData, thunkAPI) => {
  try {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/registerSendCode`, {
      email: sendData.email,
    })
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})
const loginSendCode = createAsyncThunk('users/loginSendCode', async (sendData: loginSendCodeData, thunkAPI) => {
  try {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/loginSendCode`, {
      email: sendData.email,
    })
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})
const confirmCode = createAsyncThunk('users/confirmCode', async (sendData: confirmCodeData, thunkAPI) => {
  try {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/confirmCode`, {
      code: sendData.code,
      email: sendData.email,
    })
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const refreshAccessToken = createAsyncThunk('users/refreshAccessToken', async (_sendData, thunkAPI) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/refreshAccessToken`)
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})
const logoutUser = createAsyncThunk('users/logoutUser', async (_sendData, thunkAPI) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/logoutUser`)
    return data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export { registerSendCode, loginSendCode, confirmCode, refreshAccessToken, logoutUser }

interface listUserState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  message: unknown | string | null
  accessToken: string | null
  userInfo: {
    id: string
    email: string
  } | null
}

export const listUserSlice = createSlice({
  name: 'listUser',
  initialState: {
    loading: 'idle',
    message: null,
    accessToken: null,
    userInfo: null,
  } as listUserState,
  reducers: {
    /*listUserReducer: (state, action) => {
      state.message = action.payload
    },*/
  },
  extraReducers: builder => {
    builder.addCase(registerSendCode.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(registerSendCode.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.message = action.payload.message
    })
    builder.addCase(registerSendCode.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })

    builder.addCase(loginSendCode.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(loginSendCode.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.message = action.payload.message
    })
    builder.addCase(loginSendCode.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })

    builder.addCase(confirmCode.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(confirmCode.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.message = action.payload.message
      state.accessToken = action.payload.accessToken
      state.userInfo = action.payload.userInfo
    })
    builder.addCase(confirmCode.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })

    builder.addCase(refreshAccessToken.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.accessToken = action.payload.accessToken
    })
    builder.addCase(refreshAccessToken.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })

    builder.addCase(logoutUser.pending, (state, _action) => {
      state.loading = 'pending'
      state.message = null
    })
    builder.addCase(logoutUser.fulfilled, (state, _action) => {
      state.loading = 'succeeded'
      state.accessToken = null
      state.userInfo = null
    })
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = 'failed'
      state.message = action.payload
    })
  },
})

export default listUserSlice.reducer

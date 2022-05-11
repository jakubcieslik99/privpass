import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'
import { ListedPasswordObject } from '../../components/profileScreen/ListedPassword'

interface getUserPasswordsData {
  searchKeyword: string
  sortOrder: string
}

const getUserPasswords = createAsyncThunk('passwords/getUserPasswords', async (sendData: getUserPasswordsData, thunkAPI) => {
  try {
    const { searchKeyword, sortOrder } = sendData
    const { listUser } = thunkAPI.getState() as RootState

    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/passwords/getUserPasswords?searchKeyword=${searchKeyword}&sortOrder=${sortOrder}`,
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
})

export { getUserPasswords }

interface getUserPasswordsState {
  loading: boolean
  error: boolean
  errorMessage: string
  passwords: [ListedPasswordObject] | []
}

export const getUserPasswordsSlice = createSlice({
  name: 'passwords',
  initialState: {
    loading: false,
    error: false,
    errorMessage: '',
    passwords: [],
  } as getUserPasswordsState,
  reducers: {
    passwordsReset: state => {
      state.passwords = []
    },
  },
  extraReducers: builder => {
    builder.addCase(getUserPasswords.pending, state => {
      state.loading = true
      state.error = false
    })
    builder.addCase(getUserPasswords.fulfilled, (state, action) => {
      state.loading = false
      state.passwords = action.payload.passwords
    })
    builder.addCase(getUserPasswords.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false
      state.error = true
      state.errorMessage = action.payload
    })
  },
})

export const { passwordsReset } = getUserPasswordsSlice.actions
export default getUserPasswordsSlice.reducer

import { createAsyncThunk, Slice, createSlice, PayloadAction } from '@reduxjs/toolkit'
//import { RootState } from '../store'
import axiosProtected from '../../api/axiosProtected'
import { ListedPasswordObject } from '../../components/profileScreen/ListedPassword'

interface getUserPasswordsData {
  searchKeyword: string
  sortOrder: string
}

const getUserPasswords = createAsyncThunk('passwords/getUserPasswords', async (sendData: getUserPasswordsData, thunkAPI) => {
  try {
    const { searchKeyword, sortOrder } = sendData
    //const { listUser } = thunkAPI.getState() as RootState

    const { data } = await axiosProtected.get(
      `/passwords/getUserPasswords?searchKeyword=${searchKeyword}&sortOrder=${sortOrder}`,
    )
    return data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export { getUserPasswords }

interface getUserPasswordsState {
  loading: boolean
  aborted: boolean
  error: boolean
  errorMessage: string
  passwords: [ListedPasswordObject] | []
}

export const getUserPasswordsSlice: Slice<getUserPasswordsState> = createSlice({
  name: 'passwords/getUserPasswords',
  initialState: {
    loading: false,
    aborted: false,
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
      state.aborted = false
      state.passwords = action.payload.passwords
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder.addCase(getUserPasswords.rejected, (state, action: PayloadAction<any>) => {
      if (action.payload) {
        state.loading = false
        state.error = true
        state.errorMessage = action.payload
      } else state.aborted = true
    })
  },
})

export const { passwordsReset } = getUserPasswordsSlice.actions
export const getUserPasswordsReducer = getUserPasswordsSlice.reducer

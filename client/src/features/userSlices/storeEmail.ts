import { Slice, createSlice } from '@reduxjs/toolkit'

interface storeEmailState {
  email: string
}

export const storeEmailSlice: Slice<storeEmailState> = createSlice({
  name: 'storeEmail',
  initialState: {
    email: '',
  } as storeEmailState,
  reducers: {
    emailSet: (state, action) => {
      state.email = action.payload
    },
    emailReset: state => {
      state.email = ''
    },
  },
})

export const { emailSet, emailReset } = storeEmailSlice.actions
export const storeEmailReducer = storeEmailSlice.reducer

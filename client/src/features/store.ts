import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import appSettingsReducer from './appSlices/appSettings'
import listUserReducer from './userSlices/listUser'
import storeEmailReducer from './userSlices/storeEmail'
import getUserPasswordsReducer from './passwordSlices/getUserPasswords'
import getUserPasswordReducer from './passwordSlices/getUserPassword'
import createUserPasswordReducer from './passwordSlices/createUserPassword'
import updateUserPasswordReducer from './passwordSlices/updateUserPassword'
import deleteUserPasswordReducer from './passwordSlices/deleteUserPassword'

const store = configureStore({
  reducer: {
    appSettings: appSettingsReducer,
    listUser: listUserReducer,
    storeEmail: storeEmailReducer,
    getUserPasswords: getUserPasswordsReducer,
    getUserPassword: getUserPasswordReducer,
    createUserPassword: createUserPasswordReducer,
    updateUserPassword: updateUserPasswordReducer,
    deleteUserPassword: deleteUserPasswordReducer,
  },
  devTools: process.env.REACT_APP_ENV === 'prod' ? false : true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store

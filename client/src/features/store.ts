import { Store, configureStore } from '@reduxjs/toolkit'
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import { appSettingsReducer } from './appSlices/appSettings'
import { listUserReducer } from './userSlices/listUser'
import { storeEmailReducer } from './userSlices/storeEmail'
import { getUserPasswordsReducer } from './passwordSlices/getUserPasswords'
import { getUserPasswordReducer } from './passwordSlices/getUserPassword'
import { createUserPasswordReducer } from './passwordSlices/createUserPassword'
import { updateUserPasswordReducer } from './passwordSlices/updateUserPassword'
import { deleteUserPasswordReducer } from './passwordSlices/deleteUserPassword'

const store: Store = configureStore({
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
  devTools: import.meta.env.VITE_APP_ENV === 'production' ? false : true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store

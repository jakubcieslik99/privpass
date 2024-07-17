import { Slice, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AvailableLanguages, availableLanguages } from '../../constants/AppSettings'

let language = localStorage.getItem('language')
if (!language || (language && !availableLanguages.includes(language))) {
  language = availableLanguages[0]
  localStorage.setItem('language', availableLanguages[0])
}

export interface AppSettingsState {
  language: AvailableLanguages
}

export const appSettingsSlice: Slice<AppSettingsState> = createSlice({
  name: 'appSettings',
  initialState: { language } as AppSettingsState,
  reducers: {
    changeLanguage: (state, action: PayloadAction<AvailableLanguages>) => {
      state.language = action.payload
      localStorage.setItem('language', action.payload)
    },
  },
})

export const { changeLanguage } = appSettingsSlice.actions
export const appSettingsReducer = appSettingsSlice.reducer

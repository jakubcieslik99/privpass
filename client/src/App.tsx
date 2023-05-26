import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppSelector } from './features/store'
import { tr } from './translations/translations'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import RequireAuth from './components/universal/RequireAuth'
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import NotFound from './components/universal/NotFound'
import ScrollTop from './components/universal/ScrollTop'

export interface LocationProps {
  pathname: string
  state: {
    from: string
    loginModalIsOpen?: boolean
  } | null
}

const App: React.FC = () => {
  const { language } = useAppSelector(state => state.appSettings)

  useEffect(() => {
    document.documentElement.lang = language
    document.title = tr('title', language)
  }, [language])

  return (
    <BrowserRouter>
      <Header />

      <ScrollTop />
      <Routes>
        <Route path="/" element={<HomeScreen />} />

        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App

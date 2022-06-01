import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import HomeScreen from './screens/HomeScreen'

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='*' element={<div className='screen'>404</div>} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { scroller } from 'react-scroll'
import { FaUserShield, FaBars, FaUser } from 'react-icons/fa'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

const Header: React.FC = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false)
  const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false)
  //temporary
  const [isLogged] = useState({
    status: false,
    email: 'dev@jakubcieslik.com',
  })

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const scrollToTopHandler = () => {
    menuIsOpen && setMenuIsOpen(false)
    scroller.scrollTo('hero-section', {
      spy: true,
      smooth: 'easeInOutCubic',
      duration: 500,
    })
  }

  const scrollToHandler = (to: string, offset: number) => {
    setMenuIsOpen(!menuIsOpen)
    scroller.scrollTo(to, {
      spy: true,
      smooth: 'easeInOutCubic',
      offset,
      duration: 500,
    })
  }

  const logoutHandler = () => {
    console.log('logout')
  }

  return (
    <header id="header" className="fixed top-0 z-10 w-full h-auto">
      <nav className="flex flex-col justify-between md:flex-row md:bg-percpass-500 md:shadow-lg">
        <div className="z-20 flex items-center justify-between h-16 md:h-24 bg-percpass-500">
          <Link
            to="/"
            className="flex items-center ml-3 text-2xl font-bold text-white md:text-3xl md:ml-7"
            onClick={scrollToTopHandler}
          >
            PercPASS <FaUserShield className="ml-2" />
          </Link>

          <button
            className="px-3 py-2 mr-3 text-xl transition border rounded-full md:hidden text-percpass-300 border-percpass-300 hover:text-white hover:border-white active:scale-95"
            onClick={() => setMenuIsOpen(!menuIsOpen)}
          >
            <FaBars />
          </button>
        </div>

        <ul className="flex-row items-center hidden md:flex mr-7">
          {isLogged.status ? (
            <>
              <li
                className={`flex items-center px-5 py-3 transition md:py-2 md:px-3 md:mr-1 text-percpass-300 ${
                  pathname !== '/profile' &&
                  'cursor-pointer hover:text-white hover:bg-percpass-400 md:hover:bg-transparent active:scale-95'
                }`}
                onClick={pathname !== '/profile' ? () => navigate('/profile') : undefined}
              >
                <FaUser className="mr-1" />
                {isLogged.email}
              </li>
              <li className="flex">
                <div
                  className="px-3 py-2 mx-4 mt-2 mb-4 transition border rounded-full cursor-pointer md:m-0 text-percpass-300 border-percpass-300 hover:text-white hover:border-white active:scale-95"
                  onClick={logoutHandler}
                >
                  Wyloguj
                </div>
              </li>
            </>
          ) : (
            <>
              <li
                className="px-5 py-3 transition cursor-pointer md:py-2 md:px-3 md:mr-1 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent active:scale-95"
                onClick={() => scrollToHandler('product-section', -96)}
              >
                Produkt
              </li>
              <li
                className="px-5 py-3 transition cursor-pointer md:py-2 md:px-3 md:mr-1 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent active:scale-95"
                onClick={() => scrollToHandler('contact-section', -96)}
              >
                Kontakt
              </li>
              <li
                className="px-5 py-3 transition cursor-pointer md:py-2 md:px-3 md:mr-2 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent active:scale-95"
                onClick={() => setRegisterModalIsOpen(true)}
              >
                Rejestracja
              </li>
              <li className="flex">
                <div
                  className="px-3 py-2 mx-4 mt-2 mb-4 transition border rounded-full cursor-pointer md:m-0 text-percpass-300 border-percpass-300 hover:text-white hover:border-white active:scale-95"
                  onClick={() => setLoginModalIsOpen(true)}
                >
                  Logowanie
                </div>
              </li>
            </>
          )}
        </ul>

        <ul
          className={`absolute w-full md:hidden flex flex-col transition-transform top-16 shadow-lg ${
            !menuIsOpen ? '-translate-y-full' : 'translate-y-0'
          } bg-percpass-500`}
        >
          {isLogged.status ? (
            <>
              <li
                className={`flex items-center px-5 py-3 transition-colors md:py-2 md:px-3 md:mr-2 text-percpass-300 ${
                  pathname !== '/profile' && 'cursor-pointer hover:text-white hover:bg-percpass-400 md:hover:bg-transparent'
                }`}
                onClick={pathname !== '/profile' ? () => navigate('/profile') : undefined}
              >
                <FaUser className="mr-1" />
                {isLogged.email}
              </li>
              <li className="flex">
                <div
                  className="px-3 py-2 mx-4 mt-2 mb-4 transition border rounded-full cursor-pointer md:m-0 text-percpass-300 border-percpass-300 hover:text-white hover:border-white active:scale-95"
                  onClick={logoutHandler}
                >
                  Wyloguj
                </div>
              </li>
            </>
          ) : (
            <>
              <li
                className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-1 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent"
                onClick={() => scrollToHandler('product-section', -64)}
              >
                Produkt
              </li>
              <li
                className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-1 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent"
                onClick={() => scrollToHandler('contact-section', -64)}
              >
                Kontakt
              </li>
              <li
                className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-2 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent"
                onClick={() => setRegisterModalIsOpen(true)}
              >
                Rejestracja
              </li>
              <li className="flex">
                <div
                  className="px-3 py-2 mx-4 mt-2 mb-4 transition border rounded-full cursor-pointer md:m-0 text-percpass-300 border-percpass-300 hover:text-white hover:border-white active:scale-95"
                  onClick={() => setLoginModalIsOpen(true)}
                >
                  Logowanie
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>

      <LoginModal isOpen={loginModalIsOpen} setIsOpen={setLoginModalIsOpen} />
      <RegisterModal isOpen={registerModalIsOpen} setIsOpen={setRegisterModalIsOpen} />
    </header>
  )
}

export default Header

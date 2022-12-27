import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { scroller } from 'react-scroll'
import { FaUserShield, FaBars, FaUser } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../features/store'
import { logoutUser, userInfoReset } from '../../features/userSlices/listUser'
import { passwordsReset } from '../../features/passwordSlices/getUserPasswords'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import { LocationProps } from '../../App'

const Header: React.FC = () => {
  //variables
  const { userInfo } = useAppSelector(state => state.listUser)
  const dispatch = useAppDispatch()

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false)
  const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false)

  const navigate = useNavigate()
  const { pathname, state } = useLocation() as LocationProps
  const locationLoginModalIsOpen = state?.loginModalIsOpen || false

  //handlers
  const scrollToTopHandler = () => {
    menuIsOpen && setMenuIsOpen(false)
    scroller.scrollTo('hero-section', {
      spy: true,
      smooth: 'easeInOutCubic',
      duration: 500,
    })
  }

  const scrollToHandler = (to: string, offset: number) => {
    menuIsOpen && setMenuIsOpen(false)
    scroller.scrollTo(to, {
      spy: true,
      smooth: 'easeInOutCubic',
      offset,
      duration: 500,
    })
  }

  const logoutHandler = () => {
    navigate('/', { replace: true })
    menuIsOpen && setMenuIsOpen(false)

    dispatch(passwordsReset())
    dispatch(userInfoReset())
    dispatch(logoutUser())
  }

  //useEffects
  useEffect(() => {
    if (locationLoginModalIsOpen) {
      setLoginModalIsOpen(true)
      navigate(pathname, { replace: true })
      menuIsOpen && setMenuIsOpen(false)
    }
  }, [pathname, locationLoginModalIsOpen, menuIsOpen, navigate])

  return (
    <header id="header" className="fixed top-0 z-10 w-full h-auto">
      <nav className="flex flex-col justify-between md:flex-row md:bg-privpass-500 md:shadow-lg">
        <div className="z-20 flex items-center justify-between h-16 md:h-24 bg-privpass-500">
          <Link
            to="/"
            className="flex items-center ml-3 text-2xl font-bold text-white md:text-3xl md:ml-7"
            onClick={scrollToTopHandler}
          >
            PrivPASS <FaUserShield className="ml-2" />
          </Link>

          <button
            className="px-3 py-2 mr-3 text-xl transition border rounded-full md:hidden text-privpass-300 border-privpass-300 hover:text-white hover:border-white active:scale-95"
            onClick={() => setMenuIsOpen(!menuIsOpen)}
          >
            <FaBars />
          </button>
        </div>

        {userInfo ? (
          <ul className="flex-row items-center hidden md:flex mr-7">
            <li
              className={`flex items-center px-5 py-3 transition md:py-2 md:px-3 md:mr-1 text-privpass-300 ${
                pathname !== '/profile' &&
                'cursor-pointer hover:text-white hover:bg-privpass-400 md:hover:bg-transparent active:scale-95'
              }`}
              onClick={pathname !== '/profile' ? () => navigate('/profile') : undefined}
            >
              <FaUser className="mr-1" />
              {userInfo.email}
            </li>
            <li className="flex">
              <div
                className="px-3 py-2 mx-4 mt-2 mb-4 transition border rounded-full cursor-pointer md:m-0 text-privpass-300 border-privpass-300 hover:text-white hover:border-white active:scale-95"
                onClick={logoutHandler}
              >
                Wyloguj
              </div>
            </li>
          </ul>
        ) : (
          <ul className="flex-row items-center hidden md:flex mr-7">
            <div
              className="px-5 py-3 transition cursor-pointer md:py-2 md:px-3 md:mr-1 text-privpass-300 hover:text-white hover:bg-privpass-400 md:hover:bg-transparent active:scale-95"
              onClick={() => scrollToHandler('product-section', -96)}
            >
              Produkt
            </div>
            <div
              className="px-5 py-3 transition cursor-pointer md:py-2 md:px-3 md:mr-1 text-privpass-300 hover:text-white hover:bg-privpass-400 md:hover:bg-transparent active:scale-95"
              onClick={() => scrollToHandler('contact-section', -96)}
            >
              Kontakt
            </div>
            <li
              className="px-5 py-3 transition cursor-pointer md:py-2 md:px-3 md:mr-2 text-privpass-300 hover:text-white hover:bg-privpass-400 md:hover:bg-transparent active:scale-95"
              onClick={() => setRegisterModalIsOpen(true)}
            >
              Rejestracja
            </li>
            <li className="flex">
              <div
                className="px-3 py-2 mx-4 mt-2 mb-4 transition border rounded-full cursor-pointer md:m-0 text-privpass-300 border-privpass-300 hover:text-white hover:border-white active:scale-95"
                onClick={() => setLoginModalIsOpen(true)}
              >
                Logowanie
              </div>
            </li>
          </ul>
        )}

        <ul
          className={`absolute w-full md:hidden flex flex-col transition-transform top-16 shadow-lg ${
            !menuIsOpen ? '-translate-y-full' : 'translate-y-0'
          } bg-privpass-500`}
        >
          {userInfo ? (
            <>
              <li
                className={`flex items-center px-5 py-3 transition-colors md:py-2 md:px-3 md:mr-2 text-privpass-300 ${
                  pathname !== '/profile' && 'cursor-pointer hover:text-white hover:bg-privpass-400 md:hover:bg-transparent'
                }`}
                onClick={pathname !== '/profile' ? () => navigate('/profile') : undefined}
              >
                <FaUser className="mr-1" />
                {userInfo.email}
              </li>
              <li className="flex">
                <div
                  className="px-3 py-2 mx-4 mt-2 mb-4 transition border rounded-full cursor-pointer md:m-0 text-privpass-300 border-privpass-300 hover:text-white hover:border-white active:scale-95"
                  onClick={logoutHandler}
                >
                  Wyloguj
                </div>
              </li>
            </>
          ) : (
            <>
              <div
                className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-1 text-privpass-300 hover:text-white hover:bg-privpass-400 md:hover:bg-transparent"
                onClick={() => scrollToHandler('product-section', -64)}
              >
                Produkt
              </div>
              <div
                className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-1 text-privpass-300 hover:text-white hover:bg-privpass-400 md:hover:bg-transparent"
                onClick={() => scrollToHandler('contact-section', -64)}
              >
                Kontakt
              </div>
              <li
                className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-2 text-privpass-300 hover:text-white hover:bg-privpass-400 md:hover:bg-transparent"
                onClick={() => {
                  setRegisterModalIsOpen(true)
                  setMenuIsOpen(false)
                }}
              >
                Rejestracja
              </li>
              <li className="flex">
                <div
                  className="px-3 py-2 mx-4 mt-2 mb-4 transition border rounded-full cursor-pointer md:m-0 text-privpass-300 border-privpass-300 hover:text-white hover:border-white active:scale-95"
                  onClick={() => {
                    setLoginModalIsOpen(true)
                    setMenuIsOpen(false)
                  }}
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

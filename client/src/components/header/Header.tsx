import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUserShield, FaBars } from 'react-icons/fa'
import LoginModal from './LoginModal'

const Header: React.FC = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false)
  //const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-10 flex flex-col justify-between w-full h-auto md:flex-row md:bg-percpass-500">
      <div className="z-20 flex items-center justify-between h-16 md:h-24 bg-percpass-500">
        <Link className="flex items-center ml-3 text-2xl font-bold text-white md:text-3xl md:ml-7" to="/">
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
        <li className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-1 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent">
          Produkt
        </li>
        <li className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-1 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent">
          Kontakt
        </li>
        <li className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-2 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent">
          Rejestracja
        </li>
        <li className="flex">
          <div
            className="px-3 py-2 mx-4 mt-2 mb-4 transition-colors border rounded-full cursor-pointer md:m-0 text-percpass-300 border-percpass-300 hover:text-white hover:border-white"
            onClick={() => setLoginModalIsOpen(true)}
          >
            Logowanie
          </div>
        </li>
      </ul>

      <ul
        className={`absolute w-full md:hidden flex flex-col transition-transform top-16 ${
          !menuIsOpen ? '-translate-y-full' : 'translate-y-0'
        } bg-percpass-500`}
      >
        <li className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-1 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent">
          Produkt
        </li>
        <li className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-1 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent">
          Kontakt
        </li>
        <li className="px-5 py-3 transition-colors cursor-pointer md:py-2 md:px-3 md:mr-2 text-percpass-300 hover:text-white hover:bg-percpass-400 md:hover:bg-transparent">
          Rejestracja
        </li>
        <li className="flex">
          <div
            className="px-3 py-2 mx-4 mt-2 mb-4 transition-colors border rounded-full cursor-pointer md:m-0 text-percpass-300 border-percpass-300 hover:text-white hover:border-white"
            onClick={() => setLoginModalIsOpen(true)}
          >
            Logowanie
          </div>
        </li>
      </ul>

      <LoginModal isOpen={loginModalIsOpen} setIsOpen={setLoginModalIsOpen} />
    </nav>
  )
}

export default Header

import { FaUserShield } from 'react-icons/fa'

const Header: React.FC = () => {
  return (
    <div className="absolute flex items-center justify-between w-full h-24 bg-percpass-500">
      <div className="flex items-center ml-8 text-3xl font-bold text-white">
        PercPASS <FaUserShield className="ml-2" />
      </div>

      <ul className="flex items-center mr-8 text-percpass-300">
        <li className="mr-1">
          <button className="px-3 py-2 transition-colors hover:text-white">Produkt</button>
        </li>
        <li className="mr-1">
          <button className="px-3 py-2 transition-colors hover:text-white">Kontakt</button>
        </li>
        <li className="mr-2">
          <button className="px-3 py-2 transition-colors hover:text-white">Rejestracja</button>
        </li>
        <li className="">
          <button className="px-3 py-2 transition-colors border rounded-full hover:text-white hover:border-white">
            Logowanie
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Header

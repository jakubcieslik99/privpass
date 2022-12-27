import { FaUserShield } from 'react-icons/fa'

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-privpass-500">
      <div className="flex flex-col items-center justify-center text-sm text-white md:flex-row">
        <p>Copyright © {new Date().getFullYear()}</p>
        <p className="hidden mx-3 font-extralight md:block">|</p>
        <p className="flex items-center my-2 text-xl font-bold md:text-base md:my-0">
          PrivPASS <FaUserShield className="ml-1" />
        </p>
        <p className="hidden mx-3 font-extralight md:block">|</p>
        <p>Wszelkie prawa zastrzeżone.</p>
      </div>

      <div className="mt-[15px] text-[.7rem] text-center text-gray-400 tracking-wide">
        <a href="http://www.freepik.com" target="_blank" rel="noreferrer">
          Hero graphics designed by fullvector / Freepik
        </a>
      </div>
    </footer>
  )
}

export default Footer

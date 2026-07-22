import { FaUserShield } from 'react-icons/fa'
import { useAppSelector } from '../../features/store'
import { tr } from '../../translations/translations'

const Footer: React.FC = () => {
  // variables
  const { language } = useAppSelector(state => state.appSettings)

  return (
    <footer className="bg-privpass-500 p-4">
      <div className="flex md:flex-row flex-col justify-center items-center text-white text-sm">
        <p>Copyright © {new Date().getFullYear()}</p>
        <p className="hidden md:block mx-3 font-extralight">|</p>
        <p className="flex items-center mt-2 md:mt-0 md:mr-2 font-bold md:text-base text-xl">
          PrivPASS <FaUserShield className="ml-1" />
        </p>
        <p className="mb-2 md:mb-0 font-light text-xs italic">by Jakub Cieślik</p>
        <p className="hidden md:block mx-3 font-extralight">|</p>
        <p>{tr('footer', language)}</p>
      </div>

      <div className="mt-[15px] text-[.7rem] text-gray-400 text-center tracking-wide">
        <a href="http://www.freepik.com" target="_blank" rel="noreferrer">
          Hero graphics designed by fullvector / Freepik
        </a>
      </div>
    </footer>
  )
}

export default Footer

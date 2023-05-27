import { FaUserShield } from 'react-icons/fa'
import { useAppSelector } from '../../features/store'
import { tr } from '../../translations/translations'

const Footer: React.FC = () => {
  //variables
  const { language } = useAppSelector(state => state.appSettings)

  return (
    <footer className="p-4 bg-privpass-500">
      <div className="flex flex-col items-center justify-center text-sm text-white md:flex-row">
        <p>Copyright © {new Date().getFullYear()}</p>
        <p className="hidden mx-3 font-extralight md:block">|</p>
        <p className="flex items-center mt-2 text-xl font-bold md:mr-2 md:text-base md:mt-0">
          PrivPASS <FaUserShield className="ml-1" />
        </p>
        <p className="mb-2 text-xs italic font-light md:mb-0">by Jakub Cieślik</p>
        <p className="hidden mx-3 font-extralight md:block">|</p>
        <p>{tr('footer', language)}</p>
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

import { FaUserShield } from 'react-icons/fa'

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col items-center justify-center p-4 text-sm text-white bg-percpass-500 md:flex-row">
      <p>Copyright © {new Date().getFullYear()}</p>
      <p className="hidden mx-3 font-extralight md:block">|</p>
      <p className="flex items-center my-2 text-xl font-bold md:text-base md:my-0">
        PercPASS <FaUserShield className="ml-1" />
      </p>
      <p className="hidden mx-3 font-extralight md:block">|</p>
      <p>Wszelkie prawa zastrzeżone.</p>
    </footer>
  )
}

export default Footer

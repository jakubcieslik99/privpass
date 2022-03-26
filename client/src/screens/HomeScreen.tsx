import { FaArrowCircleDown } from 'react-icons/fa'
import Hero from '../assets/hero.png'

const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/*Hero*/}
      <div className="hero">
        <div className="grid h-full overflow-hidden md:grid-cols-12 screen-container">
          <div className="flex items-center justify-center md:col-span-5">
            <div className="flex flex-col items-center text-white">
              <p className="text-3xl">Twój bezpieczny</p>
              <p className="mb-4 text-3xl">menedżer haseł</p>
              <button className="px-4 py-3 text-xl transition-colors border rounded-full border-percpass-200 text-percpass-200 hover:border-percpass-100 hover:text-percpass-100">
                DOWIEDZ SIĘ WIĘCEJ
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center md:col-span-7">
            <img src={Hero} alt="Hero" />
          </div>
        </div>

        <div className="absolute bottom-0 flex justify-center w-full">
          <button className="m-6 text-2xl transition-colors hover:text-percpass-100 text-percpass-200">
            <FaArrowCircleDown />
          </button>
        </div>
      </div>

      <div className="bg-red-200">
        <div>Test3</div>
      </div>
    </div>
  )
}

export default HomeScreen

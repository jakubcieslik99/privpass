import { FaArrowCircleDown } from 'react-icons/fa'

const HomeScreen: React.FC = () => {
  return (
    <main>
      <div className="h-screen pt-16 md:pt-24 bg-percpass-600">
        <div className="grid h-full grid-flow-col grid-rows-6 app-container md:grid-flow-row md:grid-cols-12 md:grid-rows-1">
          <div className="flex items-center justify-center row-span-2 md:col-span-5">
            <div className="flex flex-col items-center text-white">
              <p className="text-3xl">Twój bezpieczny</p>
              <p className="mb-4 text-3xl">menedżer haseł</p>
              <button className="px-4 py-3 text-xl transition border rounded-full border-percpass-200 text-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95">
                DOWIEDZ SIĘ WIĘCEJ
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center row-span-3 md:col-span-7">
            <div className="w-full h-full bg-[url('./assets/hero.png')] bg-no-repeat bg-center bg-contain" />
          </div>
        </div>

        <div className="absolute bottom-0 flex justify-center w-full">
          <button
            className="m-4 text-3xl transition md:m-6 md:text-2xl text-percpass-200 hover:text-percpass-100 active:scale-90"
            onClick={() => console.log('Move')}
          >
            <FaArrowCircleDown />
          </button>
        </div>
      </div>

      <div className="h-screen bg-red-100">
        <div className="app-container">Content 1</div>
      </div>

      <div className="h-screen bg-green-100">
        <div className="app-container">Content 2</div>
      </div>
    </main>
  )
}

export default HomeScreen

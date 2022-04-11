import { scroller } from 'react-scroll'
import { FaArrowCircleDown } from 'react-icons/fa'

const HomeScreen: React.FC = () => {
  const scrollToHandler = (offset: number) => {
    scroller.scrollTo('product-section', {
      spy: true,
      smooth: 'easeInOutCubic',
      offset,
      duration: 500,
    })
  }

  return (
    <main>
      <div id="hero-section" className="h-screen pt-16 md:pt-24 app-hero-screen">
        <div className="grid h-full grid-flow-col grid-rows-6 app-container md:grid-flow-row md:grid-cols-12 md:grid-rows-1">
          <div className="flex items-center justify-center row-span-2 md:col-span-5">
            <div className="flex flex-col items-center text-white">
              <p className="text-2xl md:text-3xl">Twój bezpieczny</p>
              <p className="mb-4 text-2xl md:text-3xl">menedżer haseł</p>
              <button
                className="px-4 py-3 transition border rounded-full cursor-pointer md:text-xl border-percpass-200 text-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95 text-md"
                onClick={() => scrollToHandler(window.innerWidth < 768 ? -64 : -96)}
              >
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
            className="m-4 text-3xl transition cursor-pointer md:m-6 md:text-2xl text-percpass-200 hover:text-percpass-100 active:scale-90"
            onClick={() => scrollToHandler(window.innerWidth < 768 ? -64 : -96)}
          >
            <FaArrowCircleDown />
          </button>
        </div>
      </div>

      <div id="product-section" className="bg-red-100">
        <div className="app-container">Produkt</div>
      </div>

      <div id="contact-section" className="bg-green-100">
        <div className="app-container">Kontakt</div>
      </div>
    </main>
  )
}

export default HomeScreen

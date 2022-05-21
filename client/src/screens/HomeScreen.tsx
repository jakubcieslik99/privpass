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
      <div id="hero-section" className="pt-16 md:pt-24 gradient-primary app-hero-screen">
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

      <div id="product-section" className="bg-indigo-100">
        <div className="app-container">
          <p className="pt-6">PercPASS to bezpieczny menedżer Twoich haseł.</p>
          <p>Od teraz nie musisz pamiętać wszystkich z nich.</p>
          <p>Popraw swoje bezpieczeństwo w sieci z PercPASS!</p>
          <p>
            Logowanie do serwisu odbywa się za pomocą kodu uwierzytelniającego wysyłanego na maila podanego podczas
            rejestracji.
          </p>
          <p>
            Po zalogowaniu otrzymujesz listę swoich wszystkich zapisanych haseł w ukrytej formie, dla zwiększenia
            bezpieczeństwa.
          </p>
          <p>Przechowywane przez nas hasła są zaszyfrowane metodą AES-256</p>
        </div>
      </div>

      <div id="contact-section" className="bg-indigo-200">
        <div className="app-container">
          <p className="pt-6">Masz pytania? Skontaktuj się z nami!</p>
          <p>email kontaktowy:</p>
          <p>contact@jakubcieslik.com</p>
        </div>
      </div>
    </main>
  )
}

export default HomeScreen

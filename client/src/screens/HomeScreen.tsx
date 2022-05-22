import { scroller } from 'react-scroll'
import { FaArrowCircleDown, FaListUl, FaKey, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { MdSecurity, MdEmail } from 'react-icons/md'
import Product from '../assets/product.png'
import Contact from '../assets/contact.png'
import Marceljurkiewicz from '../assets/marceljurkiewicz.png'
import Jakubcieslik from '../assets/jakubcieslik.png'
import Jakubpasek from '../assets/jakubpasek.png'
import Cezarypiechowiak from '../assets/cezarypiechowiak.png'

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

      <div id="product-section" className="flex items-center justify-center bg-indigo-100">
        <div className="w-full px-5 py-12 md:px-10 app-container">
          <div className="mb-14">
            <h2 className="mb-3 text-3xl font-bold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">
              PercPASS to bezpieczny menedżer Twoich haseł.
            </h2>
            <h3 className="text-xl font-semibold tracking-wide text-center uppercase text-percpass-400">
              Od teraz nie musisz pamiętać wszystkich z nich.
            </h3>
          </div>

          <div className="grid gap-6 mb-7 md:grid-cols-2">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center w-12 h-12 text-xl text-white rounded-xl bg-percpass-400">
                  <MdSecurity />
                </div>
                <p className="ml-16 text-xl font-medium leading-6 text-gray-900">Bezpieczne logowanie</p>
              </dt>
              <dd className="mt-2 ml-16 text-gray-500">
                Logowanie do serwisu odbywa się za pomocą kodu uwierzytelniającego wysyłanego na maila podanego podczas
                rejestracji.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center w-12 h-12 text-xl text-white rounded-xl bg-percpass-400">
                  <FaListUl />
                </div>
                <p className="ml-16 text-xl font-medium leading-6 text-gray-900">Hasła na wyciągnięcie ręki</p>
              </dt>
              <dd className="mt-2 ml-16 text-gray-500">
                Po zalogowaniu otrzymujesz listę swoich wszystkich zapisanych haseł w ukrytej formie, dla zwiększenia
                bezpieczeństwa.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center w-12 h-12 text-xl text-white rounded-xl bg-percpass-400">
                  <FaKey />
                </div>
                <p className="ml-16 text-xl font-medium leading-6 text-gray-900">Pełne szyfrowanie</p>
              </dt>
              <dd className="mt-2 ml-16 text-gray-500">Przechowywane przez nas hasła są zaszyfrowane metodą AES-256.</dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center w-12 h-12 text-xl text-white rounded-xl bg-percpass-400">
                  <MdEmail />
                </div>
                <p className="ml-16 text-xl font-medium leading-6 text-gray-900">Szybki kontakt i pomoc</p>
              </dt>
              <dd className="mt-2 ml-16 text-gray-500">
                W razie problemów skontaktujesz się z nami szybko drogą mailową. Odpowiadamy zawsze w maksymalnie 24 godziny.
              </dd>
            </div>
          </div>

          <div className="mx-auto w-52 h-52">
            <img src={Product} alt="Produkt" />
          </div>
        </div>
      </div>

      <div id="contact-section" className="flex items-center justify-center bg-indigo-200">
        <div className="w-full px-5 py-12 md:px-10 app-container">
          <div className="mb-14">
            <h2 className="mb-3 text-3xl font-bold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">
              Skontaktuj się z nami
            </h2>
            <h3 className="text-xl font-semibold tracking-wide text-center uppercase text-percpass-400">
              Nasz zespół odpowie na wszystkie twoje pytania
            </h3>
          </div>

          <div className="grid gap-6 mb-9 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative mt-20 xl:max-w-sm">
              <div className="overflow-hidden bg-white shadow-md rounded-xl">
                <div className="absolute flex justify-center w-full -mt-20">
                  <div className="w-32 h-32">
                    <img
                      src={Marceljurkiewicz}
                      alt="Marcel Jurkiewicz"
                      className="object-cover w-full h-full rounded-full shadow-md"
                    />
                  </div>
                </div>
                <div className="px-6 mt-16">
                  <h1 className="mb-1 text-2xl text-center">Marcel Jurkiewicz</h1>
                  <p className="text-sm text-center">UX/UI, frontend, dokumentacja</p>

                  <div className="flex justify-center w-full pt-5 pb-5">
                    <a href="mailto:kontakt@marceljurkiewicz.pl" className="mx-5">
                      <MdEmail className="text-2xl text-percpass-400" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/marcel-jurkiewicz-1b4212226/"
                      target="_blank"
                      rel="noreferrer"
                      className="mx-5"
                    >
                      <FaLinkedinIn className="text-2xl text-percpass-400" />
                    </a>
                    <a href="https://github.com/Juras99" target="_blank" rel="noreferrer" className="mx-5">
                      <FaGithub className="text-2xl text-percpass-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-20 xl:max-w-sm">
              <div className="overflow-hidden bg-white shadow-md rounded-xl">
                <div className="absolute flex justify-center w-full -mt-20">
                  <div className="w-32 h-32">
                    <img
                      src={Jakubcieslik}
                      alt="Jakub Cieślik"
                      className="object-cover w-full h-full rounded-full shadow-md"
                    />
                  </div>
                </div>
                <div className="px-6 mt-16">
                  <h1 className="mb-1 text-2xl text-center">Jakub Cieślik</h1>
                  <p className="text-sm text-center">Frontend, backend, fullstack</p>

                  <div className="flex justify-center w-full pt-5 pb-5">
                    <a href="mailto:contact@jakubcieslik.com" className="mx-5">
                      <MdEmail className="text-2xl text-percpass-400" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/jakub-cie%C5%9Blik-8632951b2/"
                      target="_blank"
                      rel="noreferrer"
                      className="mx-5"
                    >
                      <FaLinkedinIn className="text-2xl text-percpass-400" />
                    </a>
                    <a href="https://github.com/jakubcieslik99" target="_blank" rel="noreferrer" className="mx-5">
                      <FaGithub className="text-2xl text-percpass-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-20 xl:max-w-sm">
              <div className="overflow-hidden bg-white shadow-md rounded-xl">
                <div className="absolute flex justify-center w-full -mt-20">
                  <div className="w-32 h-32">
                    <img src={Jakubpasek} alt="Jakub Pasek" className="object-cover w-full h-full rounded-full shadow-md" />
                  </div>
                </div>
                <div className="px-6 mt-16">
                  <h1 className="mb-1 text-2xl text-center">Jakub Pasek</h1>
                  <p className="text-sm text-center">Frontend, UX</p>

                  <div className="flex justify-center w-full pt-5 pb-5">
                    <a href="mailto:102227@g.elearn.uz.zgora.pl" className="mx-5">
                      <MdEmail className="text-2xl text-percpass-400" />
                    </a>
                    <a href="/" target="_blank" rel="noreferrer" className="mx-5">
                      <FaLinkedinIn className="text-2xl text-percpass-400" />
                    </a>
                    <a href="https://github.com/sentix7" target="_blank" rel="noreferrer" className="mx-5">
                      <FaGithub className="text-2xl text-percpass-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-20 xl:max-w-sm">
              <div className="overflow-hidden bg-white shadow-md rounded-xl">
                <div className="absolute flex justify-center w-full -mt-20">
                  <div className="w-32 h-32">
                    <img
                      src={Cezarypiechowiak}
                      alt="Cezary Piechowiak"
                      className="object-cover w-full h-full rounded-full shadow-md"
                    />
                  </div>
                </div>
                <div className="px-6 mt-16">
                  <h1 className="mb-1 text-2xl text-center">Cezary Piechowiak</h1>
                  <p className="text-sm text-center">Backend, DB management</p>

                  <div className="flex justify-center w-full pt-5 pb-5">
                    <a href="mailto:102233@g.elearn.uz.zgora.pl" className="mx-5">
                      <MdEmail className="text-2xl text-percpass-400" />
                    </a>
                    <a href="/" target="_blank" rel="noreferrer" className="mx-5">
                      <FaLinkedinIn className="text-2xl text-percpass-400" />
                    </a>
                    <a href="https://github.com/CezaryPiechowiak" target="_blank" rel="noreferrer" className="mx-5">
                      <FaGithub className="text-2xl text-percpass-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-52 h-52">
            <img src={Contact} alt="Kontakt" />
          </div>
        </div>
      </div>
    </main>
  )
}

export default HomeScreen

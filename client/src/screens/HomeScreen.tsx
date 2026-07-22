import { scroller } from 'react-scroll'
import { FaArrowCircleDown, FaListUl, FaKey, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { MdSecurity, MdEmail } from 'react-icons/md'
import { useAppSelector } from '../features/store'
import Product from '../assets/product.png'
import Contact from '../assets/contact.png'
import Marceljurkiewicz from '../assets/marceljurkiewicz.png'
import Jakubcieslik from '../assets/jakubcieslik.png'
import { tr } from '../translations/translations'

const HomeScreen: React.FC = () => {
  // variables
  const { language } = useAppSelector(state => state.appSettings)

  const scrollToHandler = (offset: number) => {
    scroller.scrollTo('product-section', { spy: true, smooth: 'easeInOutCubic', offset, duration: 500 })
  }

  return (
    <main>
      <div id="hero-section" className="pt-16 md:pt-24 gradient-primary app-hero-screen">
        <div className="grid md:grid-cols-12 grid-rows-6 md:grid-rows-1 md:grid-flow-row grid-flow-col h-full app-container">
          <div className="flex justify-center items-center md:col-span-5 row-span-2">
            <div className="flex flex-col items-center text-white">
              <p className="text-2xl md:text-3xl">{tr('homeScreenHero1', language)}</p>
              <p className="mb-4 text-2xl md:text-3xl">{tr('homeScreenHero2', language)}</p>
              <button
                className="px-4 py-3 border border-privpass-200 hover:border-privpass-100 rounded-full text-md text-privpass-200 hover:text-privpass-100 md:text-xl active:scale-95 transition cursor-pointer"
                onClick={() => scrollToHandler(window.innerWidth < 768 ? -64 : -96)}
              >
                {tr('homeScreenButtonMore', language)}
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center md:col-span-7 row-span-3">
            <div className="bg-[url('./assets/hero.png')] bg-contain bg-no-repeat bg-center w-full h-full" />
          </div>
        </div>

        <div className="bottom-0 absolute flex justify-center w-full">
          <button
            className="m-4 md:m-6 text-privpass-200 hover:text-privpass-100 md:text-2xl text-3xl active:scale-90 transition cursor-pointer"
            onClick={() => scrollToHandler(window.innerWidth < 768 ? -64 : -96)}
          >
            <FaArrowCircleDown />
          </button>
        </div>
      </div>

      <div id="product-section" className="flex justify-center items-center bg-indigo-100">
        <div className="px-5 md:px-10 py-12 w-full app-container">
          <div className="mb-14">
            <h2 className="mb-3 font-bold text-gray-900 text-3xl sm:text-4xl text-center leading-8 tracking-tight">
              {tr('homeScreenHeading', language)}
            </h2>
            <h3 className="font-semibold text-privpass-400 text-xl text-center uppercase tracking-wide">
              {tr('homeScreenSubheading', language)}
            </h3>
          </div>

          <div className="gap-6 grid md:grid-cols-2 mb-7">
            <div className="relative">
              <dt>
                <div className="absolute flex justify-center items-center bg-privpass-400 rounded-xl w-12 h-12 text-white text-xl">
                  <MdSecurity />
                </div>
                <p className="ml-16 font-medium text-gray-900 text-xl leading-6">{tr('homeScreenTerm1', language)}</p>
              </dt>
              <dd className="mt-2 ml-16 text-gray-500">{tr('homeScreenTerm1Message', language)}</dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex justify-center items-center bg-privpass-400 rounded-xl w-12 h-12 text-white text-xl">
                  <FaListUl />
                </div>
                <p className="ml-16 font-medium text-gray-900 text-xl leading-6">{tr('homeScreenTerm2', language)}</p>
              </dt>
              <dd className="mt-2 ml-16 text-gray-500">{tr('homeScreenTerm2Message', language)}</dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex justify-center items-center bg-privpass-400 rounded-xl w-12 h-12 text-white text-xl">
                  <FaKey />
                </div>
                <p className="ml-16 font-medium text-gray-900 text-xl leading-6">{tr('homeScreenTerm3', language)}</p>
              </dt>
              <dd className="mt-2 ml-16 text-gray-500">{tr('homeScreenTerm3Message', language)}</dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex justify-center items-center bg-privpass-400 rounded-xl w-12 h-12 text-white text-xl">
                  <MdEmail />
                </div>
                <p className="ml-16 font-medium text-gray-900 text-xl leading-6">{tr('homeScreenTerm4', language)}</p>
              </dt>
              <dd className="mt-2 ml-16 text-gray-500">{tr('homeScreenTerm4Message', language)}</dd>
            </div>
          </div>

          <div className="mx-auto w-52 h-52">
            <img src={Product} alt={tr('altProduct', language)} />
          </div>
        </div>
      </div>

      <div id="contact-section" className="flex justify-center items-center bg-indigo-200">
        <div className="px-5 md:px-10 py-12 w-full app-container">
          <div className="mb-14">
            <h2 className="mb-3 font-bold text-gray-900 text-3xl sm:text-4xl text-center leading-8 tracking-tight">
              {tr('homeScreenContactHeading', language)}
            </h2>
            <h3 className="font-semibold text-privpass-400 text-xl text-center uppercase tracking-wide">
              {tr('homeScreenContactSubheading', language)}
            </h3>
          </div>

          <div className="justify-items-center gap-6 grid md:grid-cols-2 lg:grid-cols-8 mb-9">
            <div className="relative lg:col-span-3 lg:col-start-2 mt-20 xl:max-w-sm">
              <div className="bg-white shadow-md rounded-xl overflow-hidden">
                <div className="absolute flex justify-center -mt-20 w-full">
                  <div className="w-32 h-32">
                    <img
                      src={Jakubcieslik}
                      alt="Jakub Cieślik"
                      className="shadow-md rounded-full w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-16 px-6">
                  <h1 className="mb-1 text-2xl text-center">Jakub Cieślik</h1>
                  <p className="text-sm text-center">
                    Frontend development, UI/UX, backend development, DB management, deployment
                  </p>

                  <div className="flex justify-center pt-5 pb-5 w-full">
                    <a href="mailto:contact@jakubcieslik.com" className="mx-5">
                      <MdEmail className="text-privpass-400 text-2xl" />
                    </a>
                    <a href="https://www.linkedin.com/in/jakubcieslik99" target="_blank" rel="noreferrer" className="mx-5">
                      <FaLinkedinIn className="text-privpass-400 text-2xl" />
                    </a>
                    <a href="https://github.com/jakubcieslik99" target="_blank" rel="noreferrer" className="mx-5">
                      <FaGithub className="text-privpass-400 text-2xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-3 mt-20 xl:max-w-sm">
              <div className="bg-white shadow-md rounded-xl overflow-hidden">
                <div className="absolute flex justify-center -mt-20 w-full">
                  <div className="w-32 h-32">
                    <img
                      src={Marceljurkiewicz}
                      alt="Marcel Jurkiewicz"
                      className="shadow-md rounded-full w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-16 px-6">
                  <h1 className="mb-1 text-2xl text-center">Marcel Jurkiewicz</h1>
                  <p className="text-sm text-center">{tr('homeScreenContactMJ', language)}</p>

                  <div className="flex justify-center pt-5 pb-5 w-full">
                    <a href="mailto:kontakt@marceljurkiewicz.pl" className="mx-5">
                      <MdEmail className="text-privpass-400 text-2xl" />
                    </a>
                    <a href="https://www.linkedin.com/in/marceljurkiewicz" target="_blank" rel="noreferrer" className="mx-5">
                      <FaLinkedinIn className="text-privpass-400 text-2xl" />
                    </a>
                    <a href="https://github.com/juras99" target="_blank" rel="noreferrer" className="mx-5">
                      <FaGithub className="text-privpass-400 text-2xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-52 h-52">
            <img src={Contact} alt={tr('altContact', language)} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default HomeScreen

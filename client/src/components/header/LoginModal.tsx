import { useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'

interface LoginModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginModal = (props: LoginModalProps) => {
  useEffect(() => {
    if (props.isOpen) {
      //const topScroll = window.pageYOffset || document.documentElement.scrollTop
      //const leftScroll = window.pageXOffset || document.documentElement.scrollLeft
      //window.onscroll = () => window.scrollTo(leftScroll, topScroll)
      document.body.classList.add('noscroll')
      console.log('shown')
    }
    return () => {}
  }, [props.isOpen])

  const closeHandler = () => {
    props.setIsOpen(false)
    //window.onscroll = () => null
    document.body.classList.remove('noscroll')
    console.log('hidden')
  }

  const submitHandler = (event: React.SyntheticEvent<HTMLElement>) => {
    event.preventDefault()
  }

  return (
    <Transition className="fixed inset-0 z-30" show={props.isOpen}>
      <Transition.Child
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={() => closeHandler()}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <FaTimes
          className={`fixed hidden text-3xl text-gray-400 transition cursor-pointer right-3 top-3 hover:text-gray-300 active:scale-95 ${'md:hidden'}`}
          onClick={() => closeHandler()}
        />
      </Transition.Child>

      <div
        className="fixed inset-0 flex items-center justify-center mx-4 my-6 md:mt-16 md:mb-32"
        onClick={(e: any) => (e.target === e.currentTarget ? closeHandler() : null)}
      >
        <Transition.Child
          as="form"
          className="flex flex-col w-full max-w-xl max-h-full px-5 py-4 bg-gray-100 rounded-lg shadow-md"
          onSubmit={submitHandler}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="flex items-center justify-between w-full text-2xl text-gray-800">
            <h2 className="font-semibold">Logowanie</h2>
            <FaTimes
              className="transition cursor-pointer hover:text-gray-700 active:scale-95"
              onClick={() => closeHandler()}
            />
          </div>

          <div className="flex flex-col w-full my-4 overflow-y-auto">
            <div className="flex flex-col md:mx-6">
              <label htmlFor="loginEmail">Email:</label>
              <input
                name="loginEmail"
                type="text"
                placeholder="Podaj email"
                className="px-3 py-2 border rounded-lg border-percpass-400 focus:outline-percpass-400"
              />
            </div>

            <div className="flex flex-col items-center md:mx-6">
              <label className="mb-1 w-36">Kod logowania:</label>
              <input
                name="loginNumberOne"
                type="text"
                placeholder="0000"
                className="pl-[1.22rem] pr-2 py-2 text-3xl tracking-[.4em] border rounded-lg w-36 border-percpass-400 focus:outline-percpass-400 login-number-input pl-"
              />
            </div>
          </div>

          <div className="flex justify-center w-full mb-1">
            <button
              disabled={false}
              type="submit"
              className="px-4 py-2 text-white transition rounded-full bg-percpass-500 hover:bg-percpass-400 active:scale-95 disabled:opacity-90 disabled:bg-percpass-400"
            >
              Zaloguj się
            </button>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}

export default LoginModal

import { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { LoginEmailForm, LoginCodeForm } from './LoginForms'

interface LoginModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginModal = (props: LoginModalProps) => {
  const [loginFormSwitch, setLoginFormSwitch] = useState(true)

  useEffect(() => {
    if (props.isOpen) {
      //const topScroll = window.pageYOffset || document.documentElement.scrollTop
      //const leftScroll = window.pageXOffset || document.documentElement.scrollLeft
      //window.onscroll = () => window.scrollTo(leftScroll, topScroll)
      document.body.classList.add('noscroll')
    }
    return () => {}
  }, [props.isOpen])

  const closeHandler = () => {
    props.setIsOpen(false)
    //window.onscroll = () => null
    document.body.classList.remove('noscroll')
  }

  return (
    <Transition className="fixed inset-0 z-30" show={props.isOpen}>
      <Transition.Child
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={loginFormSwitch ? () => closeHandler() : undefined}
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
        onClick={loginFormSwitch ? (e: any) => (e.target === e.currentTarget ? closeHandler() : undefined) : undefined}
      >
        <Transition.Child
          className="relative w-full max-w-md min-h-full"
          onClick={loginFormSwitch ? (e: any) => (e.target === e.currentTarget ? closeHandler() : undefined) : undefined}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <LoginEmailForm formSwitch={loginFormSwitch} setFormSwitch={setLoginFormSwitch} closeHandler={closeHandler} />
          <LoginCodeForm formSwitch={loginFormSwitch} setFormSwitch={setLoginFormSwitch} closeHandler={closeHandler} />
        </Transition.Child>
      </div>
    </Transition>
  )
}

export default LoginModal

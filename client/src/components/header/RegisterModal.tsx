import { useState, useCallback, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { useAppDispatch } from '../../features/store'
import { successReset, errorReset, messageReset } from '../../features/userSlices/listUser'
import { emailReset } from '../../features/userSlices/storeEmail'
import { RegisterEmailForm, RegisterCodeForm } from './RegisterForms'

interface RegisterModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RegisterModal = (props: RegisterModalProps) => {
  //variables
  const { isOpen, setIsOpen } = props

  const dispatch = useAppDispatch()

  const [registerFormSwitch, setRegisterFormSwitch] = useState(true)

  //handlers
  const closeHandler = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      dispatch(successReset())
      dispatch(errorReset())
      dispatch(messageReset())

      dispatch(emailReset())

      setRegisterFormSwitch(true)
    }, 200)
  }, [setIsOpen, dispatch])

  //useEffects
  useEffect(() => {
    isOpen ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll')
  }, [isOpen])

  return (
    <Transition className="fixed inset-0 z-30" show={props.isOpen}>
      <Transition.Child
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={registerFormSwitch ? () => closeHandler() : undefined}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <FaTimes
          className={`fixed hidden text-3xl text-gray-400 transition-colors cursor-pointer right-3 top-3 hover:text-gray-300 active:scale-95 ${'md:hidden'}`}
          onClick={registerFormSwitch ? () => closeHandler() : undefined}
        />
      </Transition.Child>

      <div
        className="fixed inset-0 flex items-center justify-center mx-4 my-6 md:mt-16 md:mb-32"
        onClick={registerFormSwitch ? (e: any) => (e.target === e.currentTarget ? closeHandler() : undefined) : undefined}
      >
        <Transition.Child
          className="relative w-full max-w-md min-h-full"
          onClick={registerFormSwitch ? (e: any) => (e.target === e.currentTarget ? closeHandler() : undefined) : undefined}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <RegisterEmailForm
            formSwitch={registerFormSwitch}
            setFormSwitch={setRegisterFormSwitch}
            closeHandler={closeHandler}
          />
          <RegisterCodeForm
            formSwitch={registerFormSwitch}
            setFormSwitch={setRegisterFormSwitch}
            isOpen={props.isOpen}
            closeHandler={closeHandler}
          />
        </Transition.Child>
      </div>
    </Transition>
  )
}

export default RegisterModal

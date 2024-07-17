import { useState, Fragment } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { useAppSelector, useAppDispatch } from '../../features/store'
import { successReset, errorReset, messageReset } from '../../features/userSlices/listUser'
import { emailReset } from '../../features/userSlices/storeEmail'
import { LoginEmailForm, LoginCodeForm } from './LoginForms'

interface LoginModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginModal = (props: LoginModalProps) => {
  //variables
  const { loading, success, successMessage, error, errorMessage } = useAppSelector(state => state.listUser)
  const { email } = useAppSelector(state => state.storeEmail)
  const dispatch = useAppDispatch()

  const [loginFormSwitch, setLoginFormSwitch] = useState(true)

  //handlers
  const closeHandler = () => {
    props.setIsOpen(false)
    setTimeout(() => {
      success && dispatch(successReset(null))
      error && dispatch(errorReset(null))
      if (successMessage || errorMessage) dispatch(messageReset(null))

      email && dispatch(emailReset(null))

      setLoginFormSwitch(true)
    }, 250)
  }

  return (
    <Transition as={Fragment} appear show={props.isOpen}>
      <Dialog as="div" className="relative z-30" onClose={() => loginFormSwitch && !loading && closeHandler()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full px-4 py-6 text-center md:pt-16 md:pb-32">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="grid items-center w-full max-w-md">
                <LoginEmailForm
                  formSwitch={loginFormSwitch}
                  setFormSwitch={setLoginFormSwitch}
                  closeHandler={closeHandler}
                />
                <LoginCodeForm
                  formSwitch={loginFormSwitch}
                  setFormSwitch={setLoginFormSwitch}
                  isOpen={props.isOpen}
                  closeHandler={closeHandler}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default LoginModal

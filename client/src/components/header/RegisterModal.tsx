import { useEffect } from 'react'
//import { useForm, SubmitHandler } from 'react-hook-form'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
//import { registerFirstErrors, registerSecondErrors } from '../../validations/signinValidations'

interface RegisterModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

//interface RegisterFirstFormValues { registerEmail: string }
//interface RegisterSecondFormValues { registerCode: string }

const RegisterModal = (props: RegisterModalProps) => {
  useEffect(() => {
    if (props.isOpen) document.body.classList.add('noscroll')
    return () => {}
  }, [props.isOpen])

  const closeHandler = () => {
    props.setIsOpen(false)
    document.body.classList.remove('noscroll')
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
          className="flex flex-col w-full max-w-md max-h-full px-5 py-4 bg-gray-100 rounded-lg shadow-md"
          onSubmit={submitHandler}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="flex items-center justify-between w-full text-2xl text-gray-800">
            <h2 className="font-semibold">Rejestracja</h2>
            <FaTimes
              className="transition cursor-pointer hover:text-gray-700 active:scale-95"
              onClick={() => closeHandler()}
            />
          </div>

          <div className="flex flex-col w-full my-4 overflow-y-auto">
            <div className="flex flex-col text-gray-800 md:mx-6">
              <label htmlFor="registerEmail">Email:</label>
              <input
                name="registerEmail"
                id="registerEmail"
                type="text"
                placeholder="Podaj email"
                className="px-3 py-2 border rounded-lg border-percpass-400 focus:outline-percpass-400"
              />
            </div>

            <div className="flex flex-col items-center text-gray-800 md:mx-6">
              <label htmlFor="registerCode" className="mb-1 w-36">
                Kod rejestracji:
              </label>
              <input
                name="registerCode"
                id="registerCode"
                type="text"
                placeholder="0000"
                className="pl-[1.37rem] pr-1 py-2 text-3xl tracking-[.4em] border rounded-lg w-36 border-percpass-400 focus:outline-percpass-400 confirmation-number-input"
              />

              <div className="mt-4 text-xs text-center text-gray-700">
                Kod rejestracji jest ważny przez <span className="font-semibold">15 minut</span>. Wejdź na swoje konto w
                przeciągu tego czasu, aby potwierdzić rejestrację.
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full mb-1">
            <button
              disabled={false}
              type="submit"
              className="px-4 py-2 text-white transition rounded-full bg-percpass-500 hover:opacity-80 active:scale-95 disabled:transition-opacity disabled:opacity-70 disabled:cursor-default disabled:active:scale-100"
            >
              Zarejestruj się
            </button>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}

export default RegisterModal

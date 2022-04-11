//import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { loginErrors } from '../../validations/signinValidations'

interface LoginEmailFormProps {
  formSwitch: boolean
  setFormSwitch: React.Dispatch<React.SetStateAction<boolean>>
  closeHandler: () => void
}

interface LoginEmailFormValues {
  loginEmail: string
}

const LoginEmailForm = (props: LoginEmailFormProps) => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginEmailFormValues>({ defaultValues: { loginEmail: '' } })

  const submitHandler: SubmitHandler<LoginEmailFormValues> = data => {
    console.log(data)
    props.setFormSwitch(!props.formSwitch)
  }

  return (
    <Transition
      as="form"
      className="absolute flex flex-col w-full max-w-md max-h-full px-5 py-4 -translate-y-1/2 bg-gray-100 rounded-lg shadow-md top-1/2"
      onSubmit={handleSubmit(submitHandler)}
      show={props.formSwitch}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="flex items-center justify-between w-full text-2xl text-gray-800">
        <h2 className="font-semibold">Logowanie</h2>
        <FaTimes
          className="transition cursor-pointer hover:text-gray-700 active:scale-95"
          onClick={() => props.closeHandler()}
        />
      </div>

      <div className="flex flex-col w-full my-4 overflow-y-auto">
        <div className="flex flex-col text-gray-800 md:mx-6">
          <label htmlFor="loginEmail">Email:</label>
          <input
            {...register('loginEmail', loginErrors.loginEmail)}
            id="loginEmail"
            type="text"
            placeholder="Podaj email"
            className="px-3 py-2 border rounded-lg border-percpass-400 focus:outline-percpass-400"
          />
        </div>
      </div>

      <div className="flex justify-center w-full mb-1">
        <button
          disabled={false}
          type="submit"
          className="px-4 py-2 text-white transition rounded-full bg-percpass-500 hover:opacity-80 active:scale-95 disabled:transition-opacity disabled:opacity-70 disabled:cursor-default disabled:active:scale-100"
        >
          Zaloguj się
        </button>
      </div>
    </Transition>
  )
}

interface LoginCodeFormProps {
  formSwitch: boolean
  setFormSwitch: React.Dispatch<React.SetStateAction<boolean>>
  closeHandler: () => void
}

interface LoginCodeFormValues {
  loginCode: string
}

const LoginCodeForm = (props: LoginCodeFormProps) => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginCodeFormValues>({ defaultValues: { loginCode: '' } })

  const submitHandler: SubmitHandler<LoginCodeFormValues> = data => {
    console.log(data)
    props.setFormSwitch(!props.formSwitch)
  }

  return (
    <Transition
      as="form"
      className="absolute flex flex-col w-full max-w-md max-h-full px-5 py-4 -translate-y-1/2 bg-gray-100 rounded-lg shadow-md top-1/2"
      onSubmit={handleSubmit(submitHandler)}
      show={!props.formSwitch}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="flex items-center justify-between w-full text-2xl text-gray-800">
        <h2 className="font-semibold">Logowanie</h2>
        <FaTimes
          className="transition cursor-pointer hover:text-gray-700 active:scale-95"
          onClick={() => props.closeHandler()}
        />
      </div>

      <div className="flex flex-col w-full my-4 overflow-y-auto">
        <div className="flex flex-col items-center text-gray-800 md:mx-6">
          <label htmlFor="loginCode" className="mb-1 w-36">
            Kod logowania:
          </label>
          <input
            {...register('loginCode', loginErrors.loginCode)}
            id="loginCode"
            type="text"
            placeholder="0000"
            className="pl-[1.37rem] pr-1 py-2 text-3xl tracking-[.4em] border rounded-lg w-36 border-percpass-400 focus:outline-percpass-400 confirmation-number-input"
          />

          <div className="mt-4 text-xs text-center text-gray-700">
            Kod logowania jest ważny przez <span className="font-semibold">15 minut</span>. Zaloguj się na swoje konto w
            przeciągu tego czasu.
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mb-1">
        <button
          disabled={false}
          type="submit"
          className="px-4 py-2 text-white transition rounded-full bg-percpass-500 hover:opacity-80 active:scale-95 disabled:transition-opacity disabled:opacity-70 disabled:cursor-default disabled:active:scale-100"
        >
          Potwierdź logowanie
        </button>
      </div>
    </Transition>
  )
}

export { LoginEmailForm, LoginCodeForm }

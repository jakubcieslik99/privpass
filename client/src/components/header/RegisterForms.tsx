//import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { registerErrors } from '../../validations/signinValidations'
import Error from '../universal/Error'

interface RegisterEmailFormProps {
  formSwitch: boolean
  setFormSwitch: React.Dispatch<React.SetStateAction<boolean>>
  closeHandler: () => void
}

interface RegisterEmailFormValues {
  registerEmail: string
}

const RegisterEmailForm = (props: RegisterEmailFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterEmailFormValues>({ defaultValues: { registerEmail: '' } })

  const submitHandler: SubmitHandler<RegisterEmailFormValues> = data => {
    console.log(data)
    props.setFormSwitch(!props.formSwitch)
    setTimeout(() => reset(), 200)
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
        <h2 className="font-semibold">Rejestracja</h2>
        <FaTimes
          className="transition cursor-pointer hover:text-gray-700 active:scale-95"
          onClick={() => props.closeHandler()}
        />
      </div>

      <div className="flex flex-col w-full my-4 overflow-y-auto">
        <div className="flex flex-col text-gray-800 md:mx-6">
          <label htmlFor="registerEmail">Email:</label>
          <input
            {...register('registerEmail', registerErrors.registerEmail)}
            id="registerEmail"
            type="text"
            placeholder="Podaj email"
            className="px-3 py-2 border rounded-lg border-percpass-400 focus:outline-percpass-400"
          />

          <div className="grid">
            <Error
              isOpen={errors.registerEmail?.type === 'required' ? true : false}
              message={registerErrors.registerEmail.required.message}
              styling="mt-1"
            />
            <Error
              isOpen={errors.registerEmail?.type === 'maxLength' ? true : false}
              message={registerErrors.registerEmail.maxLength.message}
              styling="mt-1"
            />
            <Error
              isOpen={errors.registerEmail?.type === 'pattern' ? true : false}
              message={registerErrors.registerEmail.pattern.message}
              styling="mt-1"
            />
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
    </Transition>
  )
}

interface RegisterCodeFormProps {
  formSwitch: boolean
  setFormSwitch: React.Dispatch<React.SetStateAction<boolean>>
  closeHandler: () => void
}

interface RegisterCodeFormValues {
  registerCode: string
}

const RegisterCodeForm = (props: RegisterCodeFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterCodeFormValues>({ defaultValues: { registerCode: '' } })

  const submitHandler: SubmitHandler<RegisterCodeFormValues> = data => {
    console.log(data)
    props.setFormSwitch(!props.formSwitch)
    setTimeout(() => reset(), 200)
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
        <h2 className="font-semibold">Rejestracja</h2>
        <FaTimes
          className="transition cursor-pointer hover:text-gray-700 active:scale-95"
          onClick={() => props.closeHandler()}
        />
      </div>

      <div className="flex flex-col w-full my-4 overflow-y-auto">
        <div className="flex flex-col items-center text-gray-800 md:mx-6">
          <label htmlFor="registerCode" className="mb-1 w-36">
            Kod rejestracji:
          </label>
          <input
            {...register('registerCode', registerErrors.registerCode)}
            id="registerCode"
            type="text"
            placeholder="0000"
            className="pl-[1.37rem] pr-1 py-2 text-3xl tracking-[.4em] border rounded-lg w-36 border-percpass-400 focus:outline-percpass-400 monospace-font"
          />

          <div className="grid">
            <Error
              isOpen={errors.registerCode?.type === 'required' ? true : false}
              message={registerErrors.registerCode.required.message}
              styling="mt-1"
            />
            <Error
              isOpen={errors.registerCode?.type === 'pattern' ? true : false}
              message={registerErrors.registerCode.pattern.message}
              styling="mt-1"
            />
          </div>

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
          Potwierdź rejestrację
        </button>
      </div>
    </Transition>
  )
}

export { RegisterEmailForm, RegisterCodeForm }

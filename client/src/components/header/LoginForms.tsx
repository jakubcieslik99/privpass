import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../../features/store'
import { loginSendCode, confirmCode, errorReset } from '../../features/userSlices/listUser'
import { emailSet } from '../../features/userSlices/storeEmail'
import { loginErrors } from '../../validations/signinValidations'
import Error from '../universal/Error'
import Success from '../universal/Success'
import { LocationProps } from '../../App'

interface LoginEmailFormProps {
  formSwitch: boolean
  setFormSwitch: React.Dispatch<React.SetStateAction<boolean>>
  closeHandler: () => void
}

interface LoginEmailFormValues {
  loginEmail: string
}

const LoginEmailForm = (props: LoginEmailFormProps) => {
  const { loading, success, successMessage, error, errorMessage } = useAppSelector(state => state.listUser)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginEmailFormValues>({ defaultValues: { loginEmail: '' } })

  useEffect(() => {
    if (success && successMessage === 'Teraz potwierdź logowanie otrzymanym na podany adres email kodem.') {
      errorMessage && dispatch(errorReset())
      props.setFormSwitch(!props.formSwitch)
      setTimeout(() => reset(), 200)
    }
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, successMessage])

  const submitHandler: SubmitHandler<LoginEmailFormValues> = data => {
    dispatch(loginSendCode({ email: data.loginEmail }))
    dispatch(emailSet(data.loginEmail))
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
        <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mb-4" />

        <div className="flex flex-col text-gray-800 md:mx-6">
          <label htmlFor="loginEmail">Email:</label>
          <input
            {...register('loginEmail', loginErrors.loginEmail)}
            id="loginEmail"
            type="text"
            placeholder="Podaj email"
            className="px-3 py-2 border rounded-lg border-percpass-400 focus:outline-percpass-400"
          />

          <div className="grid">
            <Error
              isOpen={errors.loginEmail?.type === 'required' ? true : false}
              message={loginErrors.loginEmail.required.message}
              styling="mt-1"
            />
            <Error
              isOpen={errors.loginEmail?.type === 'maxLength' ? true : false}
              message={loginErrors.loginEmail.maxLength.message}
              styling="mt-1"
            />
            <Error
              isOpen={errors.loginEmail?.type === 'pattern' ? true : false}
              message={loginErrors.loginEmail.pattern.message}
              styling="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mb-1">
        <button
          disabled={
            loading || (success && successMessage === 'Teraz potwierdź logowanie otrzymanym na podany adres email kodem.')
          }
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
  const { loading, success, successMessage, error, errorMessage } = useAppSelector(state => state.listUser)
  const { email } = useAppSelector(state => state.storeEmail)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginCodeFormValues>({ defaultValues: { loginCode: '' } })

  const navigate = useNavigate()
  const { state } = useLocation() as LocationProps
  const locationFrom = state?.from || '/profile'

  useEffect(() => {
    if (success && successMessage === 'Potwierdzenie kodem przebiegło pomyślnie. Nastąpi przekierowanie do profilu.') {
      setTimeout(() => {
        navigate(locationFrom, { replace: true })
        props.closeHandler()
        setTimeout(() => reset(), 200)
      }, 3000)
    }
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, successMessage])

  const submitHandler: SubmitHandler<LoginCodeFormValues> = data =>
    dispatch(confirmCode({ code: data.loginCode, email: email }))

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
        <Success isOpen={success && successMessage !== '' ? true : false} message={successMessage} styling="mb-4" />
        <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mb-4" />

        <div className="flex flex-col items-center text-gray-800 md:mx-6">
          <label htmlFor="loginCode" className="mb-1 w-36">
            Kod logowania:
          </label>
          <input
            {...register('loginCode', loginErrors.loginCode)}
            id="loginCode"
            type="text"
            placeholder="0000"
            className="pl-[1.37rem] pr-1 py-2 text-3xl tracking-[.4em] border rounded-lg w-36 border-percpass-400 focus:outline-percpass-400 monospace-font"
          />

          <div className="grid">
            <Error
              isOpen={errors.loginCode?.type === 'required' ? true : false}
              message={loginErrors.loginCode.required.message}
              styling="mt-1"
            />
            <Error
              isOpen={errors.loginCode?.type === 'pattern' ? true : false}
              message={loginErrors.loginCode.pattern.message}
              styling="mt-1"
            />
          </div>

          <div className="mt-4 text-xs text-center text-gray-700">
            Kod logowania jest ważny przez <span className="font-semibold">15 minut</span>. Zaloguj się na swoje konto w
            przeciągu tego czasu.
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mb-1">
        <button
          disabled={
            loading ||
            (success && successMessage === 'Potwierdzenie kodem przebiegło pomyślnie. Nastąpi przekierowanie do profilu.')
          }
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

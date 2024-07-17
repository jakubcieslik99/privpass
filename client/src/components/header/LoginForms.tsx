import React, { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnyAction } from 'redux'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../../features/store'
import { loginSendCode, confirmCode } from '../../features/userSlices/listUser'
import { emailSet } from '../../features/userSlices/storeEmail'
import { loginErrors } from '../../validations/signinValidations'
import Error from '../universal/Error'
import Success from '../universal/Success'
import Loader from '../universal/Loader'
import { LocationProps } from '../../App'
import { tr } from '../../translations/translations'

interface LoginEmailFormProps {
  formSwitch: boolean
  setFormSwitch: React.Dispatch<React.SetStateAction<boolean>>
  closeHandler: () => void
}

interface LoginEmailFormValues {
  loginEmail: string
}

const LoginEmailForm = (props: LoginEmailFormProps) => {
  //variables
  const { language } = useAppSelector(state => state.appSettings)
  const { loading, success, error, errorMessage } = useAppSelector(state => state.listUser)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginEmailFormValues>({ defaultValues: { loginEmail: '' } })

  //handlers
  const submitHandler: SubmitHandler<LoginEmailFormValues> = data => {
    dispatch(loginSendCode({ email: data.loginEmail }) as unknown as AnyAction)
      .unwrap()
      .then(() => {
        dispatch(emailSet(data.loginEmail))

        props.setFormSwitch(false)
        setTimeout(() => reset(), 200)
      })
      .catch((error: unknown) => error)
  }

  return (
    <Transition
      as="form"
      className="flex flex-col w-full col-start-1 row-start-1 px-5 py-4 overflow-hidden bg-gray-100 rounded-lg shadow-md"
      onSubmit={handleSubmit(submitHandler)}
      show={props.formSwitch}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/*modal header*/}
      <div className="flex items-center justify-between w-full text-2xl text-gray-800">
        <div className="flex items-center">
          <h2 className="font-semibold">{tr('loginFormsHeader', language)}</h2>
          <Loader isLoading={loading} styling="ml-2" />
        </div>

        <FaTimes
          className="transition cursor-pointer hover:text-gray-700 active:scale-95"
          onClick={() => !loading && props.closeHandler()}
        />
      </div>

      {/*modal body*/}
      <div className="flex flex-col w-full my-4 overflow-y-auto">
        <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mx-1 mb-4" />

        <div className="flex flex-col text-gray-800 md:mx-6">
          <label htmlFor="loginEmail" className="mx-1 text-left">
            Email:
          </label>
          <input
            {...register('loginEmail', loginErrors.loginEmail)}
            id="loginEmail"
            type="text"
            placeholder={tr('loginFormsEmailPlaceholder', language)}
            className="px-3 py-2 m-1 border rounded-lg border-privpass-400 focus:outline-privpass-400"
          />

          <div className="grid mx-1">
            <Error
              isOpen={errors.loginEmail?.type === 'required' ? true : false}
              message={tr(loginErrors.loginEmail.required.message, language)}
              styling="mt-1"
            />
            <Error
              isOpen={errors.loginEmail?.type === 'maxLength' ? true : false}
              message={tr(loginErrors.loginEmail.maxLength.message, language)}
              styling="mt-1"
            />
            <Error
              isOpen={errors.loginEmail?.type === 'pattern' ? true : false}
              message={tr(loginErrors.loginEmail.pattern.message, language)}
              styling="mt-1"
            />
          </div>
        </div>
      </div>

      {/*modal footer*/}
      <div className="flex justify-center w-full mb-1">
        <button
          disabled={loading || success}
          type="submit"
          className="px-4 py-2 text-white transition rounded-full bg-privpass-500 hover:opacity-80 active:scale-95 disabled:transition-opacity disabled:opacity-70 disabled:cursor-default disabled:active:scale-100"
        >
          {tr('loginFormsSubmit', language)}
        </button>
      </div>
    </Transition>
  )
}

interface LoginCodeFormProps {
  formSwitch: boolean
  setFormSwitch: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  closeHandler: () => void
}

interface LoginCodeFormValues {
  loginCode: string
}

const LoginCodeForm = (props: LoginCodeFormProps) => {
  //variables
  const isMounted = useRef(true)

  const { language } = useAppSelector(state => state.appSettings)
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

  //handlers
  const submitHandler: SubmitHandler<LoginCodeFormValues> = data => {
    dispatch(confirmCode({ code: data.loginCode, email: email }) as unknown as AnyAction)
      .unwrap()
      .then(() => {
        setTimeout(() => {
          if (isMounted.current) {
            props.closeHandler()
            navigate(locationFrom, { replace: true })
          }
          setTimeout(() => reset(), 200)
        }, 3000)
      })
      .catch((error: unknown) => error)
  }

  //useEffects
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [isMounted])

  return (
    <Transition
      as="form"
      className="flex flex-col w-full col-start-1 row-start-1 px-5 py-4 overflow-hidden bg-gray-100 rounded-lg shadow-md"
      onSubmit={handleSubmit(submitHandler)}
      show={!props.formSwitch}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/*modal header*/}
      <div className="flex items-center justify-between w-full text-2xl text-gray-800">
        <div className="flex items-center">
          <h2 className="font-semibold">{tr('loginFormsHeader', language)}</h2>
          <Loader isLoading={loading} styling="ml-2" />
        </div>

        <FaTimes
          className="transition cursor-pointer hover:text-gray-700 active:scale-95"
          onClick={() => !loading && props.closeHandler()}
        />
      </div>

      {/*modal body*/}
      <div className="flex flex-col w-full my-4 overflow-y-auto">
        <Success isOpen={success && successMessage !== '' ? true : false} message={successMessage} styling="mx-1 mb-4" />
        <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mx-1 mb-4" />

        <div className="flex flex-col items-center text-gray-800 md:mx-6">
          <label htmlFor="loginCode" className="mx-1 mb-1 w-36">
            {tr('loginFormsCode', language)}
          </label>
          <input
            {...register('loginCode', loginErrors.loginCode)}
            id="loginCode"
            type="text"
            autoComplete="off"
            placeholder="0000"
            className="pl-[1.37rem] pr-1 py-2 m-1 text-3xl tracking-[.4em] border rounded-lg w-36 border-privpass-400 focus:outline-privpass-400 monospace-font"
          />

          <div className="grid mx-1">
            <Error
              isOpen={errors.loginCode?.type === 'required' ? true : false}
              message={tr(loginErrors.loginCode.required.message, language)}
              styling="mt-1"
            />
            <Error
              isOpen={errors.loginCode?.type === 'pattern' ? true : false}
              message={tr(loginErrors.loginCode.pattern.message, language)}
              styling="mt-1"
            />
          </div>

          <div className="mt-4 text-xs text-center text-gray-700">
            {tr('loginFormsHint1', language)}
            <span className="font-semibold">{tr('loginFormsHint2', language)}</span>
            {tr('loginFormsHint3', language)}
          </div>
        </div>
      </div>

      {/*modal footer*/}
      <div className="flex justify-center w-full mb-1">
        <button
          disabled={
            loading ||
            (success && successMessage === 'Potwierdzenie kodem przebiegło pomyślnie. Nastąpi przekierowanie do profilu.')
          }
          type="submit"
          className="px-4 py-2 text-white transition rounded-full bg-privpass-500 hover:opacity-80 active:scale-95 disabled:transition-opacity disabled:opacity-70 disabled:cursor-default disabled:active:scale-100"
        >
          {tr('loginFormsSubmitConfirm', language)}
        </button>
      </div>
    </Transition>
  )
}

export { LoginEmailForm, LoginCodeForm }

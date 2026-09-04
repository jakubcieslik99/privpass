import React, { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { AnyAction } from 'redux'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../../features/store'
import { loginSendCode, confirmCode } from '../../features/userSlices/listUser'
import { emailSet } from '../../features/userSlices/storeEmail'
import { loginErrors } from '../../validations/signinValidations'
import Error from '../universal/Error'
import Success from '../universal/Success'
import Loader from '../universal/Loader'
import type { LocationProps } from '../../App'
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
  // variables
  const { language } = useAppSelector(state => state.appSettings)
  const { loading, success, error, errorMessage } = useAppSelector(state => state.listUser)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginEmailFormValues>({ defaultValues: { loginEmail: '' } })

  // handlers
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
      className="flex flex-col col-start-1 row-start-1 bg-gray-100 shadow-md px-5 py-4 rounded-lg w-full overflow-hidden"
      onSubmit={handleSubmit(submitHandler)}
      show={props.formSwitch}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/* modal header*/}
      <div className="flex justify-between items-center w-full text-gray-800 text-2xl">
        <div className="flex items-center">
          <h2 className="font-semibold">{tr('loginFormsHeader', language)}</h2>
          <Loader isLoading={loading} styling="ml-2" />
        </div>

        <FaTimes
          className="hover:text-gray-700 active:scale-95 transition cursor-pointer"
          onClick={() => !loading && props.closeHandler()}
        />
      </div>

      {/* modal body*/}
      <div className="flex flex-col my-4 w-full overflow-y-auto">
        <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mx-1 mb-4" />

        <div className="flex flex-col md:mx-6 text-gray-800">
          <label htmlFor="loginEmail" className="mx-1 text-left">
            Email:
          </label>
          <input
            {...register('loginEmail', loginErrors.loginEmail)}
            id="loginEmail"
            type="text"
            placeholder={tr('loginFormsEmailPlaceholder', language)}
            className="m-1 px-3 py-2 border border-privpass-400 rounded-lg focus:outline-privpass-400"
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

      {/* modal footer*/}
      <div className="flex justify-center mb-1 w-full">
        <button
          disabled={loading || success}
          type="submit"
          className="bg-privpass-500 hover:opacity-80 disabled:opacity-70 px-4 py-2 rounded-full text-white active:scale-95 disabled:active:scale-100 transition disabled:transition-opacity disabled:cursor-default"
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
  // variables
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

  // handlers
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

  // useEffects
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [isMounted])

  return (
    <Transition
      as="form"
      className="flex flex-col col-start-1 row-start-1 bg-gray-100 shadow-md px-5 py-4 rounded-lg w-full overflow-hidden"
      onSubmit={handleSubmit(submitHandler)}
      show={!props.formSwitch}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/* modal header*/}
      <div className="flex justify-between items-center w-full text-gray-800 text-2xl">
        <div className="flex items-center">
          <h2 className="font-semibold">{tr('loginFormsHeader', language)}</h2>
          <Loader isLoading={loading} styling="ml-2" />
        </div>

        <FaTimes
          className="hover:text-gray-700 active:scale-95 transition cursor-pointer"
          onClick={() => !loading && props.closeHandler()}
        />
      </div>

      {/* modal body*/}
      <div className="flex flex-col my-4 w-full overflow-y-auto">
        <Success isOpen={success && successMessage !== '' ? true : false} message={successMessage} styling="mx-1 mb-4" />
        <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mx-1 mb-4" />

        <div className="flex flex-col items-center md:mx-6 text-gray-800">
          <label htmlFor="loginCode" className="mx-1 mb-1 w-36">
            {tr('loginFormsCode', language)}
          </label>
          <input
            {...register('loginCode', loginErrors.loginCode)}
            id="loginCode"
            type="text"
            autoComplete="off"
            placeholder="0000"
            className="m-1 py-2 pr-1 pl-[1.37rem] border border-privpass-400 rounded-lg focus:outline-privpass-400 w-36 text-3xl tracking-[.4em] monospace-font"
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

          <div className="mt-4 text-gray-700 text-xs text-center">
            {tr('loginFormsHint1', language)}
            <span className="font-semibold">{tr('loginFormsHint2', language)}</span>
            {tr('loginFormsHint3', language)}
          </div>
        </div>
      </div>

      {/* modal footer*/}
      <div className="flex justify-center mb-1 w-full">
        <button
          disabled={loading || (success && successMessage.split(':')[0] === '200_2')}
          type="submit"
          className="bg-privpass-500 hover:opacity-80 disabled:opacity-70 px-4 py-2 rounded-full text-white active:scale-95 disabled:active:scale-100 transition disabled:transition-opacity disabled:cursor-default"
        >
          {tr('loginFormsSubmitConfirm', language)}
        </button>
      </div>
    </Transition>
  )
}

export { LoginEmailForm, LoginCodeForm }

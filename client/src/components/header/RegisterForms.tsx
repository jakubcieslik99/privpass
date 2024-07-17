import { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnyAction } from 'redux'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../../features/store'
import { registerSendCode, confirmCode } from '../../features/userSlices/listUser'
import { emailSet } from '../../features/userSlices/storeEmail'
import { registerErrors } from '../../validations/signinValidations'
import Error from '../universal/Error'
import Success from '../universal/Success'
import Loader from '../universal/Loader'
import { LocationProps } from '../../App'
import { tr } from '../../translations/translations'

interface RegisterEmailFormProps {
  formSwitch: boolean
  setFormSwitch: React.Dispatch<React.SetStateAction<boolean>>
  closeHandler: () => void
}

interface RegisterEmailFormValues {
  registerEmail: string
}

const RegisterEmailForm = (props: RegisterEmailFormProps) => {
  //variables
  const { language } = useAppSelector(state => state.appSettings)
  const { loading, success, error, errorMessage } = useAppSelector(state => state.listUser)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterEmailFormValues>({ defaultValues: { registerEmail: '' } })

  //handlers
  const submitHandler: SubmitHandler<RegisterEmailFormValues> = data => {
    dispatch(registerSendCode({ email: data.registerEmail }) as unknown as AnyAction)
      .unwrap()
      .then(() => {
        dispatch(emailSet(data.registerEmail))

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
          <h2 className="font-semibold">{tr('registerFormsHeader', language)}</h2>
          <Loader isLoading={loading} styling="ml-2" />
        </div>

        <FaTimes
          className="transition-colors cursor-pointer hover:text-gray-700 active:scale-95"
          onClick={() => !loading && props.closeHandler()}
        />
      </div>

      {/*modal body*/}
      <div className="flex flex-col w-full my-4 overflow-y-auto">
        <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mx-1 mb-4" />

        <div className="flex flex-col text-gray-800 md:mx-6">
          <label htmlFor="registerEmail" className="mx-1 text-left">
            Email:
          </label>
          <input
            {...register('registerEmail', registerErrors.registerEmail)}
            id="registerEmail"
            type="text"
            placeholder={tr('registerFormsEmailPlaceholder', language)}
            className="px-3 py-2 m-1 border rounded-lg border-privpass-400 focus:outline-privpass-400"
          />

          <div className="grid mx-1">
            <Error
              isOpen={errors.registerEmail?.type === 'required' ? true : false}
              message={tr(registerErrors.registerEmail.required.message, language)}
              styling="mt-1"
            />
            <Error
              isOpen={errors.registerEmail?.type === 'maxLength' ? true : false}
              message={tr(registerErrors.registerEmail.maxLength.message, language)}
              styling="mt-1"
            />
            <Error
              isOpen={errors.registerEmail?.type === 'pattern' ? true : false}
              message={tr(registerErrors.registerEmail.pattern.message, language)}
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
          {tr('registerFormsSubmit', language)}
        </button>
      </div>
    </Transition>
  )
}

interface RegisterCodeFormProps {
  formSwitch: boolean
  setFormSwitch: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  closeHandler: () => void
}

interface RegisterCodeFormValues {
  registerCode: string
}

const RegisterCodeForm = (props: RegisterCodeFormProps) => {
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
  } = useForm<RegisterCodeFormValues>({ defaultValues: { registerCode: '' } })

  const navigate = useNavigate()
  const { state } = useLocation() as LocationProps
  const locationFrom = state?.from || '/profile'

  //handlers
  const submitHandler: SubmitHandler<RegisterCodeFormValues> = data => {
    dispatch(confirmCode({ code: data.registerCode, email: email }) as unknown as AnyAction)
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
          <h2 className="font-semibold">{tr('registerFormsHeader', language)}</h2>
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
          <label htmlFor="registerCode" className="mx-1 mb-1 w-36">
            {tr('registerFormsCode', language)}
          </label>
          <input
            {...register('registerCode', registerErrors.registerCode)}
            id="registerCode"
            type="text"
            autoComplete="off"
            placeholder="0000"
            className="pl-[1.37rem] pr-1 py-2 m-1 text-3xl tracking-[.4em] border rounded-lg w-36 border-privpass-400 focus:outline-privpass-400 monospace-font"
          />

          <div className="grid mx-1">
            <Error
              isOpen={errors.registerCode?.type === 'required' ? true : false}
              message={tr(registerErrors.registerCode.required.message, language)}
              styling="mt-1"
            />
            <Error
              isOpen={errors.registerCode?.type === 'pattern' ? true : false}
              message={tr(registerErrors.registerCode.pattern.message, language)}
              styling="mt-1"
            />
          </div>

          <div className="mt-4 text-xs text-center text-gray-700">
            {tr('registerFormsHint1', language)}
            <span className="font-semibold">{tr('registerFormsHint2', language)}</span>
            {tr('registerFormsHint3', language)}
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
          {tr('registerFormsSubmitConfirm', language)}
        </button>
      </div>
    </Transition>
  )
}

export { RegisterEmailForm, RegisterCodeForm }

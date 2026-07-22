import { useRef, useEffect, Fragment } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AnyAction } from 'redux'
import { Transition, Dialog } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../../features/store'
import { deleteUserPassword, errorReset, successReset } from '../../features/passwordSlices/deleteUserPassword'
import { getUserPasswords } from '../../features/passwordSlices/getUserPasswords'
import Success from '../universal/Success'
import Error from '../universal/Error'
import Loader from '../universal/Loader'
import { tr } from '../../translations/translations'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  passwordToDelete: { id: string; name: string }
  setPasswordToDelete: React.Dispatch<React.SetStateAction<{ id: string; name: string }>>
}

const ConfirmDeleteModal = (props: ConfirmDeleteModalProps) => {
  // variables
  const isMounted = useRef(true)
  const getUserPasswordsAbort = useRef<(reason?: string | undefined) => void>(undefined)

  const { language } = useAppSelector(state => state.appSettings)
  const { loading, success, successMessage, error, errorMessage } = useAppSelector(state => state.deleteUserPassword)
  const dispatch = useAppDispatch()

  const [searchParams] = useSearchParams()

  // handlers
  const closeHandler = () => {
    props.setIsOpen(false)
    setTimeout(() => {
      if (isMounted.current) props.setPasswordToDelete({ id: '', name: '' })
      if (success) dispatch(successReset(null))
      if (error) dispatch(errorReset(null))
    }, 200)
  }

  const submitHandler = (event: React.SyntheticEvent<HTMLElement>) => {
    event.preventDefault()
    dispatch(deleteUserPassword({ id: props.passwordToDelete.id }) as unknown as AnyAction)
      .unwrap()
      .then(() => {
        if (isMounted.current) {
          const getUserPasswordsPromise = dispatch(
            getUserPasswords({
              searchKeyword: searchParams.get('searchKeyword') || '',
              sortOrder: searchParams.get('sortOrder') || 'atoz',
            }) as unknown as AnyAction,
          )
          getUserPasswordsAbort.current = getUserPasswordsPromise.abort
        } else {
          dispatch(successReset(null))
          dispatch(errorReset(null))
        }
      })
      .catch((error: unknown) => error)
  }

  // useEffects
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      if (getUserPasswordsAbort.current) {
        getUserPasswordsAbort.current()
        dispatch(successReset(null))
        dispatch(errorReset(null))
      }
    }
  }, [isMounted, getUserPasswordsAbort, dispatch])

  return (
    <Transition as={Fragment} appear show={props.isOpen}>
      <Dialog as="div" className="z-30 relative" onClose={() => !loading && closeHandler()}>
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
          <div className="flex justify-center items-center px-4 py-6 md:pt-16 md:pb-32 min-h-full text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                as="form"
                className="flex flex-col bg-gray-100 shadow-md px-5 py-4 rounded-lg w-full max-w-md overflow-hidden"
                onSubmit={submitHandler}
              >
                {/* modal header*/}
                <Dialog.Title className="flex justify-between items-center w-full text-gray-800 text-2xl">
                  <div className="flex items-center">
                    <h2 className="font-semibold">{tr('confirmDelModalHeader', language)}</h2>
                    <Loader isLoading={loading} styling="ml-2" />
                  </div>

                  <FaTimes
                    className="hover:text-gray-700 active:scale-95 transition cursor-pointer"
                    onClick={() => !loading && closeHandler()}
                  />
                </Dialog.Title>

                {/* modal body*/}
                <div className="flex flex-col my-4 w-full">
                  <Success
                    isOpen={success && successMessage !== '' ? true : false}
                    message={successMessage}
                    styling="mx-1 mb-4"
                  />
                  <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mx-1 mb-4" />

                  <p className="mb-2 text-gray-800 text-lg text-center break-words">
                    {tr('confirmDelModalMessage1', language)}
                    <b>{props.passwordToDelete.name}</b>?
                  </p>

                  <p className="mb-2 text-gray-600 text-sm text-center break-words">
                    {tr('confirmDelModalMessage2', language)}
                  </p>
                </div>

                {/* modal footer*/}
                <div className="relative flex justify-center mb-1 w-full h-10">
                  <Transition
                    className="absolute flex"
                    show={!success}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <button
                      disabled={loading}
                      type="submit"
                      className="bg-red-400 hover:opacity-80 disabled:opacity-70 mr-2 px-4 py-2 rounded-full text-white active:scale-95 disabled:active:scale-100 transition disabled:transition-opacity disabled:cursor-default"
                    >
                      {tr('confirmDelModalSubmit', language)}
                    </button>
                    <button
                      disabled={loading}
                      type="button"
                      className="bg-privpass-400 hover:opacity-80 disabled:opacity-70 px-4 py-2 rounded-full text-white active:scale-95 disabled:active:scale-100 transition disabled:transition-opacity disabled:cursor-default"
                      onClick={closeHandler}
                    >
                      {tr('confirmDelModalCancel', language)}
                    </button>
                  </Transition>

                  <Transition
                    className="absolute flex"
                    show={success}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <button
                      type="button"
                      className="bg-privpass-400 hover:opacity-80 px-4 py-2 rounded-full text-white active:scale-95 transition"
                      onClick={closeHandler}
                    >
                      {tr('confirmDelModalClose', language)}
                    </button>
                  </Transition>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConfirmDeleteModal

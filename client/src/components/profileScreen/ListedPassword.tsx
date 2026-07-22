import { useRef, useState, useEffect } from 'react'
import type { AnyAction } from 'redux'
import { Transition } from '@headlessui/react'
import { RiHashtag, RiLockPasswordFill } from 'react-icons/ri'
import { FaEye, FaEyeSlash, FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../../features/store'
import { getUserPassword, idPasswordReset } from '../../features/passwordSlices/getUserPassword'
import { tr } from '../../translations/translations'

export interface ListedPasswordObject {
  _id: string
  name: string
}
interface ListedPasswordProps {
  listedPassword: ListedPasswordObject
  setEditPasswordModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setPasswordToEdit: React.Dispatch<React.SetStateAction<{ id: string; name: string; password: string }>>
  confirmDeleteModalIsOpen: boolean
  setConfirmDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setPasswordToDelete: React.Dispatch<React.SetStateAction<{ id: string; name: string }>>
}

const ListedPassword = (props: ListedPasswordProps) => {
  // variables
  const getUserPasswordAbort1 = useRef<(reason?: string | undefined) => void>(undefined)
  const getUserPasswordAbort2 = useRef<(reason?: string | undefined) => void>(undefined)

  const { language } = useAppSelector(state => state.appSettings)
  const { loading } = useAppSelector(state => state.getUserPasswords)
  const { loading: loading2 } = useAppSelector(state => state.getUserPassword)
  const dispatch = useAppDispatch()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordString, setPasswordString] = useState('')

  // handlers
  const showPasswordHandler = () => {
    if (!passwordVisible) {
      const getUserPasswordPromise = dispatch(getUserPassword({ id: props.listedPassword._id }) as unknown as AnyAction)
      getUserPasswordAbort1.current = getUserPasswordPromise.abort
      getUserPasswordPromise
        .unwrap()

        .then((payload: any) => {
          setPasswordString(payload.password)
          setPasswordVisible(true)
          dispatch(idPasswordReset(null))
        })
        .catch((error: unknown) => error)
    } else {
      setPasswordVisible(false)
      setPasswordString('')
    }
  }

  const openEditPasswordModalHandler = () => {
    const getUserPasswordPromise = dispatch(getUserPassword({ id: props.listedPassword._id }) as unknown as AnyAction)
    getUserPasswordAbort2.current = getUserPasswordPromise.abort
    getUserPasswordPromise
      .unwrap()

      .then((payload: any) => {
        props.setPasswordToEdit({ id: payload._id, name: props.listedPassword.name, password: payload.password })
        props.setEditPasswordModalIsOpen(true)
        dispatch(idPasswordReset(null))
      })
      .catch((error: unknown) => error)
  }

  const openConfirmDeleteModalHandler = () => {
    props.setPasswordToDelete({ id: props.listedPassword._id, name: props.listedPassword.name })
    props.setConfirmDeleteModalIsOpen(true)
  }

  // useEffects
  useEffect(() => {
    return () => {
      if (getUserPasswordAbort1.current) getUserPasswordAbort1.current()
      if (getUserPasswordAbort2.current) getUserPasswordAbort2.current()
    }
  }, [getUserPasswordAbort1, getUserPasswordAbort2])

  return (
    <div className="flex md:flex-row flex-col justify-between bg-privpass-400 shadow-md px-3 pt-2 pb-3 md:pb-2 rounded-2xl">
      <div className="flex-1 md:mr-4 mb-2 md:mb-0 min-w-0">
        <div className="mb-2">
          <div className="flex items-center text-xs">
            <RiHashtag className="mr-[2px]" />
            {tr('listedPassNameLabel', language)}
          </div>
          <div className="font-semibold text-xl truncate">{props.listedPassword.name}</div>
        </div>

        <div className="md:mb-[-8px]">
          <div className="flex items-center mb-[-7px] text-xs">
            <RiLockPasswordFill className="mr-[2px]" />
            {tr('listedPassPasswordLabel', language)}
          </div>

          <div className="flex items-center text-lg">
            <button
              disabled={loading || loading2}
              className="relative flex-none mr-2 p-2 border border-privpass-200 hover:border-privpass-100 disabled:hover:border-privpass-200 rounded-full w-8 h-8 text-privpass-200 hover:text-privpass-100 disabled:hover:text-privpass-200 active:scale-95 disabled:active:scale-100 transition disabled:cursor-default"
              onClick={showPasswordHandler}
            >
              <FaEye
                className={`absolute left-[6px] top-[6px] transition-opacity ${
                  !passwordVisible ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <FaEyeSlash
                className={`absolute left-[6px] top-[6px] transition-opacity ${
                  passwordVisible ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
            <div className="relative w-full h-14 overflow-x-scroll overflow-y-hidden">
              <Transition
                className="top-0 left-0 absolute pt-[17px] h-14 text-2xl"
                show={!passwordVisible}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {'****************'}
              </Transition>
              <Transition
                className="top-0 left-0 absolute pt-[14px] pb-[6px] h-14 tracking-widest select-all monospace-font"
                show={passwordVisible}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {passwordString}
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:flex-col md:justify-center md:mr-3">
        <button
          disabled={loading || loading2}
          className="flex justify-center items-center bg-cyan-500 hover:bg-cyan-400 disabled:hover:bg-cyan-500 mr-2 md:mr-0 md:mb-2 px-4 py-2 rounded-full w-24 text-sm active:scale-95 disabled:active:scale-100 transition disabled:cursor-default"
          onClick={openEditPasswordModalHandler}
        >
          <FaEdit className="mr-2" />
          {tr('listedPassEdit', language)}
        </button>

        <button
          disabled={loading || loading2}
          className="flex justify-center items-center bg-red-400 hover:bg-red-300 disabled:hover:bg-red-400 px-4 py-2 rounded-full w-24 text-sm active:scale-95 disabled:active:scale-100 transition disabled:cursor-default"
          onClick={openConfirmDeleteModalHandler}
        >
          <FaTrashAlt className="mr-2" />
          {tr('listedPassDelete', language)}
        </button>
      </div>
    </div>
  )
}

export default ListedPassword

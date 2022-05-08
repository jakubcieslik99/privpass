import { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { RiHashtag, RiLockPasswordFill } from 'react-icons/ri'
import { FaEye, FaEyeSlash, FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../../features/store'
import { getUserPassword, idPasswordReset } from '../../features/passwordSlices/getUserPassword'

export interface ListedPasswordObject {
  _id: string
  name: string
  password: string
}
interface ListedPasswordProps {
  listedPassword: ListedPasswordObject
  setEditPasswordModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setConfirmDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setPasswordToEdit: React.Dispatch<React.SetStateAction<string>>
  setPasswordToDelete: React.Dispatch<React.SetStateAction<{ id: string; name: string }>>
}

const ListedPassword = (props: ListedPasswordProps) => {
  const { id, password } = useAppSelector(state => state.getUserPassword)
  const dispatch = useAppDispatch()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordString, setPasswordString] = useState('')

  useEffect(() => {
    if (id === props.listedPassword._id && password !== '') {
      setPasswordString(password)
      setPasswordVisible(true)
      dispatch(idPasswordReset())
    }
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, password])

  const openEditPasswordModalHandler = () => {
    props.setPasswordToEdit('507f191e810c19729de860ea')
    props.setEditPasswordModalIsOpen(true)
  }

  const openConfirmDeleteModalHandler = () => {
    props.setPasswordToDelete({
      id: '507f191e810c19729de860ea',
      name: 'OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO',
    })
    props.setConfirmDeleteModalIsOpen(true)
  }

  const showPasswordHandler = () => {
    if (!passwordVisible) dispatch(getUserPassword({ id: props.listedPassword._id }))
    else {
      setPasswordVisible(false)
      setPasswordString('')
    }
  }

  return (
    <div className="flex flex-col justify-between px-3 pt-2 pb-3 shadow-md md:pb-2 rounded-2xl bg-percpass-400 md:flex-row">
      <div className="flex-1 min-w-0 mb-2 md:mr-4 md:mb-0">
        <div className="mb-2">
          <div className="flex items-center text-xs">
            <RiHashtag className="mr-[2px]" />
            Nazwa:
          </div>
          <div className="text-xl font-semibold truncate">{props.listedPassword.name}</div>
        </div>

        <div className="md:mb-[-8px]">
          <div className="text-xs mb-[-7px] flex items-center">
            <RiLockPasswordFill className="mr-[2px]" />
            Hasło:
          </div>

          <div className="flex items-center text-lg">
            <button
              className="relative flex-none w-8 h-8 p-2 mr-2 transition border rounded-full text-percpass-200 border-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95"
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
            <div className="relative w-full overflow-x-scroll overflow-y-hidden h-14">
              <Transition
                className="absolute top-0 left-0 pt-[17px] text-2xl h-14"
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
                className="absolute top-0 left-0 h-14 pt-[14px] pb-[6px] select-all tracking-widest monospace-font"
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
          className="flex items-center justify-center w-24 px-4 py-2 mr-2 text-sm transition rounded-full md:mr-0 md:mb-2 bg-cyan-500 hover:bg-cyan-400 active:scale-95"
          onClick={() => openEditPasswordModalHandler()}
        >
          <FaEdit className="mr-2" />
          Edytuj
        </button>

        <button
          className="flex items-center justify-center w-24 px-4 py-2 text-sm transition bg-red-400 rounded-full hover:bg-red-300 active:scale-95"
          onClick={() => openConfirmDeleteModalHandler()}
        >
          <FaTrashAlt className="mr-2" />
          Usuń
        </button>
      </div>
    </div>
  )
}

export default ListedPassword

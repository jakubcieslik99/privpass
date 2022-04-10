import { useState } from 'react'
import { Transition } from '@headlessui/react'
import { RiHashtag, RiLockPasswordFill } from 'react-icons/ri'
import { FaEye, FaEyeSlash, FaEdit, FaTrashAlt } from 'react-icons/fa'

const ListedPassword: React.FC = () => {
  const [passwordShown, setPasswordShown] = useState(false)

  return (
    <div className="flex flex-col justify-between px-3 pt-2 pb-3 shadow-md md:pb-2 rounded-2xl bg-percpass-400 md:flex-row">
      <div className="flex-1 min-w-0 mb-2 md:mr-4 md:mb-0">
        <div className="mb-2">
          <div className="flex items-center text-xs">
            <RiHashtag className="mr-[2px]" />
            Nazwa:
          </div>
          <div className="text-xl font-semibold truncate">OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO</div>
        </div>

        <div className="md:mb-[-8px]">
          <div className="text-xs mb-[-7px] flex items-center">
            <RiLockPasswordFill className="mr-[2px]" />
            Hasło:
          </div>

          <div className="flex items-center text-lg">
            <button
              className="relative flex-none w-8 h-8 p-2 mr-2 transition border rounded-full text-percpass-200 border-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95"
              onClick={() => setPasswordShown(!passwordShown)}
            >
              <FaEye
                className={`absolute left-[6px] top-[6px] transition-opacity ${
                  !passwordShown ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <FaEyeSlash
                className={`absolute left-[6px] top-[6px] transition-opacity ${passwordShown ? 'opacity-100' : 'opacity-0'}`}
              />
            </button>
            <div className="relative w-full overflow-x-scroll overflow-y-hidden h-14">
              <Transition
                className="absolute top-0 left-0 pt-4 text-2xl select-all h-14"
                show={!passwordShown}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {'**************************************************'}
              </Transition>
              <Transition
                className="absolute top-0 left-0 h-14 pt-[14px] pb-[6px] select-all"
                show={passwordShown}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {'OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO'}
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:flex-col md:justify-center md:mr-3">
        <button
          className="flex items-center justify-center w-24 px-4 py-2 mr-2 text-sm transition rounded-full md:mr-0 md:mb-2 bg-cyan-500 hover:bg-cyan-400 active:scale-95"
          onClick={() => console.log('edit')}
        >
          <FaEdit className="mr-2" />
          Edytuj
        </button>

        <button
          className="flex items-center justify-center w-24 px-4 py-2 text-sm transition bg-red-400 rounded-full hover:bg-red-300 active:scale-95"
          onClick={() => console.log('delete')}
        >
          <FaTrashAlt className="mr-2" />
          Usuń
        </button>
      </div>
    </div>
  )
}

export default ListedPassword

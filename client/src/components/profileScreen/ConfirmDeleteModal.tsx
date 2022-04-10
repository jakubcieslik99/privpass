import { useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { FaTimes } from 'react-icons/fa'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  passwordToDelete: { id: string; name: string }
  setPasswordToDelete: React.Dispatch<React.SetStateAction<{ id: string; name: string }>>
}

const ConfirmDeleteModal = (props: ConfirmDeleteModalProps) => {
  useEffect(() => {
    if (props.isOpen) document.body.classList.add('noscroll')
    return () => {}
  }, [props.isOpen])

  const closeHandler = () => {
    props.setIsOpen(false)
    setTimeout(() => props.setPasswordToDelete({ id: '', name: '' }), 200)
    document.body.classList.remove('noscroll')
  }

  const submitHandler = (event: React.SyntheticEvent<HTMLElement>) => {
    event.preventDefault()
    console.log('delete: ' + props.passwordToDelete.id)
  }

  return (
    <Transition className="fixed inset-0 z-30" show={props.isOpen}>
      <Transition.Child
        className="fixed inset-0 bg-black bg-opacity-60"
        /*onClick={() => closeHandler()}*/ //close on background click
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <FaTimes
          className={`fixed hidden text-3xl text-gray-400 transition cursor-pointer right-3 top-3 hover:text-gray-300 active:scale-95 ${'md:hidden'}`}
          onClick={() => closeHandler()}
        />
      </Transition.Child>

      <div
        className="fixed inset-0 flex items-center justify-center mx-4 my-6 md:mt-16 md:mb-32"
        /*onClick={(e: any) => (e.target === e.currentTarget ? closeHandler() : undefined)}*/ //close on background click
      >
        <Transition.Child
          as="form"
          className="flex flex-col w-full max-w-md max-h-full px-5 py-4 bg-gray-100 rounded-lg shadow-md"
          onSubmit={submitHandler}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="flex items-center justify-between w-full text-2xl text-gray-800">
            <h2 className="font-semibold">Usuwanie</h2>
            <FaTimes
              className="transition cursor-pointer hover:text-gray-700 active:scale-95"
              onClick={() => closeHandler()}
            />
          </div>

          <div className="flex flex-col w-full my-4">
            <p className="mb-2 text-lg text-center text-gray-800 break-words">
              Czy na pewno chcesz usunąć hasło o nazwie: <b>{props.passwordToDelete.name}</b>?
            </p>

            <p className="mb-2 text-sm text-center text-gray-600 break-words">
              Zapisane hasło zostanie całkowicie usunięte z bazy danych, a jego przywrócenie nie będzie możliwe.
            </p>
          </div>

          <div className="flex justify-center w-full mb-1">
            <button
              disabled={false}
              type="submit"
              className="px-4 py-2 mr-2 text-white transition bg-red-400 rounded-full hover:opacity-80 active:scale-95 disabled:transition-opacity disabled:opacity-70 disabled:cursor-default disabled:active:scale-100"
            >
              Usuń
            </button>
            <button
              className="px-4 py-2 text-white transition rounded-full bg-percpass-400 hover:opacity-80 active:scale-95"
              onClick={() => closeHandler()}
            >
              Anuluj
            </button>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}

export default ConfirmDeleteModal

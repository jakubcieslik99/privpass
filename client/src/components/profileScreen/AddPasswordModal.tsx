import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Transition } from '@headlessui/react'
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'
import { addPasswordErrors } from '../../validations/passwordValidations'

interface AddPasswordModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface AddPasswordFormValues {
  addName: string
  addPassword: string
}

const AddPasswordModal = (props: AddPasswordModalProps) => {
  const [passwordToShow, setPasswordToShow] = useState(false)

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<AddPasswordFormValues>({
    defaultValues: {
      addName: '',
      addPassword: '',
    },
  })

  useEffect(() => {
    if (props.isOpen) document.body.classList.add('noscroll')
    return () => {}
  }, [props.isOpen])

  //temporary
  useEffect(() => {
    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      console.log(errors.addName)
      console.log(errors.addPassword)
    }
  }, [errors])

  const closeHandler = () => {
    props.setIsOpen(false)
    setTimeout(() => {
      setValue('addName', '')
      setValue('addPassword', '')
      setPasswordToShow(false)
    }, 200)
    document.body.classList.remove('noscroll')
  }

  const submitHandler: SubmitHandler<AddPasswordFormValues> = data => {
    console.log(data)
  }

  return (
    <Transition className="fixed inset-0 z-30" show={props.isOpen}>
      <Transition.Child
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={() => closeHandler()}
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
        onClick={(e: any) => (e.target === e.currentTarget ? closeHandler() : null)}
      >
        <Transition.Child
          as="form"
          className="flex flex-col w-full max-w-md max-h-full px-5 py-4 bg-gray-100 rounded-lg shadow-md"
          onSubmit={handleSubmit(submitHandler)}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="flex items-center justify-between w-full text-2xl text-gray-800">
            <h2 className="font-semibold">Dodawanie hasła</h2>
            <FaTimes
              className="transition cursor-pointer hover:text-gray-700 active:scale-95"
              onClick={() => closeHandler()}
            />
          </div>

          <div className="flex flex-col w-full mt-4 mb-5 overflow-y-auto">
            <div className="flex flex-col text-gray-800 md:mx-6">
              <label htmlFor="addName">Nazwa:</label>
              <input
                {...register('addName', addPasswordErrors.addName)}
                id="addName"
                type="text"
                placeholder="Podaj nazwę"
                className="px-3 py-2 border rounded-lg border-percpass-400 focus:outline-percpass-400"
              />
            </div>

            <div className="relative flex flex-col mt-3 text-gray-800 md:mx-6">
              <label htmlFor="addPassword">Hasło:</label>
              <div className="flex items-center">
                <input
                  {...register('addPassword', addPasswordErrors.addPassword)}
                  id="addPassword"
                  type={passwordToShow ? 'text' : 'password'}
                  placeholder="Podaj hasło"
                  className="w-full px-3 py-2 mr-2 border rounded-lg border-percpass-400 focus:outline-percpass-400"
                />
                <button
                  type="button"
                  className="relative flex-none p-2 text-xl transition bg-white border rounded-full w-9 h-9 text-percpass-400 border-percpass-400 hover:border-percpass-400/80 hover:text-percpass-400/80 active:scale-95"
                  onClick={() => setPasswordToShow(!passwordToShow)}
                >
                  <FaEye
                    className={`absolute left-[7px] top-[7px] transition-opacity ${
                      !passwordToShow ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <FaEyeSlash
                    className={`absolute left-[7px] top-[7px] transition-opacity ${
                      passwordToShow ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full mb-1">
            <button
              disabled={false}
              type="submit"
              className="px-4 py-2 text-white transition rounded-full bg-percpass-400 hover:opacity-80 active:scale-95 disabled:transition-opacity disabled:opacity-70 disabled:cursor-default disabled:active:scale-100"
            >
              Dodaj
            </button>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}

export default AddPasswordModal

import { useRef, Fragment } from 'react'
import { Transition, Dialog } from '@headlessui/react'

interface LoginModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginModal = (props: LoginModalProps) => {
  const contentRef = useRef(null)

  return (
    <Transition as={Fragment} show={props.isOpen}>
      <Dialog
        className="fixed inset-0 z-10 min-h-screen px-4 overflow-y-auto text-center"
        onClose={() => props.setIsOpen(false)}
      >
        <Transition.Child>
          <Dialog.Overlay className="fixed inset-0" />
        </Transition.Child>

        <Transition.Child>
          <div className="inline-block w-full max-w-xl p-6 mt-8 mb-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl md:mt-20 rounded-3xl">
            <div>Data</div>
            <button ref={contentRef} className="px-2 py-1 text-white rounded bg-percpass-400">
              OK
            </button>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default LoginModal

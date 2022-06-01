import { Transition } from '@headlessui/react'

interface ErrorProps {
  isOpen: boolean
  message: string
  styling?: string
}

const Error = (props: ErrorProps) => {
  return (
    <Transition
      id="error"
      className={`text-left ${props.styling && props.styling}`}
      show={props.isOpen}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {props.message}
    </Transition>
  )
}

export default Error

import { Transition } from '@headlessui/react'

interface SuccessProps {
  isOpen: boolean
  message: string
  styling?: string
}

const Success = (props: SuccessProps) => {
  return (
    <Transition
      id="success"
      className={props.styling && props.styling}
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

export default Success

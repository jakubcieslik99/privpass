import { Transition } from '@headlessui/react'
import { useAppSelector } from '../../features/store'
import { tr } from '../../translations/translations'

interface ErrorProps {
  isOpen: boolean
  message: string
  styling?: string
}

const Error = (props: ErrorProps) => {
  //variables
  const { language } = useAppSelector(state => state.appSettings)

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
      {props.message.includes('_', 3) ? tr(props.message.split(':')[0], language) : props.message}
    </Transition>
  )
}

export default Error

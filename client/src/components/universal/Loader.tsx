import { ImSpinner2 } from 'react-icons/im'

interface LoaderProps {
  isLoading: boolean
  styling?: string
}

const Loader = (props: LoaderProps) => {
  return (
    <div
      className={`
        transition-opacity ease-in-out duration-200 
        ${props.isLoading ? 'opacity-100' : 'opacity-0'} 
        ${props.styling && props.styling}
      `}
    >
      <ImSpinner2 className="animate-spin" />
    </div>
  )
}

export default Loader

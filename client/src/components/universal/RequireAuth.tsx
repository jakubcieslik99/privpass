import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../features/store'

const RequireAuth: React.FC = () => {
  const { userInfo } = useAppSelector(state => state.listUser)

  const { pathname } = useLocation()

  return userInfo ? <Outlet /> : <Navigate to="/" state={{ from: pathname, loginModalIsOpen: true }} replace />
}

export default RequireAuth

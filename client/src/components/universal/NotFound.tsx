import { useAppSelector } from '../../features/store'
import Notfound from '../../assets/notfound.png'
import { tr } from '../../translations/translations'

const NotFound = () => {
  //variables
  const { language } = useAppSelector(state => state.appSettings)

  return (
    <main className="flex flex-col items-center justify-center gradient-primary app-screen">
      <img src={Notfound} alt="404" />
      <div className="my-5 text-xl">{tr('notFoundMessage', language)}</div>
    </main>
  )
}

export default NotFound

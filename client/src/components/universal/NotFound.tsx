import Notfound from '../../assets/notfound.png'

const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center gradient-primary app-screen">
      <img src={Notfound} alt="404" />
      <div className="my-5 text-xl">Tutaj nic nie ma!</div>
    </main>
  )
}

export default NotFound

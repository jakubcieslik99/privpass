import { FaSearch } from 'react-icons/fa'
import ListedPassword from '../components/profileScreen/ListedPassword'

const ProfileScreen: React.FC = () => {
  return (
    <main className="app-screen">
      <div className="grid gap-3 px-3 py-9 app-container md:grid-cols-7">
        <div className="md:col-span-2 md:order-2">
          <div className="px-3 py-2 rounded-md shadow-md bg-percpass-400">
            <h2 className="mb-3 text-xl">Narzędzia:</h2>

            <div className="">
              <input
                type="text"
                placeholder="Szukaj"
                className="w-auto px-3 py-2 mr-2 text-gray-800 transition border rounded-full"
              />
              <button className="px-3 py-2 transition border rounded-full border-percpass-200 text-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95 text-md">
                <FaSearch />
              </button>
            </div>

            <div className="">
              <input type="select" />
            </div>

            <div className="">
              <button className="px-3 py-2 transition border rounded-full border-percpass-200 text-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95 text-md">
                Dodaj nowe hasło
              </button>
            </div>
          </div>
        </div>
        <div className="md:col-span-5 md:order-1">
          <div className="px-3 py-2 rounded-md shadow-md bg-percpass-400">
            <h2 className="mb-3 text-xl">Twoje hasła:</h2>

            <ListedPassword />
            <ListedPassword />
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfileScreen

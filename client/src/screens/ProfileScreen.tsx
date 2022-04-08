import { FaTools, FaShareAlt, FaSearch, FaPlus } from 'react-icons/fa'
import ListedPassword from '../components/profileScreen/ListedPassword'

const ProfileScreen: React.FC = () => {
  return (
    <main className="app-screen">
      <div className="grid gap-3 px-3 py-9 app-container md:grid-cols-7">
        <div className="md:col-span-2 md:order-2">
          <div className="px-4 pt-3 pb-5 rounded-md shadow-lg bg-percpass-500">
            <h2 className="flex items-center mb-4 text-xl">
              <FaTools className="mr-2 text-2xl" />
              Narzędzia:
            </h2>

            <div className="mb-4">
              <div className="mb-1 ml-3 text-xs">Wyszukiwanie:</div>

              <div className="flex">
                <input
                  type="text"
                  placeholder="Szukaj"
                  className="w-full px-4 py-2 mr-2 text-gray-800 transition border-none rounded-full focus:outline-none"
                />
                <button className="px-3 py-2 transition border rounded-full border-percpass-200 text-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95 text-md">
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-1 ml-3 text-xs">Sortowanie:</div>

              <select
                className="w-full px-3 py-2 text-gray-800 transition border-none rounded-full cursor-pointer focus:outline-none"
                defaultValue="1"
              >
                <option value="atoz">Alfabetycznie (A-Z)</option>
                <option value="ztoa">Alfabetycznie (Z-A)</option>
                <option value="newest">Od najnowszych</option>
                <option value="oldest">Od najstarszych</option>
              </select>
            </div>

            <div className="">
              <div className="mb-1 ml-3 text-xs">Dodawanie:</div>

              <button className="flex items-center px-3 py-2 transition border rounded-full border-percpass-200 text-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95 text-md">
                <FaPlus className="mr-2" />
                Dodaj nowe hasło
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 md:order-1">
          <div className="px-4 pt-3 pb-5 rounded-md shadow-lg bg-percpass-500">
            <h2 className="flex items-center mb-5 text-xl">
              <FaShareAlt className="mr-2 text-2xl" />
              Twoje hasła:
            </h2>

            <div className="flex flex-col gap-3">
              <ListedPassword />
              <ListedPassword />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfileScreen

import { useState } from 'react'
import { FaTools, FaShareAlt, FaSearch, FaPlus } from 'react-icons/fa'
import ListedPassword from '../components/profileScreen/ListedPassword'
import AddPasswordModal from '../components/profileScreen/AddPasswordModal'
import EditPasswordModal from '../components/profileScreen/EditPasswordModal'
import ConfirmDeleteModal from '../components/profileScreen/ConfirmDeleteModal'

const ProfileScreen: React.FC = () => {
  const [addPasswordModalIsOpen, setAddPasswordModallIsOpen] = useState(false)
  const [editPasswordModalIsOpen, setEditPasswordModalIsOpen] = useState(false)
  const [confirmDeleteModalIsOpen, setConfirmDeleteModallIsOpen] = useState(false)
  const [passwordToEdit, setPasswordToEdit] = useState('')
  const [passwordToDelete, setPasswordToDelete] = useState({ id: '', name: '' })

  return (
    <main className="app-screen">
      <div className="grid gap-3 px-3 py-9 app-container md:grid-cols-3 lg:grid-cols-4">
        <div className="md:order-2">
          <div className="px-4 pt-3 pb-5 shadow-lg rounded-xl bg-percpass-500">
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

            <div>
              <div className="mb-1 ml-3 text-xs">Dodawanie:</div>
              <button
                className="flex items-center px-3 py-2 transition border rounded-full border-percpass-200 text-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95 text-md"
                onClick={() => setAddPasswordModallIsOpen(true)}
              >
                <FaPlus className="mr-2" />
                Dodaj nowe hasło
              </button>
            </div>
          </div>
        </div>

        <div className="block overflow-hidden md:col-span-2 lg:col-span-3 md:order-1">
          <div className="px-4 pt-3 pb-5 shadow-lg rounded-xl bg-percpass-500">
            <h2 className="flex items-center mb-5 text-xl">
              <FaShareAlt className="mr-2 text-2xl" />
              Twoje hasła:
            </h2>

            <div className="flex flex-col gap-3">
              <ListedPassword
                setEditPasswordModalIsOpen={setEditPasswordModalIsOpen}
                setConfirmDeleteModalIsOpen={setConfirmDeleteModallIsOpen}
                setPasswordToEdit={setPasswordToEdit}
                setPasswordToDelete={setPasswordToDelete}
              />
              <ListedPassword
                setEditPasswordModalIsOpen={setEditPasswordModalIsOpen}
                setConfirmDeleteModalIsOpen={setConfirmDeleteModallIsOpen}
                setPasswordToEdit={setPasswordToEdit}
                setPasswordToDelete={setPasswordToDelete}
              />
              <ListedPassword
                setEditPasswordModalIsOpen={setEditPasswordModalIsOpen}
                setConfirmDeleteModalIsOpen={setConfirmDeleteModallIsOpen}
                setPasswordToEdit={setPasswordToEdit}
                setPasswordToDelete={setPasswordToDelete}
              />
            </div>
          </div>
        </div>
      </div>

      <AddPasswordModal isOpen={addPasswordModalIsOpen} setIsOpen={setAddPasswordModallIsOpen} />
      <EditPasswordModal
        isOpen={editPasswordModalIsOpen}
        setIsOpen={setEditPasswordModalIsOpen}
        passwordToEdit={passwordToEdit}
        setPasswordToEdit={setPasswordToEdit}
      />
      <ConfirmDeleteModal
        isOpen={confirmDeleteModalIsOpen}
        setIsOpen={setConfirmDeleteModallIsOpen}
        passwordToDelete={passwordToDelete}
        setPasswordToDelete={setPasswordToDelete}
      />
    </main>
  )
}

export default ProfileScreen

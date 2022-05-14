import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaTools, FaShareAlt, FaSearch, FaPlus } from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../features/store'
import { getUserPasswords } from '../features/passwordSlices/getUserPasswords'
import { successReset } from '../features/passwordSlices/deleteUserPassword'
import ListedPassword from '../components/profileScreen/ListedPassword'
import AddPasswordModal from '../components/profileScreen/AddPasswordModal'
import EditPasswordModal from '../components/profileScreen/EditPasswordModal'
import ConfirmDeleteModal from '../components/profileScreen/ConfirmDeleteModal'
import Success from '../components/universal/Success'
import Error from '../components/universal/Error'
import Empty from '../assets/empty.png'

interface URLStructure {
  searchKeyword?: string
  sortOrder?: string
}
let URL: URLStructure = {}

const ProfileScreen: React.FC = () => {
  const { loading, error, errorMessage, passwords } = useAppSelector(state => state.getUserPasswords)
  const { error: error2, errorMessage: errorMessage2 } = useAppSelector(state => state.getUserPassword)
  const { success, successMessage } = useAppSelector(state => state.deleteUserPassword)
  const dispatch = useAppDispatch()

  const [searchParams, setSearchParams] = useSearchParams()
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('searchKeyword') || '')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'atoz')

  const [addPasswordModalIsOpen, setAddPasswordModallIsOpen] = useState(false)
  const [editPasswordModalIsOpen, setEditPasswordModalIsOpen] = useState(false)
  const [confirmDeleteModalIsOpen, setConfirmDeleteModallIsOpen] = useState(false)
  const [passwordToEdit, setPasswordToEdit] = useState({ id: '', name: '', password: '' })
  const [passwordToDelete, setPasswordToDelete] = useState({ id: '', name: '' })

  useEffect(() => {
    const promise = dispatch(getUserPasswords({ searchKeyword, sortOrder }))
    return () => promise.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    if (success) setTimeout(() => dispatch(successReset()), 3000)
    return () => {}
  }, [success, dispatch])

  const filterURL = (searchKeywordFilter: string, sortOrderFilter: string) => {
    if (searchKeywordFilter !== '') URL.searchKeyword = searchKeywordFilter
    else if (URL.searchKeyword) delete URL.searchKeyword
    if (sortOrderFilter !== 'atoz') URL.sortOrder = sortOrderFilter
    else if (URL.sortOrder) delete URL.sortOrder
    setSearchParams({ ...URL })
  }

  const searchHandler = () => filterURL(searchKeyword, sortOrder)

  const sortHandler = (value: string) => {
    setSortOrder(value)
    filterURL(searchKeyword, value)
  }

  return (
    <main className="gradient-primary app-screen">
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
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  onKeyDown={!loading ? e => e.key === 'Enter' && searchHandler() : undefined}
                />
                <button
                  type="button"
                  className="px-3 py-2 transition border rounded-full border-percpass-200 text-percpass-200 hover:border-percpass-100 hover:text-percpass-100 active:scale-95 text-md"
                  onClick={!loading ? searchHandler : undefined}
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-1 ml-3 text-xs">Sortowanie:</div>
              <select
                className="w-full px-3 py-2 text-gray-800 transition border-none rounded-full cursor-pointer focus:outline-none"
                value={sortOrder}
                onChange={e => sortHandler(e.target.value)}
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

            <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mb-4" />
            <Error isOpen={error2 && errorMessage2 !== '' ? true : false} message={errorMessage2} styling="mb-4" />
            <Success isOpen={success && successMessage !== '' ? true : false} message={successMessage} styling="mb-4" />

            <div className="flex flex-col gap-3">
              {passwords.length > 0
                ? passwords.map(element => (
                    <ListedPassword
                      key={element._id}
                      listedPassword={element}
                      setEditPasswordModalIsOpen={setEditPasswordModalIsOpen}
                      setConfirmDeleteModalIsOpen={setConfirmDeleteModallIsOpen}
                      setPasswordToEdit={setPasswordToEdit}
                      setPasswordToDelete={setPasswordToDelete}
                    />
                  ))
                : !loading && (
                    <div className="flex flex-col items-center py-3 text-sm font-light">
                      <div className="mb-5">Nie znaleziono zapisanych haseł.</div>
                      <div className="w-48 md:w-56 lg:w-64">
                        <img src={Empty} alt="empty" />
                      </div>
                    </div>
                  )}
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

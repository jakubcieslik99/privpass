import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaTools, FaShareAlt, FaSearch, FaPlus } from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../features/store'
import { getUserPasswords } from '../features/passwordSlices/getUserPasswords'
import ListedPassword from '../components/profileScreen/ListedPassword'
import AddPasswordModal from '../components/profileScreen/AddPasswordModal'
import EditPasswordModal from '../components/profileScreen/EditPasswordModal'
import ConfirmDeleteModal from '../components/profileScreen/ConfirmDeleteModal'
import Error from '../components/universal/Error'
import Loader from '../components/universal/Loader'
import Empty from '../assets/empty.png'

interface URLStructure {
  searchKeyword?: string
  sortOrder?: string
}

let URL: URLStructure = {}

const ProfileScreen: React.FC = () => {
  //variables
  const { loading, error, errorMessage, passwords } = useAppSelector(state => state.getUserPasswords)
  const { loading: loading2, error: error2, errorMessage: errorMessage2 } = useAppSelector(state => state.getUserPassword)
  const dispatch = useAppDispatch()

  const [searchParams, setSearchParams] = useSearchParams()
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('searchKeyword') || '')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'atoz')

  const [addPasswordModalIsOpen, setAddPasswordModalIsOpen] = useState(false)
  const [editPasswordModalIsOpen, setEditPasswordModalIsOpen] = useState(false)
  const [passwordToEdit, setPasswordToEdit] = useState({ id: '', name: '', password: '' })
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false)
  const [passwordToDelete, setPasswordToDelete] = useState({ id: '', name: '' })

  //handlers
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

  //useEffects
  useEffect(() => {
    const getUserPasswordsPromise = dispatch(
      getUserPasswords({
        searchKeyword: searchParams.get('searchKeyword') || '',
        sortOrder: searchParams.get('sortOrder') || 'atoz',
      })
    )
    return () => {
      getUserPasswordsPromise.abort()
    }
  }, [searchParams, dispatch])

  return (
    <main className="pt-16 md:pt-24 gradient-primary app-screen">
      <div className="grid gap-3 px-3 py-9 app-container md:grid-cols-3 lg:grid-cols-4">
        <div className="md:order-2">
          <div className="px-4 pt-3 pb-5 shadow-lg rounded-xl bg-privpass-500">
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
                  onKeyDown={e => e.key === 'Enter' && !loading && !loading2 && searchHandler()}
                />
                <button
                  disabled={loading || loading2}
                  type="button"
                  className="px-3 py-2 transition border rounded-full text-md border-privpass-200 text-privpass-200 hover:border-privpass-100 hover:text-privpass-100 active:scale-95 disabled:hover:border-privpass-200 disabled:hover:text-privpass-200 disabled:cursor-default disabled:active:scale-100"
                  onClick={searchHandler}
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-1 ml-3 text-xs">Sortowanie:</div>

              <div className="w-full h-[40px] bg-white rounded-full px-2">
                <select
                  disabled={loading || loading2}
                  className="w-full h-[40px] pr-2 py-2 text-gray-800 transition border-none rounded-full cursor-pointer focus:outline-none"
                  value={sortOrder}
                  onChange={e => sortHandler(e.target.value)}
                >
                  <option value="atoz">Alfabetycznie (A-Z)</option>
                  <option value="ztoa">Alfabetycznie (Z-A)</option>
                  <option value="newest">Od najnowszych</option>
                  <option value="oldest">Od najstarszych</option>
                </select>
              </div>
            </div>

            <div>
              <div className="mb-1 ml-3 text-xs">Dodawanie:</div>
              <button
                disabled={loading || loading2}
                className="flex items-center px-3 py-2 transition border rounded-full text-md border-privpass-200 text-privpass-200 hover:border-privpass-100 hover:text-privpass-100 active:scale-95 disabled:hover:border-privpass-200 disabled:hover:text-privpass-200 disabled:cursor-default disabled:active:scale-100"
                onClick={() => setAddPasswordModalIsOpen(true)}
              >
                <FaPlus className="mr-2" />
                Dodaj nowe hasło
              </button>
            </div>
          </div>
        </div>

        <div className="block overflow-hidden md:col-span-2 lg:col-span-3 md:order-1">
          <div className="px-4 pt-3 pb-5 shadow-lg rounded-xl bg-privpass-500">
            <h2 className="flex items-center justify-between mb-5 text-xl">
              <div className="flex items-center">
                <FaShareAlt className="mr-2 text-2xl" />
                Twoje hasła:
              </div>

              <div className="relative text-2xl w-7 h-7">
                <Loader isLoading={loading} styling="absolute top-[2px] right-[2px]" />
                <Loader isLoading={!loading && loading2} styling="absolute top-[2px] right-[2px]" />
              </div>
            </h2>

            <Error isOpen={error && errorMessage !== '' ? true : false} message={errorMessage} styling="mb-4" />
            <Error isOpen={error2 && errorMessage2 !== '' ? true : false} message={errorMessage2} styling="mb-4" />

            <div className="flex flex-col gap-3">
              {passwords.length > 0
                ? passwords.map(element => (
                    <ListedPassword
                      key={element._id}
                      listedPassword={element}
                      setEditPasswordModalIsOpen={setEditPasswordModalIsOpen}
                      setPasswordToEdit={setPasswordToEdit}
                      confirmDeleteModalIsOpen={confirmDeleteModalIsOpen}
                      setConfirmDeleteModalIsOpen={setConfirmDeleteModalIsOpen}
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

      <AddPasswordModal isOpen={addPasswordModalIsOpen} setIsOpen={setAddPasswordModalIsOpen} />
      <EditPasswordModal
        isOpen={editPasswordModalIsOpen}
        setIsOpen={setEditPasswordModalIsOpen}
        passwordToEdit={passwordToEdit}
        setPasswordToEdit={setPasswordToEdit}
      />
      <ConfirmDeleteModal
        isOpen={confirmDeleteModalIsOpen}
        setIsOpen={setConfirmDeleteModalIsOpen}
        passwordToDelete={passwordToDelete}
        setPasswordToDelete={setPasswordToDelete}
      />
    </main>
  )
}

export default ProfileScreen

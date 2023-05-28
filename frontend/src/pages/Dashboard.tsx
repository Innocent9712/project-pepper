import { authSession } from '../utils'
import { loginStore } from '../store'

export async function loader() {
    const user_session = authSession()
    if (user_session) return user_session
    return null
}


const Dashboard = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const setLogin = loginStore((state) => state.setLogin)
    const login = urlParams.get('login');
    console.log(login)
    if (login) setLogin(true)
    console.log(import.meta.env.VITE_APP_API_ENDPOINT)

  return (
    <section className='text-gray-900 mt-8 pl-4'>
        <h1>Hi, John</h1>
        <h3 className='text-gray-500 w-[80%] mt-2'>Welcome to Project Pepper Inventory Management System</h3>
    </section>
  )
}

export default Dashboard
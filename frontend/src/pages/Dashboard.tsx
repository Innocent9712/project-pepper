import React from 'react'
import { authSession } from '../utils'

export async function loader() {
    const user_session = authSession()
    if (user_session) return user_session
    return null
}

const Dashboard = () => {
    // get the login param from the url
    const urlParams = new URLSearchParams(window.location.search);
    const login = urlParams.get('login');
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard
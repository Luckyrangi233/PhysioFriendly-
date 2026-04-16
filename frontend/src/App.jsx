import React, { useState } from 'react'
import LoginForm from './Components/LoginForm/LoginForm.jsx'
import Dashboard from './Components/Dashboard/Dashboard.jsx'

const App = () => {
  const token = localStorage.getItem('token')
  const [isLoggedIn, setIsLoggedIn] = useState(!!token)

  return (
    <div className='App'>
      {isLoggedIn ? <Dashboard /> : <LoginForm onLogin={() => setIsLoggedIn(true)} />}
    </div>
  )
}

export default App
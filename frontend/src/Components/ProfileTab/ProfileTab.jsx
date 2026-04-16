import React, { useState } from 'react'
import './ProfileTab.css'
import { jwtDecode } from 'jwt-decode'

const ProfileTab = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Decode user info directly from token
  const token = localStorage.getItem('token')
  const user = token ? jwtDecode(token) : null

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DR'

  return (
    <div className='profile-tab'>
      <button className='profile-tab-trigger' onClick={() => setIsOpen(!isOpen)}>
        <div className='profile-avatar'>{initials}</div>
        <div className='profile-info'>
          <span className='profile-name'>{user?.name || 'Physiotherapist'}</span>
          <span className='profile-role'>Physiotherapist</span>
        </div>
        <svg
          className={`profile-chevron ${isOpen ? 'open' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className='profile-dropdown'>
          <div className='profile-dropdown-row'>
            <span className='profile-dropdown-label'>Name</span>
            <span className='profile-dropdown-value'>{user?.name || '—'}</span>
          </div>
          <div className='profile-dropdown-row'>
            <span className='profile-dropdown-label'>Email</span>
            <span className='profile-dropdown-value'>{user?.email || '—'}</span>
          </div>
          <div className='profile-dropdown-divider' />
          <button className='profile-logout' onClick={() => {
            localStorage.removeItem('token')
            window.location.href = '/'
          }}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileTab
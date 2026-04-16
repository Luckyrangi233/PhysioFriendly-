import React from 'react'
import './SearchBar.css'

const SearchBar = ({ placeholder, value, onChange, onClear }) => {
  return (
    <div className='searchbar-wrapper'>
      <svg className='searchbar-icon' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        className='searchbar-input'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {value && (
        <button className='searchbar-clear' onClick={onClear}>✕</button>
      )}
    </div>
  )
}

export default SearchBar
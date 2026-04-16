import React from 'react'
import './CreateCaseCard.css'

const CreateCaseCard = ({ onClick }) => {
  return (
    <div className='create-case-card' onClick={onClick}>
      <div className='create-case-icon'>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <div className='create-case-text'>
        <span className='create-case-title'>New Case</span>
        <span className='create-case-subtitle'>Register a new patient case</span>
      </div>
    </div>
  )
}

export default CreateCaseCard
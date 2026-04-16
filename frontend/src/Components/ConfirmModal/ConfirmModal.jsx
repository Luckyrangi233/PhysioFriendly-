import React from 'react'
import './ConfirmModal.css'

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className='modal-overlay'>
      <div className='modal-box'>
        <p className='modal-message'>{message}</p>
        <div className='modal-actions'>
          <button className='modal-cancel' onClick={onCancel}>Cancel</button>
          <button className='modal-confirm' onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
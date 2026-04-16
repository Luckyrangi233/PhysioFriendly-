import React from 'react'
import './CaseDetail.css'

const CaseDetail = ({ caseData, onCreateSession }) => {
  return (
    <div className='case-detail'>

      <div className='case-detail-header'>
        <div className='case-detail-avatar'>
          {caseData.patient_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className='case-detail-name'>{caseData.patient_name}</h2>
          <span className='case-detail-injury'>{caseData.injury_name}</span>
        </div>
      </div>

      <div className='case-detail-section'>
        <p className='case-detail-section-label'>Patient Information</p>
        <div className='case-detail-grid'>
          <div className='case-detail-field'>
            <span className='case-detail-label'>Full Name</span>
            <span className='case-detail-value'>{caseData.patient_name}</span>
          </div>
          <div className='case-detail-field'>
            <span className='case-detail-label'>Age</span>
            <span className='case-detail-value'>{caseData.age}</span>
          </div>
          <div className='case-detail-field'>
            <span className='case-detail-label'>Gender</span>
            <span className='case-detail-value'>{caseData.gender}</span>
          </div>
          <div className='case-detail-field'>
            <span className='case-detail-label'>Created On</span>
            <span className='case-detail-value'>{new Date(caseData.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className='case-detail-section'>
        <p className='case-detail-section-label'>Injury Information</p>
        <div className='case-detail-grid'>
          <div className='case-detail-field'>
            <span className='case-detail-label'>Injury Name</span>
            <span className='case-detail-value'>{caseData.injury_name}</span>
          </div>
          <div className='case-detail-field full-width'>
            <span className='case-detail-label'>Injury Details</span>
            <span className='case-detail-value'>{caseData.injury_details || '—'}</span>
          </div>
        </div>
      </div>

      <div className='case-detail-section'>
        <div className='case-detail-sessions-header'>
          <p className='case-detail-section-label'>Sessions</p>
          <button className='case-detail-create-session-btn' onClick={onCreateSession}>
            + New Session
          </button>
        </div>
        {/* Session list will go here */}
        <p className='case-detail-no-sessions'>No sessions yet. Add the first session.</p>
      </div>

    </div>
  )
}

export default CaseDetail
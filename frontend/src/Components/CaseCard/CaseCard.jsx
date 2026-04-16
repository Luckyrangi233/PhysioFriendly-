import React from 'react'
import './CaseCard.css'

const CaseCard = ({ caseData, onOpen, onAnalyse }) => {
  return (
    <div className='case-card'>
      <div className='case-card-body'>
        <div className='case-card-avatar'>
          {caseData.patient_name.charAt(0).toUpperCase()}
        </div>
        <div className='case-card-info'>
          <span className='case-card-name'>{caseData.patient_name}</span>
          <span className='case-card-injury'>{caseData.injury_name}</span>
        </div>
      </div>
      <div className='case-card-actions'>
        <button className='case-card-btn analyse' onClick={() => onAnalyse(caseData)}>Analyse</button>
        <button className='case-card-btn open' onClick={() => onOpen(caseData.case_id)}>→</button>
      </div>
    </div>
  )
}

export default CaseCard
import React, { useState } from 'react'
import './CreateCase.css'
import { createCase } from '../../api/cases'
import CreateSession from '../CreateSession/CreateSession'

const CreateCase = ({ onCaseCreated }) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: '',
    injury_name: '',
    injury_details: '',
    mobile: '',
    address: ''
  })
  const [createdCaseId, setCreatedCaseId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.patient_name || !formData.age || !formData.gender || !formData.injury_name) {
      setError('Patient name, age, gender and injury name are required')
      return
    }
    setError('')
    setLoading(true)
    const res = await createCase({ ...formData, age: parseInt(formData.age) })
    if (res.case_id) {
      setCreatedCaseId(res.case_id)
    } else {
      setError(res.message || 'Failed to create case')
    }
    setLoading(false)
  }

  return (
    <div className='cc-container'>
      <h3 className='cc-title'>New Case</h3>

      {!createdCaseId ? (
        <>
          <div className='cc-row'>
            <div className='cc-field'>
              <label>Patient Name <span className='cc-required'>*</span></label>
              <input type='text' name='patient_name' value={formData.patient_name} onChange={handleChange} placeholder='e.g. Robert Smith' />
            </div>
            <div className='cc-field'>
              <label>Age <span className='cc-required'>*</span></label>
              <input type='number' name='age' value={formData.age} onChange={handleChange} placeholder='e.g. 27' min='1' />
            </div>
          </div>

          <div className='cc-row'>
            <div className='cc-field'>
              <label>Gender <span className='cc-required'>*</span></label>
              <select name='gender' value={formData.gender} onChange={handleChange}>
                <option value=''>Select gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </div>
            <div className='cc-field'>
              <label>Injury Name <span className='cc-required'>*</span></label>
              <input type='text' name='injury_name' value={formData.injury_name} onChange={handleChange} placeholder='e.g. ACL Tear' />
            </div>
          </div>

          <div className='cc-row'>
            <div className='cc-field'>
              <label>Mobile</label>
              <input type='tel' name='mobile' value={formData.mobile} onChange={handleChange} placeholder='e.g. 9876543210' />
            </div>
            <div className='cc-field'>
              <label>Address</label>
              <input type='text' name='address' value={formData.address} onChange={handleChange} placeholder='e.g. 12 Main St, Jaipur' />
            </div>
          </div>

          <div className='cc-field cc-full'>
            <label>Injury Details</label>
            <textarea name='injury_details' value={formData.injury_details} onChange={handleChange} placeholder='Describe the injury in detail...' rows={3} />
          </div>

          {error && (
            <div className='cc-error'>
              <span className='cc-error-icon'>!</span>
              {error}
            </div>
          )}

          <button className='cc-submit' onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Case'}
          </button>
        </>
      ) : (
        <>
          <div className='cc-success'>Case created successfully! Add the first session below.</div>
          <CreateSession caseId={createdCaseId} onSessionCreated={onCaseCreated} />
        </>
      )}
    </div>
  )
}

export default CreateCase
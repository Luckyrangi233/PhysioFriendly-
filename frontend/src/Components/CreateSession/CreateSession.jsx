import React, { useState } from 'react'
import './CreateSession.css'
import { createSession } from '../../api/sessions'

const METRICS = ['pain', 'mobility', 'strength', 'motor_control']

const CreateSession = ({ caseId, onSessionCreated }) => {
  const [formData, setFormData] = useState({
    session_date: '',
    exercises: '',
    therapy: '',
    medication: '',
    remarks: '',
    duration_minutes: '',
    pain: '',
    mobility: '',
    strength: '',
    motor_control: ''
  })
  const [checkedMetrics, setCheckedMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleMetric = (metric) => {
    setCheckedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    )
    // Clear value if unchecked
    if (checkedMetrics.includes(metric)) {
      setFormData(prev => ({ ...prev, [metric]: '' }))
    }
  }

  const handleSubmit = async () => {
    if (!formData.session_date) {
      setError('Session date is required')
      return
    }
    if (checkedMetrics.length === 0) {
      setError('Please select at least one metric')
      return
    }

    setError('')
    setLoading(true)

    // Only send checked metric values, null for unchecked
    const payload = {
      session_date: formData.session_date,
      exercises: formData.exercises || null,
      therapy: formData.therapy || null,
      medication: formData.medication || null,
      remarks: formData.remarks || null,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      pain: checkedMetrics.includes('pain') ? parseInt(formData.pain) || null : null,
      mobility: checkedMetrics.includes('mobility') ? parseInt(formData.mobility) || null : null,
      strength: checkedMetrics.includes('strength') ? parseInt(formData.strength) || null : null,
      motor_control: checkedMetrics.includes('motor_control') ? parseInt(formData.motor_control) || null : null,
    }

    const res = await createSession(caseId, payload)

    if (res.session_id) {
      setSuccess(`Session ${res.session_number} added successfully`)
      setFormData({
        session_date: '', exercises: '', therapy: '', medication: '',
        remarks: '', duration_minutes: '', pain: '', mobility: '', strength: '', motor_control: ''
      })
      setCheckedMetrics([])
      if (onSessionCreated) onSessionCreated()
    } else {
      setError(res.message || 'Failed to create session')
    }

    setLoading(false)
  }

  return (
    <div className='cs-container'>
      <h3 className='cs-title'>Add New Session</h3>

      {/* Date and Duration */}
      <div className='cs-row'>
        <div className='cs-field'>
          <label>Session Date <span className='cs-required'>*</span></label>
          <input type='date' name='session_date' value={formData.session_date} onChange={handleChange} />
        </div>
        <div className='cs-field'>
          <label>Duration (minutes)</label>
          <input type='number' name='duration_minutes' value={formData.duration_minutes} onChange={handleChange} placeholder='e.g. 45' min='1' />
        </div>
      </div>

      {/* Treatment fields */}
      <div className='cs-row'>
        <div className='cs-field'>
          <label>Exercises</label>
          <textarea name='exercises' value={formData.exercises} onChange={handleChange} placeholder='e.g. Hamstring stretch, Clamshells' rows={2} />
        </div>
        <div className='cs-field'>
          <label>Therapy</label>
          <textarea name='therapy' value={formData.therapy} onChange={handleChange} placeholder='e.g. Manual therapy, Ice pack' rows={2} />
        </div>
      </div>

      <div className='cs-row'>
        <div className='cs-field'>
          <label>Medication</label>
          <input type='text' name='medication' value={formData.medication} onChange={handleChange} placeholder='e.g. Anti-inflammatory' />
        </div>
        <div className='cs-field'>
          <label>Remarks</label>
          <input type='text' name='remarks' value={formData.remarks} onChange={handleChange} placeholder='e.g. Mobility improving' />
        </div>
      </div>

      {/* Metrics */}
      <div className='cs-metrics-section'>
        <label className='cs-metrics-label'>Select Metrics to Record <span className='cs-required'>*</span></label>
        <div className='cs-metrics-checkboxes'>
          {METRICS.map(metric => (
            <label key={metric} className={`cs-metric-chip ${checkedMetrics.includes(metric) ? 'checked' : ''}`}>
              <input
                type='checkbox'
                checked={checkedMetrics.includes(metric)}
                onChange={() => toggleMetric(metric)}
              />
              {metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </label>
          ))}
        </div>

        {/* Metric value inputs — only for checked metrics */}
        {checkedMetrics.length > 0 && (
          <div className='cs-metric-inputs'>
            {checkedMetrics.map(metric => (
              <div key={metric} className='cs-metric-input-field'>
                <label>
                  {metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <span className='cs-metric-hint'>
                    {metric === 'pain' ? ' (1–10, lower = better)' : ' (1–10, higher = better)'}
                  </span>
                </label>
                <input
                  type='number'
                  name={metric}
                  value={formData[metric]}
                  onChange={handleChange}
                  placeholder='1–10'
                  min='1'
                  max='10'
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className='cs-error'>
          <span className='cs-error-icon'>!</span>
          {error}
        </div>
      )}
      {success && <div className='cs-success'>{success}</div>}

      <button className='cs-submit' onClick={handleSubmit} disabled={loading}>
        {loading ? 'Adding...' : 'Add Session'}
      </button>
    </div>
  )
}

export default CreateSession
import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import SearchBar from '../SearchBar/SearchBar'
import ProfileTab from '../ProfileTab/ProfileTab'
import CreateCaseCard from '../CreateCaseCard/CreateCaseCard'
import CaseCard from '../CaseCard/CaseCard'
import CreateCase from '../CreateCase/CreateCase'
import CreateSession from '../CreateSession/CreateSession'
import AnalyseGraph from '../AnalyseGraph/AnalyseGraph'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import { fetchAllCases, fetchCasesByPatient, fetchCasesByInjury, fetchCaseById, deleteCaseApi } from '../../api/cases'
import { fetchSessionsByCase, fetchSessionById, deleteSession } from '../../api/sessions'
import { jwtDecode } from 'jwt-decode'

const Dashboard = () => {
  const [searchPatient, setSearchPatient] = useState('')
  const [searchInjury, setSearchInjury] = useState('')
  const [cases, setCases] = useState(null)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState('dashboard')
  const [selectedCase, setSelectedCase] = useState(null)
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [history, setHistory] = useState([])

  // Graph state
  const [analyseCase, setAnalyseCase] = useState(null)

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState(null)
  // confirmModal = { message, onConfirm }

  // Token expiry check
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/'; return }
    try {
      const decoded = jwtDecode(token)
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        window.location.href = '/'
      }
    } catch {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
  }, [])

  const pushHistory = (currentCases) => {
    setHistory(prev => [...prev, currentCases])
  }

  const loadAllCases = async () => {
    pushHistory(cases)
    setLoading(true)
    const data = await fetchAllCases()
    setCases(data)
    setLoading(false)
  }

  useEffect(() => {
    if (searchPatient.trim() === '') return
    const timer = setTimeout(async () => {
      setLoading(true)
      const data = await fetchCasesByPatient(searchPatient)
      pushHistory(cases)
      setCases(data)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchPatient])

  useEffect(() => {
    if (searchInjury.trim() === '') return
    const timer = setTimeout(async () => {
      setLoading(true)
      const data = await fetchCasesByInjury(searchInjury)
      pushHistory(cases)
      setCases(data)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInjury])

  const handleShowAll = () => {
    setSearchPatient('')
    setSearchInjury('')
    loadAllCases()
  }

  const handleCasesBack = () => {
    const prev = [...history]
    const last = prev.pop()
    setHistory(prev)
    setCases(last)
    setSearchPatient('')
    setSearchInjury('')
  }

  const handleOpenCase = async (id) => {
    setLoading(true)
    const [caseData, sessionData] = await Promise.all([
      fetchCaseById(id),
      fetchSessionsByCase(id)
    ])
    setSelectedCase(caseData)
    setSessions(sessionData)
    setView('case')
    setLoading(false)
  }

  const handleOpenSession = async (sessionId) => {
    setLoading(true)
    const data = await fetchSessionById(selectedCase.case_id, sessionId)
    setSelectedSession(data)
    setView('session')
    setLoading(false)
  }

  const handleBack = () => {
    if (view === 'session') {
      setView('case')
      setSelectedSession(null)
    } else {
      setView('dashboard')
      setSelectedCase(null)
      setSessions([])
    }
  }

  const handleCaseCreated = () => {
    setView('dashboard')
    loadAllCases()
  }

  const handleSessionCreated = async () => {
    const data = await fetchSessionsByCase(selectedCase.case_id)
    setSessions(data)
  }

  // Delete case
  const handleDeleteCase = (caseId) => {
    setConfirmModal({
      message: 'Are you sure you want to delete this case? All sessions will be permanently deleted.',
      onConfirm: async () => {
        await deleteCaseApi(caseId)
        setConfirmModal(null)
        setView('dashboard')
        setSelectedCase(null)
        setSessions([])
        loadAllCases()
      }
    })
  }

  // Delete session
  const handleDeleteSession = (sessionId) => {
    setConfirmModal({
      message: 'Are you sure you want to delete this session?',
      onConfirm: async () => {
        await deleteSession(selectedCase.case_id, sessionId)
        setConfirmModal(null)
        setView('case')
        setSelectedSession(null)
        const data = await fetchSessionsByCase(selectedCase.case_id)
        setSessions(data)
      }
    })
  }

  // Analyse — open graph for a case, then handle session click inside graph
  const handleAnalyse = (caseData) => {
    setAnalyseCase(caseData)
  }

  const handleGraphSessionClick = async (sessionNumber) => {
    setAnalyseCase(null)
    // Open that case first if not already open
    if (!selectedCase || selectedCase.case_id !== analyseCase.case_id) {
      await handleOpenCase(analyseCase.case_id)
    }
    // Find session by number
    const allSessions = await fetchSessionsByCase(analyseCase.case_id)
    const target = allSessions.find(s => s.session_number === sessionNumber)
    if (target) {
      const data = await fetchSessionById(analyseCase.case_id, target.session_id)
      setSelectedSession(data)
      setView('session')
    }
  }

  return (
    <div className='dashboard-page'>

      {/* Confirm modal */}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Analyse graph modal */}
      {analyseCase && (
        <AnalyseGraph
          caseId={analyseCase.case_id}
          caseName={analyseCase.patient_name}
          injuryName={analyseCase.injury_name}
          onClose={() => setAnalyseCase(null)}
          onSessionClick={handleGraphSessionClick}
        />
      )}

      <header className='dashboard-header'>
        <div className='dashboard-brand'>
          {(view === 'case' || view === 'create-case' || view === 'session') && (
            <button className='dashboard-back-btn' onClick={handleBack}>←</button>
          )}
          <div className='dashboard-brand-icon'>+</div>
          <span>PhysioFriendly</span>
        </div>
        <ProfileTab />
      </header>

      {view === 'dashboard' && (
        <div className='dashboard-search-row'>
          <SearchBar
            placeholder='Search by patient name...'
            value={searchPatient}
            onChange={(e) => { setSearchPatient(e.target.value); setSearchInjury('') }}
            onClear={() => { setSearchPatient(''); setCases(null) }}
          />
          <SearchBar
            placeholder='Search by injury...'
            value={searchInjury}
            onChange={(e) => { setSearchInjury(e.target.value); setSearchPatient('') }}
            onClear={() => { setSearchInjury(''); setCases(null) }}
          />
          <button className='dashboard-show-all' onClick={handleShowAll}>Show All</button>
        </div>
      )}

      <main className='dashboard-body'>

        {/* Dashboard view */}
        {view === 'dashboard' && (
          <>
            <div className='dashboard-section-top'>
              <p className='dashboard-section-label'>Cases</p>
              {history.length > 0 && (
                <button className='dashboard-cases-back' onClick={handleCasesBack}>← Back</button>
              )}
            </div>
            {loading ? (
              <p className='dashboard-loading'>Loading...</p>
            ) : (
              <div className='dashboard-cases-grid'>
                <CreateCaseCard onClick={() => setView('create-case')} />
                {cases === null ? (
                  <p className='dashboard-empty'>Use the search bar or press "Show All" to load cases.</p>
                ) : cases.length === 0 ? (
                  <p className='dashboard-empty'>No cases found.</p>
                ) : (
                  cases.map(c => (
                    <CaseCard
                      key={c.case_id}
                      caseData={c}
                      onOpen={handleOpenCase}
                      onAnalyse={handleAnalyse}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Create case view */}
        {view === 'create-case' && (
          <CreateCase onCaseCreated={handleCaseCreated} />
        )}

        {/* Case detail view */}
        {view === 'case' && selectedCase && (
          <div className='case-detail'>
            <div className='case-detail-header'>
              <div className='case-detail-avatar'>
                {selectedCase.patient_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className='case-detail-name'>{selectedCase.patient_name}</h2>
                <span className='case-detail-injury'>{selectedCase.injury_name}</span>
              </div>
              <button
                className='case-detail-delete'
                onClick={() => handleDeleteCase(selectedCase.case_id)}
              >
                Delete Case
              </button>
            </div>

            <div className='case-detail-grid'>
              <div className='case-detail-field'>
                <span className='case-detail-label'>Age</span>
                <span className='case-detail-value'>{selectedCase.age}</span>
              </div>
              <div className='case-detail-field'>
                <span className='case-detail-label'>Gender</span>
                <span className='case-detail-value'>{selectedCase.gender}</span>
              </div>
              <div className='case-detail-field'>
                <span className='case-detail-label'>Mobile</span>
                <span className='case-detail-value'>{selectedCase.mobile || '—'}</span>
              </div>
              <div className='case-detail-field'>
                <span className='case-detail-label'>Address</span>
                <span className='case-detail-value'>{selectedCase.address || '—'}</span>
              </div>
              <div className='case-detail-field'>
                <span className='case-detail-label'>Created</span>
                <span className='case-detail-value'>{new Date(selectedCase.created_at).toLocaleDateString()}</span>
              </div>
              <div className='case-detail-field case-detail-full'>
                <span className='case-detail-label'>Injury Details</span>
                <span className='case-detail-value'>{selectedCase.injury_details || '—'}</span>
              </div>
            </div>

            <div className='case-sessions'>
              <p className='case-sessions-label'>Sessions</p>
              {sessions.length === 0 ? (
                <p className='case-sessions-empty'>No sessions yet. Add the first one below.</p>
              ) : (
                <div className='case-sessions-list'>
                  {sessions.map(s => (
                    <div
                      key={s.session_id}
                      className='session-row'
                      onClick={() => handleOpenSession(s.session_id)}
                    >
                      <div className='session-row-number'>S{s.session_number}</div>
                      <div className='session-row-date'>{new Date(s.session_date).toLocaleDateString()}</div>
                      <div className='session-row-arrow'>→</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <CreateSession
              caseId={selectedCase.case_id}
              onSessionCreated={handleSessionCreated}
            />
          </div>
        )}

        {/* Session detail view */}
        {view === 'session' && selectedSession && (
          <div className='case-detail'>
            <div className='case-detail-header'>
              <div className='case-detail-avatar'>S{selectedSession.session_number}</div>
              <div>
                <h2 className='case-detail-name'>Session {selectedSession.session_number}</h2>
                <span className='case-detail-injury'>{new Date(selectedSession.session_date).toLocaleDateString()}</span>
              </div>
              <button
                className='case-detail-delete'
                onClick={() => handleDeleteSession(selectedSession.session_id)}
              >
                Delete Session
              </button>
            </div>

            <div className='case-detail-grid'>
              <div className='case-detail-field'>
                <span className='case-detail-label'>Duration</span>
                <span className='case-detail-value'>{selectedSession.duration_minutes ? `${selectedSession.duration_minutes} mins` : '—'}</span>
              </div>
              <div className='case-detail-field'>
                <span className='case-detail-label'>Medication</span>
                <span className='case-detail-value'>{selectedSession.medication || '—'}</span>
              </div>
              <div className='case-detail-field case-detail-full'>
                <span className='case-detail-label'>Exercises</span>
                <span className='case-detail-value'>{selectedSession.exercises || '—'}</span>
              </div>
              <div className='case-detail-field case-detail-full'>
                <span className='case-detail-label'>Therapy</span>
                <span className='case-detail-value'>{selectedSession.therapy || '—'}</span>
              </div>
              <div className='case-detail-field case-detail-full'>
                <span className='case-detail-label'>Remarks</span>
                <span className='case-detail-value'>{selectedSession.remarks || '—'}</span>
              </div>
            </div>

            <div className='case-sessions'>
              <p className='case-sessions-label'>Metrics</p>
              <div className='session-metrics-grid'>
                {['pain', 'mobility', 'strength', 'motor_control'].map(metric =>
                  selectedSession[metric] !== null && selectedSession[metric] !== undefined ? (
                    <div key={metric} className='session-metric-card'>
                      <span className='session-metric-label'>
                        {metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className='session-metric-value'>{selectedSession[metric]}</span>
                      <span className='session-metric-hint'>
                        {metric === 'pain' ? 'lower is better' : 'higher is better'}
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard
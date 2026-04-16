import React, { useState, useEffect } from 'react'
import './AnalyseGraph.css'
import { fetchGraphData } from '../../api/sessions'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

const METRICS = [
  { key: 'pain', color: '#c22323', label: 'Pain' },
  { key: 'mobility', color: '#1d9e75', label: 'Mobility' },
  { key: 'strength', color: '#378add', label: 'Strength' },
  { key: 'motor_control', color: '#ba7517', label: 'Motor Control' }
]

const AnalyseGraph = ({ caseId, caseName, injuryName, onClose, onSessionClick }) => {
  const [graphData, setGraphData] = useState([])
  const [chartType, setChartType] = useState('line')
  const [loading, setLoading] = useState(true)
  const [activeMetrics, setActiveMetrics] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchGraphData(caseId)
      // Format for recharts
      const formatted = data.map(s => ({
        name: `S${s.session_number}`,
        session_id: s.session_id,
        session_number: s.session_number,
        date: new Date(s.session_date).toLocaleDateString(),
        pain: s.pain,
        mobility: s.mobility,
        strength: s.strength,
        motor_control: s.motor_control
      }))
      setGraphData(formatted)

      // Auto-enable metrics that have at least one value
      const presentMetrics = METRICS
        .filter(m => data.some(s => s[m.key] !== null && s[m.key] !== undefined))
        .map(m => m.key)
      setActiveMetrics(presentMetrics)

      setLoading(false)
    }
    load()
  }, [caseId])

  const toggleMetric = (key) => {
    setActiveMetrics(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const point = graphData.find(d => d.name === label)
      return (
        <div className='graph-tooltip'>
          <p className='graph-tooltip-title'>{label} — {point?.date}</p>
          {payload.map(p => (
            <p key={p.dataKey} style={{ color: p.color }} className='graph-tooltip-row'>
              {p.name}: <strong>{p.value}</strong>
            </p>
          ))}
          
        </div>
      )
    }
    return null
  }

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      const point = graphData.find(d => d.name === data.activeLabel)
      if (point && onSessionClick) {
        onSessionClick(point.session_number)
      }
    }
  }

  const chartProps = {
    data: graphData,
    onClick: handleChartClick,
    style: { cursor: 'pointer' }
  }

  const renderLines = () =>
    METRICS.filter(m => activeMetrics.includes(m.key)).map(m =>
      chartType === 'line'
        ? <Line key={m.key} type="monotone" dataKey={m.key} name={m.label} stroke={m.color} strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} connectNulls />
        : <Bar key={m.key} dataKey={m.key} name={m.label} fill={m.color} radius={[4, 4, 0, 0]} />
    )

  return (
    <div className='graph-overlay'>
      <div className='graph-modal'>

        <div className='graph-header'>
          <div>
            <h2 className='graph-title'>{caseName}</h2>
            <p className='graph-subtitle'>{injuryName} — Recovery Analysis</p>
          </div>
          <button className='graph-close' onClick={onClose}>✕</button>
        </div>

        {/* Chart type toggle */}
        <div className='graph-controls'>
          <div className='graph-toggle'>
            <button
              className={`graph-toggle-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
            <button
              className={`graph-toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
          </div>

          {/* Metric toggles */}
          <div className='graph-metric-toggles'>
            {METRICS.map(m => (
              <button
                key={m.key}
                className={`graph-metric-btn ${activeMetrics.includes(m.key) ? 'active' : ''}`}
                style={activeMetrics.includes(m.key) ? { borderColor: m.color, color: m.color, background: `${m.color}12` } : {}}
                onClick={() => toggleMetric(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className='graph-loading'>Loading graph...</p>
        ) : graphData.length === 0 ? (
          <p className='graph-empty'>No session data available to analyse.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={340}>
              {chartType === 'line' ? (
                <LineChart {...chartProps}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888885' }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#888885' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {renderLines()}
                </LineChart>
              ) : (
                <BarChart {...chartProps}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888885' }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#888885' }} />
                 <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                  <Legend />
                  {renderLines()}
                </BarChart>
              )}
            </ResponsiveContainer>
            <p className='graph-click-hint'>Click on a data point or bar to view that session's details</p>
          </>
        )}

      </div>
    </div>
  )
}

export default AnalyseGraph
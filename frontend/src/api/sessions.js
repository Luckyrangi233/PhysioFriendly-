const BASE_URL = "http://localhost:4000"

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
})

export const fetchSessionsByCase = async (caseId) => {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/sessions`, { headers: getHeaders() })
  return res.json()
}

export const fetchSessionById = async (caseId, sessionId) => {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/sessions/${sessionId}`, { headers: getHeaders() })
  return res.json()
}

export const fetchGraphData = async (caseId) => {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/sessions/graph`, { headers: getHeaders() })
  return res.json()
}

export const createSession = async (caseId, sessionData) => {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/sessions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(sessionData)
  })
  return res.json()
}

export const deleteSession = async (caseId, sessionId) => {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/sessions/${sessionId}`, {
    method: "DELETE",
    headers: getHeaders()
  })
  return res.json()
}
const BASE_URL = "http://localhost:4000"

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
})

export const fetchAllCases = async () => {
  const res = await fetch(`${BASE_URL}/cases`, { headers: getHeaders() })
  return res.json()
}

export const fetchCasesByPatient = async (name) => {
  const res = await fetch(`${BASE_URL}/cases/search/patient?name=${name}`, { headers: getHeaders() })
  return res.json()
}

export const fetchCasesByInjury = async (injury) => {
  const res = await fetch(`${BASE_URL}/cases/search/injury?injury=${injury}`, { headers: getHeaders() })
  return res.json()
}

export const fetchCaseById = async (id) => {
  const res = await fetch(`${BASE_URL}/cases/${id}`, { headers: getHeaders() })
  return res.json()
}

export const createCase = async (caseData) => {
  const res = await fetch(`${BASE_URL}/cases`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(caseData)
  })
  return res.json()
}

export const deleteCaseApi = async (id) => {
  const res = await fetch(`${BASE_URL}/cases/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  })
  return res.json()
}
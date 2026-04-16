import React, { useState } from 'react'
import "./LoginForm.css"
import axios from 'axios'

const LoginForm = ({ onLogin }) => {
  const [currState, setCurrState] = useState("Sign Up")
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    if (currState === "Sign Up") {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Please fill all the fields!")
        return
      }
    } else if (currState === "Login") {
      if (!formData.email || !formData.password) {
        setError("Please fill all the fields!")
        return
      }
    }

    setError("")
    setSuccess("")

    try {
      const endpoint = currState === "Sign Up" ? "http://localhost:4000/user/add" : "http://localhost:4000/user/login"
      const response = await axios.post(endpoint, formData)

      if (currState === "Sign Up") {
        alert("Account created! Please login.")
        setCurrState("Login")
        return
      }

      if (currState === "Login") {
        const token = response.data.token
        localStorage.setItem("token", token)
        onLogin()
        console.log("Logged in, token saved")
      }

      setSuccess(response.data.message)
      setFormData({ name: "", email: "", password: "" })
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Server error, please try again later")
      }
    }
  }

  return (
    <div className='login-page'>
      <div className='login-card'>

        <div className='login-brand'>
          <div className='login-brand-icon'>+</div>
          <span>PhysioFriendly</span>
        </div>

        <h2 className='login-title'>
          {currState === "Sign Up" ? "Create your account" : "Welcome back"}
        </h2>
        <p className='login-subtitle'>
          {currState === "Sign Up" ? "Start managing patient cases today" : "Sign in to your dashboard"}
        </p>

        <div className='login-fields'>
          {currState === "Sign Up" && (
            <div className='login-field'>
              <label>Full Name</label>
              <input
                onChange={handleChange}
                type="text"
                name="name"
                value={formData.name}
                placeholder='Dr. John Smith'
              />
            </div>
          )}
          <div className='login-field'>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='you@clinic.com'
              autoComplete="new-password"
              onFocus={e => e.target.removeAttribute('readonly')}
              readOnly
            />
          </div>
          <div className='login-field'>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='••••••••'
              autoComplete="new-password"
              onFocus={e => e.target.removeAttribute('readonly')}
              readOnly
            />
          </div>
        </div>

        {error && (
          <div className="login-error">
            <span className="login-error-icon">!</span>
            {error}
          </div>
        )}
        {success && (
          <div className="login-success">
            {success}
          </div>
        )}

        <button className='login-btn' onClick={handleSubmit}>
          {currState === "Sign Up" ? "Create Account" : "Sign In"}
        </button>

        <p className='login-toggle'>
          {currState === "Sign Up"
            ? <>Already have an account? <span onClick={() => { setCurrState("Login"); setError("") }}>Sign in</span></>
            : <>Don't have an account? <span onClick={() => { setCurrState("Sign Up"); setError("") }}>Create one</span></>
          }
        </p>

      </div>
    </div>
  )
}

export default LoginForm
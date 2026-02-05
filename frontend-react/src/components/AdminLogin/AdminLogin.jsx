import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_KEY = import.meta.env.VITE_API_KEY

export function AdminLogin({ show, onClose }) {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!show) {
      setPassword('')
      setLoading(false)
      setError('')
    }
  }, [show])

  async function handleLogin(e) {
    e.preventDefault()
    if (!API_KEY) {
      setError('Missing VITE_API_KEY in your environment.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'x-admin-password': password,
        },
      })

      if (!response.ok) throw new Error('Wrong PIN, nice try!')

      sessionStorage.setItem('adminPassword', password)
      onClose?.()
      navigate('/admin')
    } catch (err) {
      setError(err?.message || 'Wrong PIN, nice try!')
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="admin-login-overlay" role="dialog" aria-modal="true" aria-label="Admin Login">
      <div className="admin-login-modal">
        <button className="admin-login-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="admin-login">
          <h2 className="login-title">
            <span className="icon">🔐</span>
            Backstage Access
          </h2>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
                  <label htmlFor="admin-password">PIN</label>
              <input
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(String(e.target.value || '').replace(/\D/g, ''))}
                type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter PIN"
                autoComplete="off"
                required
                autoFocus
              />
            </div>

            {error ? <p className="error-message">{error}</p> : null}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Checking...' : 'Enter'}
            </button>
          </form>

          <p className="hint">🤫 Shh... this is our little secret</p>
        </div>
      </div>
    </div>
  )
}

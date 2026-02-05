import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BouncingNotes } from '../BouncingNotes/BouncingNotes.jsx'
import { GlobalLoadingOverlay } from '../shared/GlobalLoadingOverlay/GlobalLoadingOverlay.jsx'
import { AdminLogin } from '../AdminLogin/AdminLogin.jsx'
import { TipButton } from '../TipButton/TipButton.jsx'
import { TipModal } from '../TipModal/TipModal.jsx'
import { useApp } from '../../providers/AppProvider.jsx'
import './AppLayout.css'

export function AppLayout() {
  const navigate = useNavigate()
  const { showAdminLogin, setShowAdminLogin, showTipModal, setShowTipModal } = useApp()
  const secretIndexRef = useRef(0)
  const secretTimerRef = useRef(null)

  useEffect(() => {
    function clearTimer() {
      if (secretTimerRef.current) {
        clearTimeout(secretTimerRef.current)
        secretTimerRef.current = null
      }
    }

    function resetSequence() {
      secretIndexRef.current = 0
      clearTimer()
    }

    function handleKeyDown(e) {
      if (!e.ctrlKey) return

      const key = String(e.key || '').toLowerCase()
      const secret = ['a', 'd', 'm']

      if (key === secret[secretIndexRef.current]) {
        secretIndexRef.current += 1
        clearTimer()
        secretTimerRef.current = setTimeout(() => {
          secretIndexRef.current = 0
          secretTimerRef.current = null
        }, 2000)

        if (secretIndexRef.current === secret.length) {
          resetSequence()
          const savedPassword = sessionStorage.getItem('adminPassword')
          if (savedPassword) {
            navigate('/admin')
          } else {
            setShowAdminLogin(true)
          }
        }
      } else {
        resetSequence()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      resetSequence()
    }
  }, [navigate, setShowAdminLogin])

  return (
    <div className="app">
      <BouncingNotes />
      <AdminLogin show={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
      <TipModal show={showTipModal} onClose={() => setShowTipModal(false)} />
      <header className="topbar">
        <div className="logo-group">
          <div className="logo">
            <h1>
              <span className="logo-text">Tronious</span>{' '}
              <span className="logo-accent">Music</span>
            </h1>
          </div>
          <TipButton onClick={() => setShowTipModal(true)} />
        </div>

        <nav className="nav">
          <NavLink to="/events" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Gigs
          </NavLink>
          <NavLink to="/videos" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Videos
          </NavLink>
          <NavLink to="/book" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Book Us!
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <GlobalLoadingOverlay />
    </div>
  )
}

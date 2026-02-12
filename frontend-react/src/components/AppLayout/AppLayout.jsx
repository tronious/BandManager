import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BouncingNotes } from '../BouncingNotes/BouncingNotes.jsx'
import { GlobalLoadingOverlay } from '../shared/GlobalLoadingOverlay/GlobalLoadingOverlay.jsx'
import { AdminLogin } from '../AdminLogin/AdminLogin.jsx'
import { TipButton } from '../TipButton/TipButton.jsx'
import { TipModal } from '../TipModal/TipModal.jsx'
import { useApp } from '../../providers/AppProvider.jsx'
import tronHeader from '../../assets/tron2.png'
import './AppLayout.css'

export function AppLayout() {
  const navigate = useNavigate()
  const { showAdminLogin, setShowAdminLogin, showTipModal, setShowTipModal } = useApp()
  const secretIndexRef = useRef(0)
  const secretTimerRef = useRef(null)

  const headerRef = useRef(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tapCountRef = useRef(0)
  const tapTimerRef = useRef(null)

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

  function openAdminPrompt() {
    const savedPassword = sessionStorage.getItem('adminPassword')
    if (savedPassword) navigate('/admin')
    else setShowAdminLogin(true)
  }

  function onLogoTap() {
    tapCountRef.current += 1
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0
      tapTimerRef.current = null
    }, 2500)

    if (tapCountRef.current >= 10) {
      tapCountRef.current = 0
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current)
        tapTimerRef.current = null
      }
      openAdminPrompt()
    }
  }

  useEffect(() => {
    return () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return

    function onKeyDown(e) {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }

    function onWindowClick(e) {
      const el = headerRef.current
      if (!el) return
      const target = e.target
      if (target && target instanceof Element && !el.contains(target)) setMobileMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('click', onWindowClick)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('click', onWindowClick)
    }
  }, [mobileMenuOpen])

  return (
    <div className="app">
      <BouncingNotes />
      <AdminLogin show={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
      <TipModal show={showTipModal} onClose={() => setShowTipModal(false)} />
      <header ref={headerRef} className="topbar">
        <div className="topbar-row">
          <button type="button" className="topbar-banner-btn" onClick={onLogoTap} aria-label="Tronious Music">
            <img className="topbar-banner-img" src={tronHeader} alt="Tronious Music" />
          </button>
          <div className="topbar-banner">
          </div>

          <button
            type="button"
            className="nav-toggle"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="topbar-nav"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <span className="nav-toggle-icon" aria-hidden="true">
              ☰
            </span>
          </button>
        </div>

        <div className="logo-group">
          <div className="logo">
            <button type="button" className="logo-button" onClick={onLogoTap} aria-label="Tronious Music">
              <div className="logo-header" aria-hidden="true" />
              {/* <h1> */}
                {/* <span className="logo-text">Tronious</span>{' '}
                <span className="logo-accent">Music</span> */}
              {/* </h1> */}
            </button>
          </div>
          <TipButton style={{display: 'none'}} onClick={() => setShowTipModal(true)} />
        </div>

        <nav id="topbar-nav" className={`nav${mobileMenuOpen ? ' open' : ''}`}>
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Gigs
          </NavLink>
          <NavLink
            to="/videos"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Videos
          </NavLink>
          <NavLink
            to="/pics"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            PICS!
          </NavLink>
          <NavLink
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
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

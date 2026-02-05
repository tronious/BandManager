import { createContext, useContext, useMemo, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

export const AppContext = createContext(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}

export function AppProvider({ children }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)

  const value = useMemo(
    () => ({
      showAdminLogin,
      setShowAdminLogin,
      showTipModal,
      setShowTipModal,
    }),
    [showAdminLogin, showTipModal],
  )

  return (
    <AppContext.Provider value={value}>
      <BrowserRouter>{children}</BrowserRouter>
    </AppContext.Provider>
  )
}

import { useCallback, useState } from 'react'
import { Check } from 'lucide-react'
import { ToastContext } from './toast.js'

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const toast = useCallback((nextMessage) => {
    setMessage(nextMessage)
    window.clearTimeout(window.nightjarToastTimer)
    window.nightjarToastTimer = window.setTimeout(() => setMessage(''), 2600)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {message && <div className="toast-message" role="status"><span><Check size={14} /></span>{message}</div>}
    </ToastContext.Provider>
  )
}

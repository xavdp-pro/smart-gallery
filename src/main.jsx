import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import PortraitBlocker from './components/PortraitBlocker'
import i18n from './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <BrowserRouter>
          <AuthProvider>
            <PortraitBlocker>
              <App />
            </PortraitBlocker>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </I18nextProvider>
  </React.StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { VITE_MIDTRANS_CLIENT_KEY } from './config.ts'

const SNAP_JS_URL = 'https://app.sandbox.midtrans.com/snap/snap.js'

if (!document.querySelector(`script[src="${SNAP_JS_URL}"]`)) {
  const midtransScript = document.createElement('script')
  midtransScript.src = SNAP_JS_URL
  midtransScript.setAttribute('data-client-key', VITE_MIDTRANS_CLIENT_KEY || '')
  midtransScript.async = true
  document.head.appendChild(midtransScript)
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider storageKey="vite-ui-theme">
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>,
)

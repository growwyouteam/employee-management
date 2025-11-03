import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { worker } from './mocks/browser'

// Initialize MSW (enabled in both development and production)
async function enableMocking() {
  // We want MSW to work in production too
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

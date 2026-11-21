import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './utils/httpBootstrap.js' // send the httpOnly auth cookie with API calls
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './home.jsx'
import AdminPanel from './admin.jsx'

const isAdmin = window.location.hash === '#admin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AdminPanel /> : <Home />}
  </StrictMode>,
)

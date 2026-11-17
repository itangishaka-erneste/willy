import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import * as HomeModule from './home.jsx'

const App =
  HomeModule.default ??
  HomeModule.App ??
  HomeModule.Home ??
  Object.values(HomeModule).find((value) => typeof value === 'function')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

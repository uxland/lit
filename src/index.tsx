import React from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './App'

createRoot(document.getElementById("react-root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FolderProvider } from './context/FolderContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FolderProvider>
        <App />
      </FolderProvider>
    </AuthProvider>
  </StrictMode>,
)

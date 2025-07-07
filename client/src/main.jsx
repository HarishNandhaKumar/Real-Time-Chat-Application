
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from '../context/AuthContext.jsx'
import { ChatProvider } from '../context/ChatContext.jsx'
import { DeleteProvider } from "../context/DeleteContext.jsx";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <DeleteProvider>
          <App />
        </DeleteProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>,
)


import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <GoogleOAuthProvider clientId="17459868618-5cp7ocl2m2vog728fon3fgviqvuuobs5.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </BrowserRouter>

)

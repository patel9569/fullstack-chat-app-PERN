import react,{ useState,useEffect } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Navbar from './component/Navbar'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Setting from './pages/Setting'
import ProfilePage from './pages/ProfilePage'
import {UserAuthStore} from './store/UserAuthStore.jsx'
import { MessagesSquare } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast';
import useThemeStore from './store/useThemeStore.jsx'



function App() {
  const {authUser,checkAuth,isCheckAuth,onlineUsers}=UserAuthStore()
  const {theme}=useThemeStore()

  console.log({onlineUsers})
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
console.log({authUser})

if(!authUser && isCheckAuth){
     return (
      <div className='flex items-center justify-center h-screen'>
         <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
              justify-center animate-bounce"
              >
              <MessagesSquare className="w-8 h-8 text-primary " />
            </div>
            
      </div>
     )
}


  return (
    <div data-theme={theme}>
      <Navbar/>
    <Routes>

      <Route path='/' element={authUser?<Login/>:<Navigate to='/login'/>}/>
      <Route path='/login' element={!authUser?<Login/>:<Navigate to='/home'/>}/>
      <Route path='/signup' element={!authUser?<Signup/>:<Navigate to='/home'/>}/>
      <Route path='/home' element={authUser?<Home/>:<Navigate to='/login' /> }/>
      <Route path='/settings' element={<Setting/>}/>
      <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to='/login'/>}/>
    </Routes>

    <Toaster />
    </div>
  )
}

export default App

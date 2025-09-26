import './index.css'
import { Routes, Route, Navigate } from 'react-router-dom' 
import { useEffect, useState } from 'react'
import SignIn from './assets/pages/Signin'
import Signup from './assets/pages/Signup'
import Feed from './assets/pages/Feed'
import { apiRequest } from './assets/services/api'

function App() {
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const data = await apiRequest("/auth/status")
        setIsAuthed(data.authenticated === true)
      } catch (err) {
        console.error("Auth check failed:", err)
        setIsAuthed(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) return <div className="text-center" >Loading...</div>

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={isAuthed ? <Feed /> : <Navigate to="/signin" replace />} />
    </Routes>
  )
}

export default App

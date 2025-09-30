import './index.css'
import { Routes, Route, Navigate } from 'react-router-dom' 
import { useEffect, useState } from 'react'
import Feed from './assets/pages/Feed'
import SignIn from './assets/pages/SignIn'
import SignUp from './assets/pages/SignUp'
import { apiRequest } from './assets/services/api'

function App() {
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {

    const checkAuth = async () => {
    try {
      const data = await apiRequest("/auth/status")
      setIsAuthed(data.authenticated === true)
      console.log("Auth status:", data) 
      if (data.authenticated && data.user?.username) {
        setUsername(data.user.username)
        console.log("Username:", data.user.username)
      }
    } catch (err) {
      console.error("Auth check failed:", err)
      setIsAuthed(false)
      setUsername("")
    } finally {
      setLoading(false)
    }

  }

    checkAuth()
  }, [])

  if (loading) return <div className="text-center" >Loading...</div>

  return (
    <Routes>
      <Route path="/signin" element={<SignIn setIsAuthed={setIsAuthed} setUsername={setUsername} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={isAuthed ? <Feed /> : <Navigate to="/signin" replace />} />
    </Routes>
  )
}

export default App

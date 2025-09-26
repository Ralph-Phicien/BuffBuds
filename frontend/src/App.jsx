import './App.css'
import { Routes, Route } from 'react-router-dom' 
import SignIn from './assets/pages/SignIn'
import Signup from './assets/pages/signup'
import Feed from './assets/pages/feed'


function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  )
}

export default App

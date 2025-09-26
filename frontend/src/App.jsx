import './index.css'
import { Routes, Route } from 'react-router-dom' 
import SignIn from './assets/pages/Signin'
import Signup from './assets/pages/Signup'
import Feed from './assets/pages/Feed'


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

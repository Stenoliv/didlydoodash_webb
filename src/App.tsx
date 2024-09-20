import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/pages/home'
import NoMatchPage from './components/pages/nomatch'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<NoMatchPage />} />
      </Routes>
    </Router>
  )
}

export default App

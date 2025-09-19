import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Addition from './pages/Addition'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/addition" element={<Addition />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Calculation from './pages/Calculation'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calculation" element={<Calculation />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
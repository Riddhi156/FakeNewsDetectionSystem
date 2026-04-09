import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopNavBar from './components/TopNavBar'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import MethodologyPage from './pages/MethodologyPage'
import Footer from './components/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <TopNavBar />
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/results"     element={<ResultsPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import SearchMode from './pages/SearchMode'
import SemanticSearch from './pages/SemanticSearch'
import ImageSearch from './pages/ImageSearch'
import Discovery from './pages/Discovery'
import Results from './pages/Results'
import History from './pages/History'
import Settings from './pages/Settings'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/select-mode" element={<SearchMode />} />
        <Route path="/search" element={<SemanticSearch />} />
        <Route path="/image-search" element={<ImageSearch />} />
        <Route path="/discover" element={<Discovery />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  )
}

export default App

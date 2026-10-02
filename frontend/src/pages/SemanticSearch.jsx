import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { investigateQuery } from '../services/api'
import { exampleQueries } from '../data/exampleQueries'
import SearchLoading from '../components/SearchLoading'

export default function SemanticSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState(location.state?.query || '')
  const [error, setError] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleSubmit = async (event) => {
    event?.preventDefault()
    if (query.trim().length === 0 || isSearching) return
    setError('')
    setIsSearching(true)
    setCurrentStep(0)
    const startedAt = Date.now()
    const progressTimer = setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, 6))
    }, 900)

    try {
      const data = await investigateQuery(query)
      const remainingTime = Math.max(0, 6300 - (Date.now() - startedAt))
      if (remainingTime) await new Promise((resolve) => setTimeout(resolve, remainingTime))
      clearInterval(progressTimer)
      navigate('/results', { state: { query, backendResults: data.results } })
    } catch (err) {
      clearInterval(progressTimer)
      setIsSearching(false)
      setError("Could not connect to the backend. Make sure it's running.")
    }
  }

  if (isSearching) {
    return <SearchLoading query={query} currentStep={currentStep} />
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-10 left-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />

      <div className="max-w-2xl w-full text-center relative z-10">
        <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-3">
          Text Search
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          What scene do you want to find?
        </h1>
        <p className="text-gray-500 mb-4">
          Describe the kind of scene you want to find in the local image archive.
        </p>
        <p className="text-xs text-gray-400 mb-10">
          Text similarity searches captions for 500 RSICD images. This archive has no verified coordinates or capture dates.
        </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex items-end gap-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Find airport scenes with aircraft parked near runways and buildings"
            rows={3}
            className="flex-1 resize-none outline-none p-4 text-gray-800 placeholder-gray-400 rounded-xl"
          />
          <button
            type="submit"
            disabled={query.trim().length === 0}
            className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl mb-2 mr-2
                       hover:bg-gray-700 transition-colors
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Search Archive
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}

        <div className="mt-10 text-left">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 text-center">
            Try an example
          </p>
          <div className="flex flex-col gap-2">
            {exampleQueries.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-3
                           hover:border-cyan-400 hover:text-cyan-700 transition-colors text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

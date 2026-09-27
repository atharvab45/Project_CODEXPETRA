import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { investigateQuery } from '../services/api'

export default function SemanticSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const exampleQueries = [
    "Find areas where new construction appeared near Mumbai coastline between January 2024 and January 2026",
    "Detect deforestation in the Amazon basin over the last 2 years",
    "Show new mining activity near river systems in Jharkhand",
  ]

  const handleSubmit = async () => {
    if (query.trim().length === 0) return
    setError('')

    try {
      const data = await investigateQuery(query)
      navigate('/results', { state: { query, backendResults: data.results } })
    } catch (err) {
      setError("Could not connect to the backend. Make sure it's running.")
    }
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
          Semantic Search
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          What do you want to investigate?
        </h1>
        <p className="text-gray-500 mb-4">
          Describe the location, timeframe, and type of change you're looking for.
        </p>
        <p className="text-xs text-gray-400 mb-10">
          This prototype matches against a small demo set of sample locations using an offline semantic model.
        </p>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex items-end gap-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Find areas where new construction appeared near this region between January 2024 and January 2026"
            rows={3}
            className="flex-1 resize-none outline-none p-4 text-gray-800 placeholder-gray-400 rounded-xl"
          />
          <button
            onClick={handleSubmit}
            disabled={query.trim().length === 0}
            className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl mb-2 mr-2
                       hover:bg-gray-700 transition-colors
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Investigate
          </button>
        </div>

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
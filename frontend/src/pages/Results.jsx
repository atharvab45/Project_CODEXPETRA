import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { saveAnalystDecision } from '../services/api'
import MapView from '../components/MapView'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const query = location.state?.query || "No query provided"
  const searchMode = location.state?.searchMode || 'text'

  const resultsToShow = Array.isArray(location.state?.backendResults)
    ? location.state.backendResults
    : []

  const [selectedResult, setSelectedResult] = useState(resultsToShow[0])
  const [isSavingDecision, setIsSavingDecision] = useState(false)
  const [decisionMessage, setDecisionMessage] = useState('')
  const [decisionError, setDecisionError] = useState('')

  const handleSelectResult = (result) => {
    setSelectedResult(result)
    setDecisionMessage('')
    setDecisionError('')
  }

  const handleDecision = async (decision) => {
    if (!selectedResult) return
    setIsSavingDecision(true)
    setDecisionMessage('')
    setDecisionError('')
    try {
      const saved = await saveAnalystDecision({ query, decision, result: selectedResult })
      setDecisionMessage(`${decision === 'verified' ? 'Verified' : 'Dismissed'} decision saved to the audit log (record ${saved.id}).`)
    } catch (error) {
      setDecisionError(error.message || 'Could not save this review decision.')
    } finally {
      setIsSavingDecision(false)
    }
  }

  if (!selectedResult) {
    return (
      <div className="min-h-screen bg-[#fafaf7] text-gray-900 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold mb-3">No search results to show</h1>
        <p className="text-gray-500 mb-6">Start a text or image search to retrieve matches from the local archive.</p>
        <button onClick={() => navigate('/select-mode')} className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-700">
          Choose a search type
        </button>
      </div>
    )
  }

  const evidence = selectedResult.evidence || []

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Search</p>
          <p className="text-sm text-gray-700 italic">"{query}"</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full font-medium">
            ⚡ {searchMode === 'image' ? 'Image Similarity' : 'Text Similarity'} • Local Archive
          </span>
          <button onClick={() => navigate('/select-mode')} className="text-sm text-cyan-600 hover:underline">
            New Search
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/3 border-r border-gray-200 p-4 space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-widest px-2 mb-2">
            {resultsToShow.length} Search Results
          </p>
          <p className="text-xs text-gray-400 px-2">
            Similarity scores are scaled rankings, not probabilities.
          </p>
          {resultsToShow.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className={`p-4 rounded-xl border cursor-pointer transition-all
                ${selectedResult.id === result.id ? 'border-cyan-400 bg-cyan-50' : 'border-gray-200 bg-white hover:border-gray-300'}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold text-sm">{result.location}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">
                  {result.confidence} score
                </span>
              </div>
              <p className="text-xs text-gray-500">RSICD image match</p>
            </div>
          ))}
        </div>

        <div className="lg:w-2/3 p-6 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-2 h-80">
            <MapView
              latitude={selectedResult.latitude}
              longitude={selectedResult.longitude}
              label={selectedResult.location}
            />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">{selectedResult.location}</h2>
                <p className="text-sm text-gray-500">RSICD archive entry · location not verified</p>
              </div>
              <span className="text-sm font-bold px-3 py-1 rounded-full bg-cyan-50 text-cyan-700">
                {selectedResult.confidence} similarity score
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Scaled similarity score; it is not a probability.</p>

            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Dataset caption:</span>{' '}
              {selectedResult.description}
            </p>

            <div className="mb-6">
              {selectedResult.referenceImage ? (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">Image from the matched RSICD entry</p>
                  <img src={selectedResult.referenceImage} alt="Matched RSICD archive scene" className="rounded-xl w-full max-w-2xl" />
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No imagery available for this result.</p>
              )}
            </div>

            <p className="text-sm font-semibold mb-3">Evidence</p>
            <ul className="space-y-2 mb-6">
              {evidence.map((point) => (
                <li key={point} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-cyan-500 mt-0.5">●</span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => handleDecision('verified')}
                disabled={isSavingDecision}
                className="flex-1 bg-gray-900 text-white font-semibold py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Confirm Match
              </button>
              <button
                onClick={() => handleDecision('dismissed')}
                disabled={isSavingDecision}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:border-gray-400 transition-colors disabled:opacity-50"
              >
                Dismiss Match
              </button>
            </div>
            {decisionMessage && <p role="status" className="text-sm text-green-700 mt-3">{decisionMessage}</p>}
            {decisionError && <p role="alert" className="text-sm text-red-600 mt-3">{decisionError}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

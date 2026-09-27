import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { mockResults } from '../data/mockResults'
import MapView from '../components/MapView'

const pipelineSteps = [
  "Understanding your query",
  "Discovering relevant location",
  "Retrieving satellite imagery",
  "Comparing before and after",
  "Detecting changes",
  "Filtering false alarms",
  "Preparing evidence",
]

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const query = location.state?.query || "No query provided"

  const resultsToShow =
    location.state?.backendResults && location.state.backendResults.length > 0
      ? location.state.backendResults
      : mockResults

  const [currentStep, setCurrentStep] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [selectedResult, setSelectedResult] = useState(resultsToShow[0])
  const [activeTab, setActiveTab] = useState('compare')

  useEffect(() => {
    if (currentStep < pipelineSteps.length - 1) {
      const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), 900)
      return () => clearTimeout(timer)
    } else {
      const finishTimer = setTimeout(() => setIsDone(true), 900)
      return () => clearTimeout(finishTimer)
    }
  }, [currentStep])

  const handleSelectResult = (result) => {
    setSelectedResult(result)
    setActiveTab('compare')
  }

  if (!isDone) {
    return (
      <div className="min-h-screen bg-[#fafaf7] text-gray-900 flex flex-col items-center justify-center px-6">
        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping mb-4" />
        <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-4">
          AI Processing Live
        </p>
        <p className="text-gray-500 max-w-md text-center mb-12 italic">"{query}"</p>

        <div className="w-full max-w-md">
          {pipelineSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-4 mb-5">
              <div
                className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold
                  ${index < currentStep ? 'bg-cyan-500 text-white' : ''}
                  ${index === currentStep ? 'bg-cyan-500 text-white animate-pulse' : ''}
                  ${index > currentStep ? 'bg-gray-200 text-gray-400' : ''}
                `}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <p className={`text-sm ${index <= currentStep ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'compare', label: 'Before / After' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'overlay', label: 'Change Overlay' },
  ]

  const beforeImage = selectedResult.beforeImage || "https://placehold.co/500x350/1e293b/94a3b8?text=Before+Image"
  const afterImage = selectedResult.afterImage || "https://placehold.co/500x350/1e293b/94a3b8?text=After+Image"
  const changeOverlayImage = selectedResult.changeOverlayImage || "https://placehold.co/500x350/7c2d12/fca5a5?text=Change+Overlay"
  const timeline = selectedResult.timeline || []
  const evidence = selectedResult.evidence || []

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Investigation</p>
          <p className="text-sm text-gray-700 italic">"{query}"</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full font-medium">
            ⚡ Semantic Match • Offline AI
          </span>
          <button onClick={() => navigate('/search')} className="text-sm text-cyan-600 hover:underline">
            New Search
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/3 border-r border-gray-200 p-4 space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-widest px-2 mb-2">
            {resultsToShow.length} Candidate Changes Found
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
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full
                    ${result.confidence >= 80 ? 'bg-green-100 text-green-700' : ''}
                    ${result.confidence >= 60 && result.confidence < 80 ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${result.confidence < 60 ? 'bg-orange-100 text-orange-700' : ''}
                  `}
                >
                  {result.confidence}%
                </span>
              </div>
              <p className="text-xs text-gray-500">{result.changeType}</p>
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
                <p className="text-sm text-gray-500">{selectedResult.coordinates}</p>
              </div>
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full
                  ${selectedResult.confidence >= 80 ? 'bg-green-100 text-green-700' : ''}
                  ${selectedResult.confidence >= 60 && selectedResult.confidence < 80 ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${selectedResult.confidence < 60 ? 'bg-orange-100 text-orange-700' : ''}
                `}
              >
                {selectedResult.confidence}% confidence
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Detected activity:</span> {selectedResult.changeType}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Period:</span> {selectedResult.dateBefore} → {selectedResult.dateAfter}
            </p>
            {selectedResult.description && (
              <p className="text-sm text-gray-500 italic mb-6">
                "{selectedResult.description}"
              </p>
            )}

            <div className="flex gap-1 border-b border-gray-200 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-gray-400 hover:text-gray-600'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mb-6">
              {activeTab === 'compare' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-2">Before — {selectedResult.dateBefore}</p>
                    <img src={beforeImage} alt="Before" className="rounded-xl w-full" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-2">After — {selectedResult.dateAfter}</p>
                    <img src={afterImage} alt="After" className="rounded-xl w-full" />
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-3">Observations over time</p>
                  {timeline.length > 0 ? (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {timeline.map((point) => (
                        <div key={point.label} className="flex-shrink-0 text-center">
                          <img src={point.image} alt={point.label} className="rounded-lg w-32 h-20 object-cover mb-1" />
                          <p className="text-xs text-gray-500">{point.label}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Timeline data not available for this result.</p>
                  )}
                </div>
              )}

              {activeTab === 'overlay' && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">
                    Highlighted difference — areas of detected change
                  </p>
                  <img src={changeOverlayImage} alt="Change overlay" className="rounded-xl w-full" />
                </div>
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
              <button className="flex-1 bg-gray-900 text-white font-semibold py-2.5 rounded-xl hover:bg-gray-700 transition-colors">
                Verify Change
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:border-gray-400 transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
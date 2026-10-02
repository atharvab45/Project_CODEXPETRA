const pipelineSteps = [
  'Understanding your query',
  'Discovering relevant location',
  'Retrieving satellite imagery',
  'Comparing before and after',
  'Detecting changes',
  'Filtering false alarms',
  'Preparing evidence',
]

export default function SearchLoading({ query, currentStep = 0 }) {
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

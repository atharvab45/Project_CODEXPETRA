import { useNavigate } from 'react-router-dom'
import { mockHistory } from '../data/mockHistory'

export default function History() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-2">
              Past Investigations
            </p>
            <h1 className="text-3xl font-extrabold">Investigation History</h1>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            New Investigation
          </button>
        </div>

        <div className="space-y-3">
          {mockHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/results', { state: { query: item.query } })}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-cyan-400 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <p className="text-gray-800 font-medium flex-1">{item.query}</p>
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                  {item.resultsFound} found
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
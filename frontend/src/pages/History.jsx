import { useEffect, useState } from 'react'
import { getAnalystDecisions } from '../services/api'

export default function History() {
  const [decisions, setDecisions] = useState([])
  const [decisionError, setDecisionError] = useState('')

  useEffect(() => {
    getAnalystDecisions()
      .then((data) => setDecisions(data.decisions || []))
      .catch((error) => setDecisionError(error.message || 'Could not load the review log.'))
  }, [])

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <section className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-2">
                Analyst Workflow
              </p>
              <h1 className="text-3xl font-extrabold">Review Audit Log</h1>
            </div>
            <a
              href="http://127.0.0.1:8000/decisions/export"
              className="bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors text-sm"
            >
              Export CSV
            </a>
            <a
              href="/select-mode"
              className="border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-full hover:border-cyan-400 transition-colors text-sm"
            >
              New Search
            </a>
          </div>
          <p className="text-gray-500 mb-5">
            Saved Verify and Dismiss decisions, newest first. Each action is kept as a separate audit record.
          </p>
          {decisionError && <p role="alert" className="text-sm text-red-600">{decisionError}</p>}
          {!decisionError && decisions.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-sm text-gray-500">
              No review decisions have been saved yet.
            </div>
          )}
          <div className="space-y-3">
            {decisions.map((item) => (
              <article key={item.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">{item.location}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.result?.description || 'RSICD archive match'}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.decision === 'verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {item.decision === 'verified' ? 'Verified' : 'Dismissed'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-3">Query: {item.query}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.createdAt).toLocaleString()} · Record {item.id}
                </p>
              </article>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

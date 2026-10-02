import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDiscoveryClusters } from '../services/api'

export default function Discovery() {
  const navigate = useNavigate()
  const [clusters, setClusters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true
    getDiscoveryClusters()
      .then((data) => {
        if (isCurrent) setClusters(data.clusters || [])
      })
      .catch((err) => {
        if (isCurrent) setError(err.message || 'Could not load archive discovery.')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })
    return () => { isCurrent = false }
  }, [])

  return (
    <main className="min-h-screen bg-[#fafaf7] text-gray-900 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-3">Archive Discovery</p>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Explore visual groups</h1>
        <p className="text-gray-500 max-w-3xl mb-8">
          Images are grouped by similarity in their existing CLIP embeddings. These groups are visual clusters;
          they are not verified locations or detected changes.
        </p>

        {isLoading && <p className="text-gray-500">Grouping archive images…</p>}
        {error && <p role="alert" className="text-red-600">{error}</p>}
        {!isLoading && !error && clusters.length === 0 && (
          <p className="text-gray-500">No visual groups are available in the image index.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clusters.map((cluster) => (
            <section key={cluster.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2 className="font-bold text-lg">{cluster.label}</h2>
                <span className="text-sm text-gray-500">{cluster.imageCount} images</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cluster.examples.map((example) => (
                  <figure key={example.id} className="min-w-0">
                    <img
                      src={example.referenceImage}
                      alt={example.caption}
                      loading="lazy"
                      className="w-full aspect-square object-cover rounded-xl bg-gray-100"
                    />
                    <figcaption className="text-xs text-gray-500 mt-2 line-clamp-3">
                      {example.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>

        <button onClick={() => navigate('/select-mode')} className="mt-8 text-sm text-cyan-700 hover:underline">
          Back to search options
        </button>
      </div>
    </main>
  )
}

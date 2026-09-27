export default function Settings() {
  const dataSources = [
    {
      name: "Sentinel-2 (ESA Copernicus)",
      type: "Satellite Imagery",
      status: "planned",
      note: "Free, publicly accessible optical imagery. Will be integrated for real imagery retrieval.",
    },
    {
      name: "OpenFreeMap / OpenStreetMap",
      type: "Base Map Data",
      status: "active",
      note: "Used for location visualization on the results map.",
    },
    {
      name: "Placeholder Imagery",
      type: "Mock Before/After Images",
      status: "mock",
      note: "Currently used in place of real satellite imagery for demo purposes.",
    },
  ]

  const models = [
    {
      name: "LLM Intent Extraction",
      purpose: "Converts natural-language queries into structured parameters (location, date range, target, analysis type)",
      status: "planned",
      note: "Will use an LLM API to parse queries into structured JSON.",
    },
    {
      name: "Image Differencing",
      purpose: "Baseline change detection via pixel/spectral comparison between before and after images",
      status: "planned",
      note: "Classical computer vision approach — no training required.",
    },
    {
      name: "Confidence Scoring",
      purpose: "Combines spatial, temporal, and spectral signals into a single relevance score",
      status: "mock",
      note: "Currently hardcoded per result for demo purposes. Real scoring logic to be implemented.",
    },
  ]

  const StatusBadge = ({ status }) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      planned: "bg-blue-100 text-blue-700",
      mock: "bg-gray-200 text-gray-600",
    }
    const labels = {
      active: "Active",
      planned: "Planned (Real)",
      mock: "Mock / Demo",
    }
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-2">
          Transparency
        </p>
        <h1 className="text-3xl font-extrabold mb-2">Data Sources & Models</h1>
        <p className="text-gray-500 mb-10">
          This prototype is transparent about what is real, planned, or simulated.
          Nothing here claims to be more capable than it actually is.
        </p>

        <h2 className="text-lg font-bold mb-4">Data Sources</h2>
        <div className="space-y-3 mb-12">
          {dataSources.map((source) => (
            <div key={source.name} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-sm">{source.name}</p>
                  <p className="text-xs text-gray-400">{source.type}</p>
                </div>
                <StatusBadge status={source.status} />
              </div>
              <p className="text-sm text-gray-600">{source.note}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-4">AI / Model Pipeline</h2>
        <div className="space-y-3">
          {models.map((model) => (
            <div key={model.name} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-sm">{model.name}</p>
                <StatusBadge status={model.status} />
              </div>
              <p className="text-sm text-gray-600 mb-1">{model.purpose}</p>
              <p className="text-xs text-gray-400 italic">{model.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
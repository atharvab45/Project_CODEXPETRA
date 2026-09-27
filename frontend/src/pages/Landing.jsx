import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const exampleQueries = [
    "unauthorized construction near coastline",
    "deforestation in the last 2 years",
    "new mining activity near river",
  ]

  const steps = [
    {
      num: "01",
      title: "Describe your investigation",
      desc: "Type what you're looking for in plain English — a location, a time range, and what kind of change matters to you.",
    },
    {
      num: "02",
      title: "AI discovers the location",
      desc: "The system interprets your query and identifies the relevant region and satellite scenes automatically.",
    },
    {
      num: "03",
      title: "Imagery is compared over time",
      desc: "Before and after satellite images are retrieved and analyzed for meaningful differences.",
    },
    {
      num: "04",
      title: "False alarms are filtered out",
      desc: "Clouds, shadows, and seasonal changes are suppressed so only real change remains.",
    },
    {
      num: "05",
      title: "Review the evidence",
      desc: "See before/after imagery, confidence scores, and a clear explanation — you make the final call.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900 overflow-hidden relative">

      {/* Soft pastel background blobs */}
      <div className="absolute top-10 left-0 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 px-6 lg:px-20 relative z-10 pt-20 lg:pt-0">

        {/* Left: Text */}
        <div className="max-w-xl text-center lg:text-left">
          <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-4 animate-fadeInUp">
            AI-Powered Geospatial Intelligence
          </p>

          <h1
            className="text-5xl md:text-6xl font-extrabold leading-tight animate-fadeInUp"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            Find what{' '}
            <span className="bg-cyan-200/70 px-2 rounded">changed</span>{' '}
            on Earth's surface
          </h1>

          <p
            className="text-gray-600 text-lg mt-6 animate-fadeInUp"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            Describe what you're looking for in plain language. Our system discovers
            the location, compares satellite imagery over time, and shows you the evidence.
          </p>

          <button
            onClick={() => navigate('/select-mode')}
            className="mt-8 bg-gray-900 text-white font-semibold px-8 py-3 rounded-full
                       hover:bg-gray-700 hover:scale-105
                       transition-all duration-300 animate-fadeInUp"
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            Start Investigation
          </button>

          <div
            className="flex flex-wrap gap-3 justify-center lg:justify-start mt-8 animate-fadeInUp"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            {exampleQueries.map((query) => (
              <span
                key={query}
                className="text-xs text-gray-500 border border-gray-300 rounded-full px-4 py-2
                           hover:border-cyan-500 hover:text-cyan-600 transition-colors cursor-pointer bg-white"
              >
                "{query}"
              </span>
            ))}
          </div>
        </div>

        {/* Right: Rotating Globe */}
        <div className="flex-shrink-0 animate-fadeInUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full relative overflow-hidden shadow-2xl"
               style={{ background: 'linear-gradient(135deg, #67e8f9, #3b82f6)' }}>
            <div
              className="absolute inset-0 animate-globeRotate opacity-40"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 2px, transparent 2px, transparent 30px)',
              }}
            />
            <div
              className="absolute inset-0 animate-globeRotate opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 2px, transparent 2px, transparent 30px)',
                animationDuration: '12s',
              }}
            />
            {/* 3D shading overlay */}
            <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-30px_80px_rgba(0,0,0,0.35)]" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-3xl mx-auto px-6 pb-32 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>

        <div className="space-y-14">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-6">
              <div className="text-4xl font-extrabold text-cyan-500/40 w-16 flex-shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
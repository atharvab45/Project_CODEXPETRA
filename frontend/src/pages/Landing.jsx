import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowRight, Check, FileDown, Image, Layers, Search, X } from 'lucide-react'
import { exampleQueries } from '../data/exampleQueries'

function HowItWorksVisual({ index }) {
  if (index === 0) {
    return (
      <div className="how-card how-search-card">
        <div className="how-card-top"><span className="how-card-dot" /> Text search <span className="how-card-status">LOCAL MODEL</span></div>
        <div className="how-query"><Search size={19} /><span>aircraft parked near runways</span></div>
        <div className="how-arrow-flow"><span>Describe a scene</span><ArrowRight size={20} /><span>Rank 500 captions</span></div>
        <div className="how-result-row"><span className="how-match-icon"><Image size={17} /></span><span><b>Archive caption</b><small>Similarity ranking</small></span><span className="how-result-line" /></div>
        <div className="how-result-row"><span className="how-match-icon"><Image size={17} /></span><span><b>Another scene match</b><small>Similarity ranking</small></span><span className="how-result-line short" /></div>
      </div>
    )
  }

  if (index === 1) {
    return (
      <div className="how-card how-image-card">
        <div className="how-card-top"><span className="how-card-dot blue" /> Image search <span className="how-card-status">CLIP SIMILARITY</span></div>
        <div className="how-image-flow">
          <div className="how-upload-tile"><Image size={32} /><span>Your reference</span></div>
          <div className="how-flow-arrow"><ArrowRight size={26} /><small>compare</small></div>
          <div className="how-match-stack"><span><Image size={18} /></span><span><Image size={18} /></span><span><Image size={18} /></span><small>Similar archive scenes</small></div>
        </div>
      </div>
    )
  }

  if (index === 2) {
    const tiles = ['a', 'b', 'c', 'a', 'c', 'b', 'b', 'a', 'c', 'c', 'b', 'a']
    return (
      <div className="how-card how-cluster-card">
        <div className="how-card-top"><span className="how-card-dot purple" /> Archive browser <span className="how-card-status">VISUAL GROUPS</span></div>
        <div className="how-clusters">
          {['a', 'b', 'c'].map((group) => (
            <div className={`how-cluster how-cluster-${group}`} key={group}>
              {tiles.filter((tile) => tile === group).map((tile, tileIndex) => (
                <span className="how-cluster-tile" key={`${tile}-${tileIndex}`} />
              ))}
              <small>Group {group.toUpperCase()}</small>
            </div>
          ))}
        </div>
        <div className="how-cluster-caption"><Layers size={17} /> Browse scenes grouped by their visual embeddings</div>
      </div>
    )
  }

  if (index === 3) {
    return (
      <div className="how-card how-inspect-card">
        <div className="how-card-top"><span className="how-card-dot green" /> Matched archive entry <span className="how-card-status">RSICD CAPTION</span></div>
        <div className="how-inspect-icon"><Image size={31} /></div>
        <div className="how-inspect-detail"><small>Caption</small><b>Read the description supplied with each scene</b></div>
        <div className="how-inspect-detail"><small>Match score</small><b>Compare similarity rankings</b></div>
        <div className="how-inspect-note">The archive does not provide verified coordinates or capture dates.</div>
      </div>
    )
  }

  return (
    <div className="how-card how-review-card">
      <div className="how-card-top"><span className="how-card-dot green" /> Analyst review <span className="how-card-status">LOCAL AUDIT LOG</span></div>
      <div className="how-review-item"><span className="how-review-thumb"><Image size={19} /></span><span><b>Archive match</b><small>Choose a review decision</small></span></div>
      <div className="how-review-actions"><span><Check size={17} /> Verify</span><span><X size={17} /> Dismiss</span></div>
      <div className="how-audit-footer"><span><Check size={15} /> Decision saved</span><span><FileDown size={16} /> CSV export</span></div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef([])

  const steps = [
    {
      num: '01',
      title: 'Search by scene description',
      highlight: 'scene description',
      desc: 'Describe what you want to find. A local text model turns your words into an embedding and ranks captions from the 500-image RSICD archive.',
      accent: '#81c936',
      background: '#f2f9e9',
    },
    {
      num: '02',
      title: 'Search with a reference image',
      highlight: 'reference image',
      desc: 'Upload a picture and CLIP compares it with the archive, returning scenes that look similar.',
      accent: '#20b9df',
      background: '#eaf7fb',
    },
    {
      num: '03',
      title: 'Browse visual groups',
      highlight: 'visual groups',
      desc: 'Explore the archive’s existing image embeddings, grouped into clusters so you can discover related scenes without writing a query.',
      accent: '#aa82df',
      background: '#f4effb',
    },
    {
      num: '04',
      title: 'Inspect scene matches',
      highlight: 'scene matches',
      desc: 'Open an RSICD image, read its original caption, and compare similarity rankings. The archive does not provide verified locations or capture dates.',
      accent: '#58b88c',
      background: '#edf8f1',
    },
    {
      num: '05',
      title: 'Record your review',
      highlight: 'your review',
      desc: 'Save a Verify or Dismiss decision in the local audit log, then export your review history as a CSV file.',
      accent: '#e5a44a',
      background: '#fbf4e9',
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveStep(Number(entry.target.dataset.stepIndex))
        }
      })
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 })

    stepRefs.current.forEach((step) => step && observer.observe(step))
    return () => observer.disconnect()
  }, [])

  const scrollToStep = (index) => {
    stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900 overflow-x-clip relative">

      {/* Soft pastel background blobs */}
      <div className="absolute top-10 left-0 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 px-6 lg:px-20 relative z-10 pt-20 lg:pt-0">

        {/* Left: Text */}
        <div className="max-w-xl text-center lg:text-left">
          <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-4 animate-fadeInUp">
            Local Satellite Image Search
          </p>

          <h1
            className="text-5xl md:text-6xl font-extrabold leading-tight animate-fadeInUp"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            Search a local archive of satellite scenes
          </h1>

          <p
            className="text-gray-600 text-lg mt-6 animate-fadeInUp"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            Search 500 captioned RSICD images with text or image similarity, browse visual groups,
            and inspect the captions and similarity rankings for matching scenes.
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
              <button
                key={query}
                onClick={() => navigate('/search', { state: { query } })}
                className="text-xs text-gray-500 border border-gray-300 rounded-full px-4 py-2
                           hover:border-cyan-500 hover:text-cyan-600 transition-colors cursor-pointer bg-white"
              >
                "{query}"
              </button>
            ))}
          </div>
        </div>

        {/* Right: NASA Blue Marble Earth */}
        <div className="flex-shrink-0 animate-fadeInUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="relative">
            <div
              role="img"
              aria-label="A slowly rotating globe showing Earth from NASA's Blue Marble map"
              className="earth-globe relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
              style={{
                backgroundImage: 'url(/assets/earth-blue-marble.jpg)',
                backgroundSize: '200% 100%',
                backgroundPosition: '0% center',
                backgroundRepeat: 'repeat-x',
              }}
            >
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 32% 30%, rgba(255,255,255,.12), transparent 45%), radial-gradient(circle at 72% 70%, rgba(0,0,0,.54), transparent 67%)',
                  boxShadow: 'inset -24px -15px 40px rgba(0,0,0,.48), 0 22px 55px rgba(14,116,144,.22)',
                }}
              />
              <div className="absolute inset-0 rounded-full pointer-events-none border border-white/25" />
            </div>
            <div className="absolute -inset-4 -z-10 rounded-full bg-cyan-300/20 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Scroll-led, full-screen How It Works story */}
      <section id="how-it-works" className="how-story relative z-10">
        <div
          className="sticky top-0 h-[100svh] overflow-hidden transition-colors duration-700 ease-in-out"
          style={{ backgroundColor: steps[activeStep].background }}
        >
          <div className="how-story-heading absolute inset-x-0 z-10 text-center">
            <h2 className="how-display how-title">How it works</h2>
            <span className="how-scroll-cue"><ArrowDown size={14} /> Scroll to explore</span>
          </div>

          <div className="how-pagination" aria-label="How it works steps">
            {steps.map((step, index) => (
              <button
                key={step.num}
                type="button"
                aria-label={`Go to step ${step.num}: ${step.title}`}
                aria-current={activeStep === index ? 'step' : undefined}
                className={`how-page-dot ${activeStep === index ? 'is-active' : ''}`}
                style={{ '--step-accent': step.accent }}
                onClick={() => scrollToStep(index)}
              />
            ))}
          </div>

          <div
            key={activeStep}
            className="how-story-content grid h-full grid-cols-1 items-center gap-5 px-8 pb-8 pt-32 md:px-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-24 lg:pb-12 lg:pt-28"
            style={{ '--step-accent': steps[activeStep].accent }}
          >
            <div className="how-copy how-content-enter mx-auto max-w-xl lg:mx-0">
              <div className="how-step-label"><span>{steps[activeStep].num}</span><i /> STEP {steps[activeStep].num}</div>
              <h3 className="how-display how-step-title">
                {steps[activeStep].title.split(steps[activeStep].highlight).map((part, index, parts) => (
                  <span key={`${part}-${index}`}>
                    {part}
                    {index < parts.length - 1 && <em>{steps[activeStep].highlight}</em>}
                  </span>
                ))}
              </h3>
              <p className="how-step-description">{steps[activeStep].desc}</p>
            </div>

            <div className="how-visual-wrap how-content-enter mx-auto w-full max-w-2xl lg:ml-auto" style={{ animationDelay: '120ms' }}>
              <HowItWorksVisual index={activeStep} />
            </div>
          </div>
        </div>

        <div className="-mt-[100svh]" aria-hidden="true">
          {steps.map((step, index) => (
            <div
              key={step.num}
              ref={(element) => { stepRefs.current[index] = element }}
              data-step-index={index}
              className="pointer-events-none"
              style={{ height: '100svh' }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

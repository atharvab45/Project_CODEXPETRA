import { useNavigate } from 'react-router-dom'

export default function SearchMode() {
  const navigate = useNavigate()

  const modes = [
    {
      id: 'metadata',
      title: 'Metadata Search',
      desc: 'Search satellite archives by location, date, and sensor metadata.',
      available: false,
    },
    {
      id: 'semantic',
      title: 'Text Search',
      desc: 'Find archive images with captions similar to a scene description you enter.',
      available: true,
    },
    {
      id: 'image',
      title: 'Image Search',
      desc: 'Upload a reference image to find visually similar scenes in the satellite archive.',
      available: true,
    },
    {
      id: 'discovery',
      title: 'Archive Discovery',
      desc: 'Explore groups of visually similar scenes already in the image archive.',
      available: true,
    },
  ]

  const handleSelect = (mode) => {
    if (mode.available) {
      navigate(mode.id === 'image' ? '/image-search' : mode.id === 'discovery' ? '/discover' : '/search')
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900 flex flex-col items-center justify-center px-6 py-20">
      <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-3">
        Choose your approach
      </p>
      <h1 className="text-4xl font-extrabold mb-4 text-center">How do you want to search?</h1>
      <p className="text-gray-500 text-center max-w-lg mb-14">
        Search with a description or reference image, or browse visual groups in the archive.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl w-full">
        {modes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => handleSelect(mode)}
            className={`
              relative bg-white rounded-2xl p-8 border transition-all duration-300
              ${mode.available
                ? 'border-gray-200 hover:border-cyan-400 hover:shadow-xl cursor-pointer hover:-translate-y-1'
                : 'border-gray-100 opacity-50 cursor-not-allowed'}
            `}
          >
            {!mode.available && (
              <span className="absolute top-4 right-4 text-[10px] font-semibold text-gray-400 bg-gray-100 rounded-full px-3 py-1">
                COMING SOON
              </span>
            )}
            <h3 className="text-xl font-bold mb-3">{mode.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{mode.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

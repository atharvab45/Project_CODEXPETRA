import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchByImage } from '../services/api'
import SearchLoading from '../components/SearchLoading'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function ImageSearch() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const chooseFile = (nextFile) => {
    setError('')
    if (!nextFile) return
    if (!nextFile.type.startsWith('image/')) {
      setError('Choose an image file such as PNG, JPEG, or WebP.')
      return
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setError('Choose an image smaller than 10 MB.')
      return
    }
    setFile(nextFile)
    setPreviewUrl(URL.createObjectURL(nextFile))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file || isSubmitting) return
    setError('')
    setIsSubmitting(true)
    setCurrentStep(0)
    const startedAt = Date.now()
    const progressTimer = setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, 6))
    }, 900)
    try {
      const data = await searchByImage(file)
      const remainingTime = Math.max(0, 6300 - (Date.now() - startedAt))
      if (remainingTime) await new Promise((resolve) => setTimeout(resolve, remainingTime))
      clearInterval(progressTimer)
      navigate('/results', {
        state: {
          query: `Visual matches for ${file.name}`,
          backendResults: data.results,
          searchMode: 'image',
        },
      })
    } catch (err) {
      clearInterval(progressTimer)
      setIsSubmitting(false)
      setError(err.message || 'Could not search this image. Make sure the backend is running.')
    }
  }

  if (isSubmitting) {
    return <SearchLoading query={file?.name || ''} currentStep={currentStep} />
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-gray-900 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-10 left-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />

      <form onSubmit={handleSubmit} className="max-w-2xl w-full text-center relative z-10">
        <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-3">Image Search</p>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Find visually similar scenes</h1>
        <p className="text-gray-500 mb-8">
          Upload a satellite or aerial image. The offline CLIP model will compare it with images in the local archive.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full min-h-64 bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-cyan-400 transition-colors p-6 flex flex-col items-center justify-center"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Selected image preview" className="max-h-72 max-w-full rounded-xl object-contain" />
          ) : (
            <>
              <span className="text-4xl text-cyan-600 mb-3">＋</span>
              <span className="font-semibold">Choose an image to search</span>
              <span className="text-sm text-gray-400 mt-2">PNG, JPEG, or WebP · up to 10 MB</span>
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => chooseFile(event.target.files?.[0])}
        />
        {file && <p className="text-sm text-gray-500 mt-3">Selected: {file.name}</p>}
        {error && <p role="alert" className="text-red-600 text-sm mt-4">{error}</p>}

        <button
          type="submit"
          disabled={!file || isSubmitting}
          className="mt-6 bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Searching archive…' : 'Search by image'}
        </button>
      </form>
    </div>
  )
}

const sections = [
  {
    title: 'Text search',
    details: [
      'all-MiniLM-L6-v2 creates a local embedding for each text query.',
      'FAISS ranks captions from 500 RSICD satellite images by vector similarity.',
      'The captions describe scenes; they do not provide verified locations or capture dates.',
    ],
  },
  {
    title: 'Image search and archive discovery',
    details: [
      'CLIP ViT-B-32 compares uploaded images with locally indexed RSICD images.',
      'K-means groups the existing CLIP image embeddings into visual clusters.',
      'Similarity scores are scaled rankings, not calibrated probabilities.',
    ],
  },
  {
    title: 'Analyst review',
    details: [
      'Verify and Dismiss actions are saved to a local SQLite audit log.',
      'The saved audit records can be exported as CSV from the History page.',
    ],
  },
  {
    title: 'Map display',
    details: [
      'RSICD entries do not include verified geographic coordinates, so search matches are not plotted on a map.',
    ],
  },
]

export default function Settings() {
  return (
    <main className="min-h-screen bg-[#fafaf7] text-gray-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <p className="text-cyan-600 text-sm font-semibold tracking-widest uppercase mb-2">
          System Overview
        </p>
        <h1 className="text-3xl font-extrabold mb-3">Architecture & Data</h1>
        <p className="text-gray-500 mb-10">
          ChangeScope runs its search models and indexes locally to retrieve similar scenes, group archive images,
          and save analyst review decisions.
        </p>

        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold mb-3">{section.title}</h2>
              <ul className="space-y-2">
                {section.details.map((detail) => (
                  <li key={detail} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-cyan-600 mt-0.5">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

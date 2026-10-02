import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import mapLibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'

maplibregl.setWorkerUrl(mapLibreWorkerUrl)

export default function MapView({ latitude, longitude, label }) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const markerInstance = useRef(null)
  const [mapError, setMapError] = useState('')
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)

  useEffect(() => {
    if (mapInstance.current) return

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: hasCoordinates ? [longitude, latitude] : [0, 20],
      zoom: hasCoordinates ? 11 : 1.4,
      maxZoom: 17,
    })

    mapInstance.current.addControl(new maplibregl.NavigationControl(), 'top-left')
    mapInstance.current.on('load', () => setMapError(''))
    mapInstance.current.on('error', (event) => {
      const message = event.error?.message || 'Map tiles could not be loaded.'
      setMapError(message)
    })

    setTimeout(() => mapInstance.current?.resize(), 200)

    if (hasCoordinates) {
      markerInstance.current = new maplibregl.Marker({ color: '#06b6d4' })
        .setLngLat([longitude, latitude])
        .setPopup(new maplibregl.Popup().setText(label))
        .addTo(mapInstance.current)
    }

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstance.current) return
    if (hasCoordinates) {
      mapInstance.current.flyTo({ center: [longitude, latitude], zoom: 11 })
      markerInstance.current?.setLngLat([longitude, latitude])
      markerInstance.current?.setPopup(new maplibregl.Popup().setText(label))
    }
  }, [latitude, longitude, label])

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      {mapError && (
        <div role="status" className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 border border-amber-200 px-3 py-2 text-xs text-amber-900 shadow-sm">
          Base map tiles could not be loaded. {mapError}
        </div>
      )}
      {!hasCoordinates && (
        <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 border border-gray-200 px-3 py-2 text-xs text-gray-600 shadow-sm">
          Archive entries do not include verified coordinates; no result marker is shown.
        </div>
      )}
    </div>
  )
}

import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function MapView({ latitude, longitude, label }) {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const markerInstance = useRef(null)

  useEffect(() => {
    if (mapInstance.current) return // map already initialized

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [longitude, latitude],
      zoom: 13,
    })

    mapInstance.current.addControl(new maplibregl.NavigationControl(), 'top-left')

    // Force MapLibre to re-measure its container size shortly after mounting.
    // Fixes a common bug where tiles render blank because the container
    // size wasn't finalized yet when the map first initialized.
    setTimeout(() => mapInstance.current?.resize(), 200)

    markerInstance.current = new maplibregl.Marker({ color: '#06b6d4' })
      .setLngLat([longitude, latitude])
      .setPopup(new maplibregl.Popup().setText(label))
      .addTo(mapInstance.current)

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])

  // Update marker + map center when coordinates change (e.g. selecting a different result)
  useEffect(() => {
    if (!mapInstance.current) return
    mapInstance.current.flyTo({ center: [longitude, latitude], zoom: 13 })
    markerInstance.current?.setLngLat([longitude, latitude])
    markerInstance.current?.setPopup(new maplibregl.Popup().setText(label))
  }, [latitude, longitude, label])

  return <div ref={mapContainer} className="w-full h-full rounded-xl" />
}
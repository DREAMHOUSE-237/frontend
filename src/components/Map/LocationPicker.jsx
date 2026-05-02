import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from 'leaflet';

// Correction des icônes par défaut de Leaflet (évite les marqueurs invisibles)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- COMPOSANT DE MISE À JOUR DE LA TAILLE ---
function ResizeMap({ isExpanded }) {
  const map = useMap();
  useEffect(() => {
    // On attend la fin de l'animation CSS pour recalculer la taille
    const timer = setTimeout(() => {
      map.invalidateSize({ animate: true });
    }, 500); 
    return () => clearTimeout(timer);
  }, [isExpanded, map]);
  return null;
}

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13, { animate: true });
  }, [center]);
  return null; 
} 

// AJOUT DE LA PROP isExpanded
export default function LocationPicker({ setPosition, mapPosition, isExpanded }) {
  return (
    <MapContainer
      center={mapPosition}
      zoom={13}
      // Très important : height et width à 100% pour suivre le parent
      style={{ height: "100%", width: "100%", borderRadius: isExpanded ? "0px" : "12px" }}
      zoomSnap={0.5}
      zoomDelta={0.5}
      wheelPxPerZoomLevel={120}
    >
      <TileLayer
        url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={['mt0','mt1','mt2','mt3']}
        attribution="© Google Maps"
      />

      {/* On appelle le fix de taille ici */}
      <ResizeMap isExpanded={isExpanded} />

      <ChangeView center={mapPosition} />

      <LocationMarker setPosition={setPosition} />
    </MapContainer>
  );
}

function LocationMarker({ setPosition }) {
  const [position, setLocalPosition] = useState(null);
  useMapEvents({
    click(e) {
      setLocalPosition(e.latlng);
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}
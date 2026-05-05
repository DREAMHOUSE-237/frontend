import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ResizeMap({ isExpanded }) {
  const map = useMap();
  useEffect(() => {
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
    if (center) map.setView(center, 15, { animate: true });
  }, [center]);
  return null; 
} 

// AJOUT DE LA PROP fixedPosition ET readOnly
export default function LocationPicker({ setPosition, mapPosition, isExpanded, readOnly = false }) {
  return (
    <MapContainer
      center={mapPosition}
      zoom={15}
      style={{ height: "100%", width: "100%", borderRadius: isExpanded ? "0px" : "12px" }}
      // On désactive les interactions si c'est juste de la lecture
      dragging={!readOnly}
      touchZoom={!readOnly}
      doubleClickZoom={!readOnly}
      scrollWheelZoom={!readOnly}
    >
      <TileLayer
        url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={['mt0','mt1','mt2','mt3']}
        attribution="© Google Maps"
      />

      <ResizeMap isExpanded={isExpanded} />
      <ChangeView center={mapPosition} />

      {/* MODIFICATION ICI : On affiche le marqueur fixe DIRECTEMENT */}
      {readOnly ? (
        <Marker position={mapPosition} interactive={false} />
      ) : (
        <LocationMarker setPosition={setPosition} />
      )}
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
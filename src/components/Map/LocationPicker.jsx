import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import React, { useState, useEffect, useRef } from "react";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// icone verte pour la position du client
const clientGreenIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// icone bleue par défaut pour le Bien Immobilier
let DefaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Moteur de calcul d'itinéraire 
function RoutingEngine({ userCoords, bienCoords }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const control = L.Routing.control({
      waypoints: [],
      lineOptions: {
        styles: [{ color: '#007b83', weight: 6, opacity: 0.85 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      createMarker: () => null,
      show: false 
    }).addTo(map);

    routingControlRef.current = control;

    return () => {
      if (map && control) map.removeControl(control);
    };
  }, [map]);

  useEffect(() => {
    if (routingControlRef.current && userCoords && bienCoords) {
      routingControlRef.current.setWaypoints([
        L.latLng(userCoords.lat, userCoords.lng),
        L.latLng(bienCoords.lat, bienCoords.lng)
      ]);

      // Cadre la carte de façon dynamique pour voir tout le trajet
      const bounds = L.latLngBounds([
        [userCoords.lat, userCoords.lng],
        [bienCoords.lat, bienCoords.lng]
      ]);
      map.fitBounds(bounds, { padding: [80, 80], animate: true, duration: 1.2 });
    }
  }, [userCoords, bienCoords, map]);

  return null;
}

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 15, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null; 
}

// Recadre dynamiquement pour voir tous les logements du catalogue
function FitAnnoncesBounds({ annoncesPoints }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !annoncesPoints || annoncesPoints.length === 0) return;

    const validPoints = annoncesPoints.filter(bien => bien.lattitude && bien.longitude);
    if (validPoints.length === 0) return;

    if (validPoints.length === 1) {
      const lat = parseFloat(validPoints[0].lattitude);
      const lng = parseFloat(validPoints[0].longitude);
      map.setView([lat, lng], 14, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(
      validPoints.map(bien => [parseFloat(bien.lattitude), parseFloat(bien.longitude)])
    );

    map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
  }, [annoncesPoints, map]);

  return null;
}

function GpsCameraFollower({ userCoords }) {
  const map = useMap();
  useEffect(() => {
    if (userCoords) {
      map.setView([userCoords.lat, userCoords.lng], 16, { animate: true, duration: 0.8 });
      map.invalidateSize({ animate: false });
    }
  }, [userCoords, map]);
  return null;
}

function ResizeMap({ isExpanded }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => { map.invalidateSize({ animate: true }); }, 300); 
    return () => clearTimeout(timer);
  }, [isExpanded, map]);
  return null;
}

// clc pour publier un bien
function LocationMarker({ position, setPosition }) {
  const [localPos, setLocalPos] = useState(position);

  useEffect(() => {
    setLocalPos(position);
  }, [position]);

  useMapEvents({
    click(e) {
      setLocalPos(e.latlng); // Déplace le marqueur visuel bleu sur l'écran
      setPosition(e.latlng); // Transmet les coordonnées [lat, lng] au formulaire AddHouse
    },
  });

  return localPos ? <Marker position={localPos} /> : null;
}

// Couche de tuiles Google Maps
const StaticTileLayer = React.memo(() => {
  return (
    <TileLayer
      url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
      subdomains={['mt0','mt1','mt2','mt3']}
      attribution="© Google Maps"
    />
  );
}, () => true);

export default function LocationPicker({ position, setPosition, mapPosition, isExpanded, readOnly = false, userCoords = null, annoncesPoints = [] }) {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={userCoords ? [userCoords.lat, userCoords.lng] : mapPosition}
        zoom={12} // Un zoom de départ un peu plus large
        style={{ height: "100%", width: "100%", borderRadius: isExpanded ? "0px" : "12px" }}
        dragging={true}
        scrollWheelZoom={true}
      >
        <StaticTileLayer />
        <ResizeMap isExpanded={isExpanded} />
        
        {/* Caméra intelligente adaptative */}
        {!userCoords && (
          annoncesPoints && annoncesPoints.length > 0 ? (
            <FitAnnoncesBounds annoncesPoints={annoncesPoints} />
          ) : (
            <ChangeView center={mapPosition} />
          )
        )}

        {/* Tracé d'itinéraire actif */}
        {userCoords && mapPosition && (
          <RoutingEngine userCoords={userCoords} bienCoords={{ lat: mapPosition[0], lng: mapPosition[1] }} />
        )}

        {/* Recentrage caméra guidage */}
        {userCoords && !position && <GpsCameraFollower userCoords={userCoords} />}

        {/* Marqueur vert du client (S'affiche uniquement en mode itinéraire) */}
        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lng]} icon={clientGreenIcon} />
        )}

        {/* Distinction claire entre Mode Consultation, Mode Recherche Globale et Mode Création */}
        {readOnly ? (
          <>
            {/* Mode Recherche Globale (Écran partagé avec liste d'annonces) */}
            {annoncesPoints && annoncesPoints.length > 0 ? (
              annoncesPoints.map((bien) => {
                if (!bien.lattitude || !bien.longitude) return null;
                return (
                  <Marker 
                    key={bien.id} 
                    position={[parseFloat(bien.lattitude), parseFloat(bien.longitude)]}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'sans-serif', padding: '4px', minWidth: '140px' }}>
                        <h4 style={{ fontWeight: 'bold', color: '#1a2b3c', margin: '0 0 4px 0', fontSize: '13px' }}>
                          {bien.titreBien || "Logement"}
                        </h4>
                        <p style={{ color: '#f97316', fontWeight: '900', margin: '0 0 6px 0', fontSize: '12px' }}>
                          {bien.prix?.toLocaleString()} XAF
                        </p>
                        <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {bien.categorie}
                        </span>
                        <a 
                          href={`/detail/${bien.id}`} 
                          style={{ display: 'block', textAlign: 'center', backgroundColor: '#1a2b3c', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '6px', borderRadius: '6px', marginTop: '8px', textDecoration: 'none' }}
                        >
                          Voir les détails
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                );
              })
            ) : (
              // Mode Consultation/Détails classique : On affiche le point fixe du bien s'il n'y a pas de tracking GPS en cours
              mapPosition && !userCoords && <Marker position={mapPosition} interactive={false} />
            )}
          </>
        ) : (
          // Mode Création/Publication : On active l'écouteur de clic pour enregistrer l'emplacement
          <LocationMarker position={position} setPosition={setPosition} />
        )}
      </MapContainer>
    </div>
  );
}
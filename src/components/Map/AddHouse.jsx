import { useState } from "react";
import LocationPicker from "../components/Map/LocationPicker";
import SearchLocation from "../components/Map/SearchLocation";
import { saveLocation } from "../services/locationService";

export default function AddHouse() {
  const [position, setPosition] = useState(null);
  const [mapPosition, setMapPosition] = useState([3.848, 11.502]);

  const [status, setStatus] = useState("idle"); 

  const handleSubmit = async () => {
    if (!position) {
      alert("Veuillez d'abord choisir un lieu sur la carte.");
      return;
    } 

    setStatus("loading");
    
    try {
      await saveLocation(position);
      setStatus("success");
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };
  const getButtonContent = () => {
    switch(status) {
      case "loading": return "Enregistrement en cours...";
      case "success": return "Position enregistrée !";
      case "error": return "Erreur de connexion";
      default: return "Enregistrer la localisation";
    }
  };

  return (
    <div className="p-4">
      <h2>Publier un bien</h2>

      <SearchLocation setMapPosition={setMapPosition} />

      <LocationPicker
        setPosition={setPosition}
        mapPosition={mapPosition}
      />

      {position && (
        <p className="mt-2 text-sm text-gray-600">
           Latitude: {position.lat.toFixed(4)} | Longitude: {position.lng.toFixed(4)}
        </p>
      )}

      <button 
        onClick={handleSubmit}
        disabled={status === "loading" || !position}
        className={`mt-4 px-6 py-2 rounded-lg font-bold transition-all ${
          status === "success" ? "bg-green-500 text-white" : 
          status === "error" ? "bg-red-500 text-white" :
          "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
        }`}
      >
        {getButtonContent()}
      </button>
    </div>
  );
}
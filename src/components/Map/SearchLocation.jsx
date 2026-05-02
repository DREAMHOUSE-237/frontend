import { useState } from "react";
import { Search } from 'lucide-react';
export default function SearchLocation({ setMapPosition }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const searchLocation = async () => {
    if (!query) return;
 
    setLoading(true);
    try {
     
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (data.length > 0) {
        const newPos = [
          parseFloat(data[0].lat),
          parseFloat(data[0].lon),
        ];
        
        setMapPosition(newPos);
      } else {
        alert("Lieu non trouvé. Essayez d'être plus précis (ex: Bastos, Yaoundé).");
      }
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      alert("Erreur de connexion au service de recherche.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchLocation();
    }
  };

  return (
<div className="flex gap-2 mb-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Rechercher un lieu (ex: Bastos, Yaoundé)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-full pl-10 pr-4 py-3 bg-transparent border-none outline-none text-sm font-medium"
      />
    </div>
    <button 
      onClick={searchLocation}
      disabled={loading}
      className="bg-[#1a2b3c] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#007b83] transition-all disabled:bg-gray-300"
    >
      {loading ? "..." : "TROUVER"}
    </button>
  </div>
  );
}
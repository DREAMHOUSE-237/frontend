import React, { useState } from 'react';
import { Search, MapPin, Home, Filter, ChevronDown, ChevronUp, Banknote, LayoutGrid } from 'lucide-react';

const Recherche = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 mt-20 relative z-10">
      <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
        
        {/* En-tête avec icône */}
        <div className="flex items-center space-x-2 mb-6 text-[#007b83]">
          <Filter size={20} className="text-[#ff8800]" />
          <h2 className="font-bold uppercase tracking-wider text-sm">Filtres de recherche</h2>
        </div>

        {/* Ligne principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Type de publication */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type de publication</label>
            <div className="relative">
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-[#007b83] outline-none text-sm cursor-pointer">
                <option>Tous les types</option>
                <option>Location</option>
                <option>Vente</option>
                <option>Colocation</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Catégorie</label>
            <div className="relative">
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-[#007b83] outline-none text-sm cursor-pointer">
                <option>Toutes catégories</option>
                <option>Appartement Meublé</option>
                <option>Appartement Non-meublé</option>
                <option>Studio</option>
                <option>Chambre</option>
                <option>Villa / Maison</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Ville */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ville</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ex: Yaoundé, Douala..." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007b83] outline-none text-sm pl-10"
              />
              <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Bouton Recherche Principal */}
          <button className="bg-[#007b83] text-white p-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-[#00666d] transition-all shadow-lg shadow-[#007b83]/20 h-[46px]">
            <Search size={20} />
            <span>Rechercher</span>
          </button>
        </div>

        {/* Bouton pour afficher/masquer les filtres avancés */}
        <div className="flex justify-end mt-4">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-bold text-[#ff8800] hover:underline flex items-center space-x-1"
          >
            <span>{showAdvanced ? "Masquer les filtres avancés" : "Afficher les filtres avancés"}</span>
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 transition-all duration-300">
            
            {/* Région */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Région</label>
              <input 
                type="text" 
                placeholder="Ex: Centre, Littoral..." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007b83] outline-none text-sm"
              />
            </div>

            {/* Quartier */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quartier</label>
              <input 
                type="text" 
                placeholder="Entrez un quartier..." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007b83] outline-none text-sm"
              />
            </div>

            {/* Prix Max */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Prix maximum (XAF)</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="Ex: 500.000" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007b83] outline-none text-sm pl-10"
                />
                <Banknote className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Pièces Minimum */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Pièces minimum</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="Ex: 2" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007b83] outline-none text-sm pl-10"
                />
                <LayoutGrid className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Recherche;
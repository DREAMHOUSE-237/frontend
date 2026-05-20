import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Home, Filter, ChevronDown, ChevronUp,
  Banknote, LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BienService } from '../service/auth_service';
import LocationPicker from '../components/Map/LocationPicker';

const RecherchePage = () => {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialFilters = {
    type: '',
    categorie: '',
    ville: '',
    quartier: '',
    prix: '',
    pieces: ''
  };

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const annoncesPerPage = 6; // Ajusté à 6 pour un défilement plus harmonieux à côté de la carte

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const data = await BienService.getAll();
      setAnnonces(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setAnnonces([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAction = async () => {
    setLoading(true);
    const results = await BienService.search(filters);
    setAnnonces(results || []);
    setCurrentPage(1);
    setLoading(false);
    
    // NB: Si tu veux que les filtres restent écrits à l'écran après la recherche, 
    // tu peux commenter la ligne ci-dessous :
    setFilters(initialFilters);
  };

  // Pagination
  const indexOfLastAnnonce = currentPage * annoncesPerPage;
  const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
  const currentAnnonces = annonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);
  const totalPages = Math.ceil(annonces.length / annoncesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // On ne scrolle plus tout en haut de la page pour éviter de perdre de vue la carte fixe
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] font-sans flex flex-col h-screen overflow-hidden">
      
      {/* 1. ZONE DU HAUT : Barre de Recherche / Filtres */}
      <div className="w-full bg-[#f8f6f2] p-4 md:p-6 shrink-0 z-20">
        <div className="max-w-[1600px] mx-auto bg-white rounded-3xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4 text-[#1a2b3c]">
            <Filter size={18} className="text-[#f97316]" />
            <h2 className="font-extrabold uppercase tracking-widest text-xs">Filtres de recherche</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Type</label>
              <div className="relative">
                <select
                  value={filters.type} 
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl appearance-none outline-none text-xs cursor-pointer text-gray-700">
                  <option value="">Tous les types</option>
                  <option value="LOCATION">LOCATION</option>
                  <option value="VENTE">VENTE</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Catégorie</label>
              <div className="relative">
                <select
                  value={filters.categorie} 
                  onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl appearance-none outline-none text-xs cursor-pointer text-gray-700">
                  <option value="">Toutes catégories</option>
                 <option value="APPARTEMENT">APPARTEMENT</option>
                  <option value="MAISON">MAISON</option>
                  <option value="TERRAIN">TERRAIN</option>
                  <option value="IMMEUBLE">IMMEUBLE</option>
                  <option value="VILLA">VILLA</option>
                  <option value="STUDIO">STUDIO</option>
                  <option value="BOUTIQUE">BOUTIQUE</option>
                  <option value="BUREAU">BUREAU</option>
                  <option value="CHAMBRE">CHAMBRE</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Ville</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Yaoundé..."
                  value={filters.ville} 
                  onChange={(e) => setFilters({ ...filters, ville: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs pl-9"
                />
                <MapPin className="absolute left-3 top-3.5 text-[#f97316]" size={16} />
              </div>
            </div>

            <button
              onClick={handleSearchAction}
              className="bg-[#1a2b3c] text-white p-3 rounded-xl font-black flex items-center justify-center space-x-2 hover:bg-[#007b83] transition-all h-[44px] text-xs shadow-md">
              <Search size={16} />
              <span>Rechercher</span>
            </button>
          </div>

          <div className="flex justify-end mt-2">
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[10px] font-black text-[#f97316] hover:underline flex items-center space-x-1 uppercase tracking-tighter">
              <span>{showAdvanced ? "Masquer options" : "Plus de critères"}</span>
              {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-50 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Quartier</label>
                <input
                  type="text"
                  value={filters.quartier} 
                  placeholder="Ex: Bastos"
                  onChange={(e) => setFilters({ ...filters, quartier: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Prix max (XAF)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={filters.prix} 
                    placeholder="500000"
                    onChange={(e) => setFilters({ ...filters, prix: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs pl-9 outline-none"
                  />
                  <Banknote className="absolute left-3 top-3.5 text-gray-400" size={16} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Pièces min</label>
                <div className="relative">
                  <input
                    type="number"
                    value={filters.pieces} 
                    placeholder="2"
                    onChange={(e) => setFilters({ ...filters, pieces: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs pl-9 outline-none"
                  />
                  <LayoutGrid className="absolute left-3 top-3.5 text-gray-400" size={16} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. ZONE PRINCIPALE : ÉCRAN PARTAGÉ (Split-Screen) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full max-w-[1600px] mx-auto px-4 md:px-6 pb-4 gap-6">
        
        {/* 🏢 COLONNE GAUCHE : Liste des biens (Défilable verticalement) */}
        <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col h-full overflow-y-auto pr-2 scrollbar-thin">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#1a2b3c]">Anonces Actuelles</h3>
            <p className="text-gray-400 text-xs font-medium">{annonces.length} annonces correspondent à vos critères</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center flex-1 py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f97316]"></div>
            </div>
          ) : currentAnnonces.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm border italic">
              Aucun bien ne correspond à cette recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentAnnonces.map((annonce) => (
                <div
                  key={annonce.id}
                  onClick={() => navigate(`/detail/${annonce.id}`)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={BienService.formatImageUrl(annonce.images?.[0])}
                      alt={annonce.titreBien}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=DreamHouse" }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                        Offre Spéciale
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-gray-800 mb-1 truncate group-hover:text-[#007b83] transition-colors">
                        {annonce.titreBien || "Appartement"}
                      </h4>
                      <p className="text-base font-black text-[#f97316] mb-2">
                        {annonce.prix?.toLocaleString()} XAF
                      </p>
                      <div className="mb-3">
                        <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                          {annonce.categorie || "Logement"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-gray-400 font-medium text-[11px]">
                      <div className="flex items-center gap-1 truncate max-w-[140px]">
                        <MapPin size={12} className="text-[#007b83]" />
                        <span className="truncate">{annonce.quartier}</span> ,<span className="truncate">{ annonce.ville}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Home size={12} />
                        {annonce.nbrePiece || 2} pces
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination intégrée au flux de gauche */}
          {annonces.length > annoncesPerPage && (
            <div className="my-6 flex justify-center items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-[#f97316] text-white shadow-sm' : 'bg-white text-gray-400 border'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 🗺️ COLONNE DROITE : La Carte Interactive Fixe (Masquée sur petit mobile pour l'UX) */}
        <div className="hidden md:block md:w-[45%] lg:w-[40%] h-full relative rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white">
          {!loading && annonces.length > 0 ? (
            <LocationPicker 
              readOnly={true}
              // On envoie la liste entière des annonces pour dessiner tous les points
              annoncesPoints={annonces} 
              // Centre par défaut la carte sur le premier élément trouvé (si disponible)
              mapPosition={[
                parseFloat(annonces[0]?.lattitude || 3.848), 
                parseFloat(annonces[0]?.longitude || 11.502)
              ]} 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 italic text-xs gap-2">
              <MapPin size={24} className="animate-bounce text-gray-300" />
              Aucune position à afficher
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RecherchePage;
import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Home, Filter, ChevronDown, ChevronUp,
  Banknote, LayoutGrid, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BienService } from '../service/auth_service';

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
  const annoncesPerPage = 8;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const data = await BienService.getAll();

      if (data) {
        setAnnonces(data);
      } else {
        setAnnonces([]);
      }
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
    setAnnonces(results);
    setCurrentPage(1);
    setLoading(false);

    // 2. RESET : On vide les champs après la recherche
    setFilters(initialFilters);
  };

  // Pagination
  const indexOfLastAnnonce = currentPage * annoncesPerPage;
  const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
  const currentAnnonces = annonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);
  const totalPages = Math.ceil(annonces.length / annoncesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] pb-20 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 pt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          <div className="flex items-center space-x-2 mb-6 text-[#1a2b3c]">
            <Filter size={20} className="text-[#f97316]" />
            <h2 className="font-extrabold uppercase tracking-widest text-sm">Filtres de recherche</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Type</label>
              <div className="relative">
                <select
                  value={filters.type} 
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl appearance-none outline-none text-sm cursor-pointer text-gray-700">
                  <option value="">Tous les types</option>
                  <option value="LOCATION">Location</option>
                  <option value="VENTE">Vente</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Catégorie</label>
              <div className="relative">
                <select
                  value={filters.categorie} 
                  onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl appearance-none outline-none text-sm cursor-pointer text-gray-700">
                  <option value="">Toutes catégories</option>
                  <option value="APPARTEMENT">Appartement</option>
                  <option value="STUDIO">Studio</option>
                  <option value="VILLA">Villa</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Ville</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Yaoundé..."
                  value={filters.ville} 
                  onChange={(e) => setFilters({ ...filters, ville: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm pl-11 "
                />
                <MapPin className="absolute left-4 top-4 text-[#f97316]" size={18} />
              </div>
            </div>

            <button
              onClick={handleSearchAction}
              className="bg-[#1a2b3c] text-white p-4 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-[#007b83] transition-all h-[54px] shadow-lg shadow-gray-200">
              <Search size={20} />
              <span>Rechercher</span>
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs font-black text-[#f97316] hover:underline flex items-center space-x-1 uppercase tracking-tighter">
              <span>{showAdvanced ? "Masquer options" : "Plus de critères"}</span>
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-50 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Quartier</label>
                <input
                  type="text"
                  value={filters.quartier} 
                  placeholder="Ex: Bastos"
                  onChange={(e) => setFilters({ ...filters, quartier: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm  outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Prix max (XAF)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={filters.prix} 
                    placeholder="500000"
                    onChange={(e) => setFilters({ ...filters, prix: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm  pl-11 outline-none"
                  />
                  <Banknote className="absolute left-4 top-4 text-gray-400" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Pièces min</label>
                <div className="relative">
                  <input
                    type="number"
                    value={filters.pieces} 
                    placeholder="2"
                    onChange={(e) => setFilters({ ...filters, pieces: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm  pl-11 outline-none"
                  />
                  <LayoutGrid className="absolute left-4 top-4 text-gray-400" size={18} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="max-w-[1600px] mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2b3c]">Annonces Actuelles</h2>
            <p className="text-gray-400 text-sm font-medium">{annonces.length} annonces disponibles</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f97316]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentAnnonces.map((annonce) => (
              <div
                key={annonce.id}
                onClick={() => navigate(`/detail/${annonce.id}`)}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={BienService.formatImageUrl(annonce.images?.[0])}
                    alt={annonce.nom}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xl font-extrabold text-[#f97316]">
                      {annonce.prix?.toLocaleString()} XAF
                    </p>
                    <div className="flex items-center gap-1 text-[#facc15]">
                      <span className="text-sm font-bold text-gray-700">4.0</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>



                  <h4 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {annonce.titreBien || "Sans titre"}
                  </h4>
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                      {annonce.categorie}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-gray-500 font-medium">
                    <div className="flex items-center gap-1 text-xs truncate max-w-[150px]">
                      <MapPin size={14} className="text-blue-500" />
                      <span>{annonce.ville}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Home size={14} />
                      {annonce.nbrePiece} pcs
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination  */}
        {annonces.length > annoncesPerPage && (
          <div className="mt-16 flex justify-center items-center gap-3">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black transition-all ${currentPage === i + 1 ? 'bg-[#f97316] text-white' : 'bg-white text-gray-400 border'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RecherchePage;
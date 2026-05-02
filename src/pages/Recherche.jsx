import React, { useState } from 'react';
import {
  Search, MapPin, Home, Filter, ChevronDown, ChevronUp,
  Banknote, LayoutGrid, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecherchePage = () => {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const annoncesPerPage = 8; 

  const annonces = [
    { id: 1, titre: "Appartement meublé", prix: 300000, localisation: "Bastos, Yaoundé", pieces: 4, type: "Appartement", type_prix: "mois", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    { id: 2, titre: "Studio moderne", prix: 150000, localisation: "Akwa, Douala", pieces: 1, type: "Studio", type_prix: "mois", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600" },
    { id: 3, titre: "Villa de luxe", prix: 50000000, localisation: "Kribi", pieces: 8, type: "Villa", type_prix: "vente", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600" },
    { id: 4, titre: "Duplex familial", prix: 450000, localisation: "Bastos, Yaoundé", pieces: 6, type: "Duplex", type_prix: "mois", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    { id: 5, titre: "Chambre étudiante", prix: 45000, localisation: "Bonamoussadi, Douala", pieces: 1, type: "Chambre", type_prix: "mois", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600" },
    { id: 6, titre: "Résidence calme", prix: 750000, localisation: "Santa Barbara, Yaoundé", pieces: 5, type: "Appartement", type_prix: "mois", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600" },
    { id: 7, titre: "Loft industriel", prix: 1200000, localisation: "Bonapriso, Douala", pieces: 3, type: "Loft", type_prix: "mois", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    { id: 8, titre: "Maison de plage", prix: 85000000, localisation: "Kribi", pieces: 4, type: "Maison", type_prix: "vente", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600" },
    { id: 9, titre: "Appartement Bastos", prix: 350000, localisation: "Bastos, Yaoundé", pieces: 3, type: "Appartement", type_prix: "mois", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
  ];

  const indexOfLastAnnonce = currentPage * annoncesPerPage;
  const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
  const currentAnnonces = annonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);
  const totalPages = Math.ceil(annonces.length / annoncesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    /* Changement de la couleur de fond ici : bg-[#f8f6f2] */
    <div className="min-h-screen bg-[#f8f6f2] pb-20 font-sans">

      {/* BARRE DE RECHERCHE SECTION */}
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
                <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl appearance-none outline-none text-sm cursor-pointer font-semibold text-gray-700">
                  <option>Tous les types</option>
                  <option>Location</option>
                  <option>Vente</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Catégorie</label>
              <div className="relative">
                <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl appearance-none outline-none text-sm cursor-pointer font-semibold text-gray-700">
                  <option>Toutes catégories</option>
                  <option>Appartement</option>
                  <option>Studio</option>
                  <option>Villa</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Ville</label>
              <div className="relative">
                <input type="text" placeholder="Yaoundé, Douala..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm pl-11 font-semibold" />
                <MapPin className="absolute left-4 top-4 text-[#f97316]" size={18} />
              </div>
            </div>

            <button className="bg-[#1a2b3c] text-white p-4 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-[#007b83] transition-all h-[54px] shadow-lg shadow-gray-200">
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
                <input type="text" placeholder="Ex: Bastos" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Prix max (XAF)</label>
                <div className="relative">
                  <input type="number" placeholder="500.000" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold pl-11 outline-none" />
                  <Banknote className="absolute left-4 top-4 text-gray-400" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Pièces min</label>
                <div className="relative">
                  <input type="number" placeholder="2" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold pl-11 outline-none" />
                  <LayoutGrid className="absolute left-4 top-4 text-gray-400" size={18} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RÉSULTATS DE RECHERCHE */}
      <section className="max-w-[1600px] mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2b3c]">
              Annonces Actuelles
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              {annonces.length} annonces disponibles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentAnnonces.map((annonce) => (
            <div
              key={annonce.id}
              onClick={() => navigate(`/details/${annonce.id}`)}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={annonce.img}
                  alt={annonce.titre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xl font-extrabold text-[#f97316]">
                    {annonce.prix.toLocaleString()} XAF <span className="text-[10px] font-normal text-gray-400 uppercase">/ {annonce.type_prix || 'mois'}</span>
                  </p>
                  <div className="flex items-center gap-1 text-[#facc15]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-bold text-gray-700">4.0</span>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-gray-800 mb-2 truncate">
                  {annonce.titre}
                </h4>

                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                    {annonce.type || "Bien"}
                  </span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-gray-500 font-medium">
                  <div className="flex items-center gap-1 text-xs truncate max-w-[150px]">
                    <MapPin size={14} className="text-blue-500" />
                    <span className="truncate">{annonce.localisation}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                    <Home size={14} className="text-gray-400" />
                    {annonce.pieces || "0"} pièces
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION PAGINATION */}
        {annonces.length > annoncesPerPage && (
          <div className="mt-16 flex justify-center items-center gap-3">
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 rounded-2xl border transition-all duration-300 ${currentPage === 1
                  ? 'text-gray-200 border-gray-100 cursor-not-allowed'
                  : 'bg-white text-[#1a2b3c] border-gray-200 hover:bg-[#1a2b3c] hover:text-white hover:shadow-lg'
                }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black transition-all duration-300 ${currentPage === i + 1
                      ? 'bg-[#f97316] text-white shadow-lg shadow-orange-100 scale-105'
                      : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-2xl border transition-all duration-300 ${currentPage === totalPages
                  ? 'text-gray-200 border-gray-100 cursor-not-allowed'
                  : 'bg-white text-[#1a2b3c] border-gray-200 hover:bg-[#1a2b3c] hover:text-white hover:shadow-lg'
                }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

    </div>
  );
};

export default RecherchePage;
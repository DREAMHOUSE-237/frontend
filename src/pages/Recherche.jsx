import React, { useState } from 'react';
import { 
  Search, MapPin, Home, Filter, ChevronDown, ChevronUp, 
  Banknote, LayoutGrid, BedDouble, Bath, Calendar, Car,
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecherchePage = () => {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // 1. État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const annoncesPerPage = 6;

  // Données simulées (À remplacer par l'appel API de ton backend plus tard)
  const annonces = [
    { id: 1, titre: "Appartement meublé", prix: 3000000, localisation: "Bastos, Yaoundé", chambres: 3, douches: 4, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    { id: 2, titre: "Studio moderne", prix: 150000, localisation: "Akwa, Douala", chambres: 1, douches: 1, duree: 1, parking: false, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600" },
    { id: 3, titre: "Villa de luxe", prix: 5000000, localisation: "Kribi", chambres: 5, douches: 5, duree: 12, parking: true, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600" },
    { id: 4, titre: "Appartement meublé", prix: 3000000, localisation: "Bastos, Yaoundé", chambres: 3, douches: 4, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    { id: 5, titre: "Studio moderne", prix: 150000, localisation: "Akwa, Douala", chambres: 1, douches: 1, duree: 1, parking: false, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600" },
    { id: 6, titre: "Villa de luxe", prix: 5000000, localisation: "Kribi", chambres: 5, douches: 5, duree: 12, parking: true, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600" },
    { id: 7, titre: "Résidence calme", prix: 450000, localisation: "Santa Barbara, Yaoundé", chambres: 4, douches: 3, duree: 6, parking: true, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
  ];

  // 2. Logique de pagination
  const indexOfLastAnnonce = currentPage * annoncesPerPage;
  const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
  const currentAnnonces = annonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);
  const totalPages = Math.ceil(annonces.length / annoncesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 450, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* BARRE DE RECHERCHE SECTION */}
      <div className="max-w-7xl mx-auto px-6 pt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          
          <div className="flex items-center space-x-2 mb-6 text-[#007b83]">
            <Filter size={20} className="text-[#ff8800]" />
            <h2 className="font-bold uppercase tracking-wider text-sm">Filtres de recherche</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type</label>
              <div className="relative">
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none outline-none text-sm cursor-pointer">
                  <option>Tous les types</option>
                  <option>Location</option>
                  <option>Vente</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Catégorie</label>
              <div className="relative">
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none outline-none text-sm cursor-pointer">
                  <option>Toutes catégories</option>
                  <option>Appartement Meublé</option>
                  <option>Studio</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ville</label>
              <div className="relative">
                <input type="text" placeholder="Yaoundé, Douala..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm pl-10" />
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <button className="bg-[#007b83] text-white p-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-[#00666d] transition-all h-[46px]">
              <Search size={20} />
              <span>Rechercher</span>
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs font-bold text-[#ff8800] hover:underline flex items-center space-x-1">
              <span>{showAdvanced ? "Masquer options" : "Plus d'options"}</span>
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quartier</label>
                <input type="text" placeholder="Ex: Bastos" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Prix max (XAF)</label>
                <div className="relative">
                  <input type="number" placeholder="500.000" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm pl-10" />
                  <Banknote className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Pièces min</label>
                <div className="relative">
                  <input type="number" placeholder="2" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm pl-10" />
                  <LayoutGrid className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RÉSULTATS DE RECHERCHE */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Résultats trouvés <span className="text-[#007b83]">({annonces.length})</span>
          </h2>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentAnnonces.map((annonce) => (
            <div 
              key={annonce.id} 
              onClick={() => navigate(`/details/${annonce.id}`)} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100 overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={annonce.img} alt={annonce.titre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-[#007b83] text-xl font-extrabold mb-1">{annonce.titre}</h3>
                <p className="text-xl font-bold text-gray-700 mb-2">{annonce.prix.toLocaleString()} Fcfa</p>
                <p className="text-gray-400 text-xs line-clamp-2 mb-6 uppercase font-bold tracking-tight">{annonce.localisation}</p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <BedDouble size={18} className="text-green-700" />
                    <span className="font-bold text-gray-700">{annonce.chambres}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath size={18} className="text-orange-500" />
                    <span className="font-bold text-gray-700">{annonce.douches}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={18} className="text-[#007b83]" />
                    <span className="font-bold text-gray-700">{annonce.duree}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car size={18} className={annonce.parking ? "text-red-600" : "text-gray-200"} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {annonces.length > annoncesPerPage && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button 
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'text-gray-300 border-gray-100' : 'text-[#007b83] border-[#007b83] hover:bg-[#007b83] hover:text-white'}`}
            >
              <ChevronLeft size={24} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1 ? 'bg-[#007b83] text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'text-gray-300 border-gray-100' : 'text-[#007b83] border-[#007b83] hover:bg-[#007b83] hover:text-white'}`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default RecherchePage;
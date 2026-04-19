import React, { useState } from 'react';
import { 
  Home, Key, Tag, ShieldCheck, Handshake, 
  Calculator, Search, Coins, MessageCircle,
  BedDouble, Bath, Calendar, Car,
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import acc1 from '../assets/acc1.png';
import acc2 from '../assets/acc2.jpg';
import acc3 from '../assets/acc3.jpg';

const Accueil = () => {
  const navigate = useNavigate();

  // 1. État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const annoncesPerPage = 6;

  const annonces = [
    { id: 1, titre: "Appartement meublé", prix: 3000000, localisation: "Bastos, Yaoundé", chambres: 3, douches: 4, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    { id: 2, titre: "Appartement meublé", prix: 2300000, localisation: "Bastos, Yaoundé", chambres: 2, douches: 3, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600" },
    { id: 3, titre: "Appartement meublé", prix: 2300000, localisation: "Bastos, Yaoundé", chambres: 2, douches: 3, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    { id: 4, titre: "Appartement meublé", prix: 2300000, localisation: "Bastos, Yaoundé", chambres: 2, douches: 3, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600" },
    { id: 5, titre: "Appartement meublé", prix: 2300000, localisation: "Bastos, Yaoundé", chambres: 2, douches: 3, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    { id: 6, titre: "Appartement meublé", prix: 2300000, localisation: "Bastos, Yaoundé", chambres: 2, douches: 3, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600" },
    { id: 7, titre: "Appartement meublé", prix: 2300000, localisation: "Bastos, Yaoundé", chambres: 2, douches: 3, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    { id: 8, titre: "Appartement meublé", prix: 2300000, localisation: "Bastos, Yaoundé", chambres: 2, douches: 3, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600" },
    { id: 9, titre: "Appartement meublé", prix: 2300000, localisation: "Bastos, Yaoundé", chambres: 2, douches: 3, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
  ];

  // 2. Calcul des index pour la pagination
  const indexOfLastAnnonce = currentPage * annoncesPerPage;
  const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
  const currentAnnonces = annonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);
  const totalPages = Math.ceil(annonces.length / annoncesPerPage);

  // 3. Fonctions de navigation
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' }); // Remonte doucement vers les annonces
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bannière */}
      <div className='relative h-[300px] md:h-[450px] w-full overflow-hidden'>
        <img src={acc1} alt="Bannière" className="w-full h-full object-cover" />
      </div>

      {/* Section des Annonces */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#007b83] inline-block border-b-4 border-[#007b83] pb-2">
            Propositions récentes
          </h2>
        </div>

        {/* Grille d'affichage des 6 annonces actuelles */}
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
                <p className="text-gray-500 text-sm line-clamp-2 mb-6">{annonce.localisation}</p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <BedDouble size={20} className="text-green-700" />
                    <span className="font-bold text-gray-700">{annonce.chambres}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath size={20} className="text-orange-500" />
                    <span className="font-bold text-gray-700">{annonce.douches}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={20} className="text-[#007b83]" />
                    <span className="font-bold text-gray-700">{annonce.duree}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car size={20} className="text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Barre de Pagination (S'affiche seulement si > 6 annonces) */}
        {annonces.length > annoncesPerPage && (
          <div className="mt-12 flex justify-center items-center gap-2">
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
                className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1 ? 'bg-[#007b83] text-white' : 'text-gray-400 hover:bg-gray-100'}`}
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

      {/* Section Services */}
     <section className="bg-[#007b83] py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white inline-block border-b-4 border-white pb-2 uppercase tracking-wide">
              Nos services et accompagnements
            </h2>
          </div>
          <div className="flex md:grid md:grid-cols-2 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-6">
            <div className="min-w-[85vw] md:min-w-0 snap-center bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-4 bg-gray-50 text-center border-b italic text-[#007b83] font-semibold">Gestion immobilière</div>
              <img 
                src={acc2} 
                className="w-full h-48 object-cover" 
                alt="Gestion Immobilière" 
              />
              <div className="p-6 space-y-6 flex-grow">
                <div className="flex items-center space-x-5">
                  <div className="p-3 bg-[#f0f9fa] rounded-lg shrink-0">
                    <Handshake className="w-6 h-6 text-[#007b83]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Rentabilité du bien</h4>
                    <p className="text-xs text-gray-500">Plus de revenus et de tranquillité pour vous</p>
                  </div>
                </div>
                <div className="flex items-center space-x-5">
                  <div className="p-3 bg-[#f0f9fa] rounded-lg shrink-0">
                    <Calculator className="w-6 h-6 text-[#007b83]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Gestion du bien</h4>
                    <p className="text-xs text-gray-500">Nous nous occupons de vos locataires, la sante du  bâtiment, administratif...</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#007b83] text-white rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-[#00666d]">
                  <MessageCircle className="w-5 h-5" /> 
                  <span>Contactez nous</span>
                </button>
              </div>
            </div>
            <div className="min-w-[85vw] md:min-w-0 snap-center bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-4 bg-gray-50 text-center border-b italic text-[#007b83] font-semibold">Accompagnement et conseil</div>
              <img 
                src={acc3}
                className="w-full h-48 object-cover" 
                alt="Accompagnement et Conseil" 
              />
              <div className="p-6 space-y-6 flex-grow">
                <div className="flex items-center space-x-5">
                  <div className="p-3 bg-[#f0f9fa] rounded-lg shrink-0">
                    <Search className="w-6 h-6 text-[#007b83]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Recherche et sélection</h4>
                    <p className="text-xs text-gray-500">Trouvez rapidement le bien idéal</p>
                  </div>
                </div>
                <div className="flex items-center space-x-5">
                  <div className="p-3 bg-[#f0f9fa] rounded-lg shrink-0">
                    <Coins className="w-6 h-6 text-[#007b83]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Négociation</h4>
                    <p className="text-xs text-gray-500">Le meilleur investissement selon vos ressources</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#007b83] text-white rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-[#00666d]">
                  <MessageCircle className="w-5 h-5" /> 
                  <span>Contactez nous</span>
                </button>
              </div>
            </div>

          </div>
          <div className="flex justify-center space-x-2 mt-4 md:hidden">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
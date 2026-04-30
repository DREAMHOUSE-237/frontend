import React, { useState, useEffect } from 'react';
import { 
  BedDouble, Bath, Calendar, Car, Search, 
  ChevronLeft, ChevronRight, MessageCircle, 
  Handshake, Calculator, Coins 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import acc1 from '../assets/acc1.png';
import acc2 from '../assets/acc2.jpg';
import acc3 from '../assets/acc3.jpg';

const Accueil = () => {
  const navigate = useNavigate();

  // --- LOGIQUE DE L'ANIMATION DYNAMIQUE ---
  const [index, setIndex] = useState(0);
  const words = ["ressemble enfin.", "donne le sourire.", "appartient déjà."]; // <--- La définition manquante
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1500);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);
  // ------------------------------------------

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const annoncesPerPage = 6;

  const annonces = [
    { id: 1, titre: "Appartement meublé", prix: 3000000, localisation: "Bastos, Yaoundé", chambres: 3, douches: 4, duree: 3, parking: true, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600" },
    // ... tes autres annonces ...
  ];

  const indexOfLastAnnonce = currentPage * annoncesPerPage;
  const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
  const currentAnnonces = annonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);
  const totalPages = Math.ceil(annonces.length / annoncesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const section = document.getElementById('annonces-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bannière d'accueil avec animation */}
      <div className='relative h-[500px] md:h-[650px] w-full overflow-hidden'>
        <img 
          src={acc1} 
          alt="Bannière" 
          className="w-full h-full object-cover animate-slow-zoom" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-4xl space-y-6">
            <span className="inline-block px-4 py-1.5 mb-2 rounded-full bg-[#007b83]/30 text-[#007b83] border border-[#007b83]/50 backdrop-blur-md text-sm font-semibold tracking-widest uppercase">
              Bienvenue chez Dreamhouse
            </span>

            <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight min-h-[160px] flex flex-col items-center justify-center">
              <span>L'immobilier qui vous</span>
              <span className="text-white flex items-center">
                {words[index].substring(0, subIndex)}
                <span className="w-1 h-10 md:h-16 bg-[#007b83] ml-1 animate-blink"></span>
              </span>
            </h1>

            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Découvrez une sélection exclusive de biens d'exception au cœur du Cameroun.
            </p>

            <div className="flex gap-4 justify-center pt-6">
               <button className="px-8 py-4 bg-[#007b83] text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#007b83]/30">
                  Explorer les biens
               </button>
            </div>
          </div>
        </div>
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

    </div>
  );
};

export default Accueil;
import React, { useState, useEffect } from 'react';
import { MapPin, Home, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {  BienService } from '../service/auth_service'; // Import de tes services
import acc1 from '../assets/acc1.png';

const Accueil = () => {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIQUE DE L'ANIMATION TYPING ---
  const [index, setIndex] = useState(0);
  const words = ["ressemble enfin.", "donne le sourire.", "appartient déjà."]; 
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  // Récupération des données réelles du backend
  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const data = await BienService.getAll();
        setAnnonces(data);
      } catch (error) {
        console.error("Erreur backend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnonces();
  }, []);

  // Animation du texte
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bannière d'accueil */}
      <div className='relative h-[500px] md:h-[650px] w-full overflow-hidden'>
        <img src={acc1} alt="Bannière" className="w-full h-full object-cover animate-slow-zoom" />
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
          </div>
        </div>
      </div>

      {/* Section des Annonces */}
      <section className="py-12 px-6 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a2b3c]">
              Annonces Actuelles
            </h2>
          </div>
          {/* Compteur total dynamique du backend */}
          <span className="text-gray-500 text-sm font-medium">
            {loading ? "..." : annonces.length} annonces disponibles
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 italic text-gray-400">Chargement des meilleures opportunités...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Affichage de seulement 4 annonces avec slice(0, 4) */}
            {annonces.slice(0, 4).map((annonce) => (
              <div
                key={annonce.id}
                onClick={() => navigate(`/detail/${annonce.id}`)}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img 
                    src={BienService.formatImageUrl(annonce.images?.[0])} 
                    alt={annonce.titreBien} 
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
                        <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
                      </svg>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {annonce.titreBien}
                  </h4>

                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                      {annonce.categorie}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-gray-500">
                    <div className="flex items-center gap-1 text-xs truncate">
                      <MapPin size={14} className="text-[#007b83]" />
                      {annonce.quartier}, {annonce.ville}
                    </div>
                    <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                      <Home size={14} />
                      {annonce.nbrePiece} p.
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate('/catalogue')}
            className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-50 hover:shadow-md transition-all duration-300"
          >
            Découvrir les {annonces.length} biens
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Appel à l'action Propriétaires */}
      <section className="w-full bg-[#007b83] mt-12">
        <div className="max-w-[1600px] mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-auto order-2 md:order-1">
              <button 
                onClick={() => navigate('/connexion')}
                className="group flex items-center justify-center gap-4 w-full md:w-auto px-12 py-6 bg-white text-[#007b83] font-black text-xl hover:bg-gray-100 rounded-xl transition-all duration-300 shadow-xl"
              >
                Commencer maintenant
                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="flex-1 text-white text-center md:text-left order-1 md:order-2">
              <h3 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">
                Vous êtes propriétaire ?
              </h3>
              <p className="text-white/90 text-xl md:text-2xl leading-relaxed font-medium">
                Maximisez la visibilité de vos biens en quelques clics. 
                <span className="block mt-4 font-bold text-white border-l-4 border-white/30 pl-4">
                  Connectez-vous pour publier et être contacté directement.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
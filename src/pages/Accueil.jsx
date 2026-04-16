import React from 'react';
import { Home, Key, Tag, ShieldCheck, Handshake, Calculator, Search, Coins, MessageCircle } from 'lucide-react';
import acc1 from '../assets/acc1.png'
import acc2 from '../assets/acc2.jpg'
import acc3 from '../assets/acc3.jpg'
const Accueil = () => {
  const categories = [
    { id: 1, title: "Non meublé", icon: <Home className="w-8 h-8 text-[#007b83]" />, desc: "Maisons ou appartements en location non meublée mais avec des loyers plus abordables !", img: "https://via.placeholder.com/400x250" },
    { id: 2, title: "Meublé", icon: <Key className="w-8 h-8 text-[#007b83]" />, desc: "Maisons ou appartements à louer avec tout le nécessaire pour s'y installer rapidement !", img: "https://via.placeholder.com/400x250" },
    { id: 3, title: "À vendre", icon: <Tag className="w-8 h-8 text-[#007b83]" />, desc: "Découvrez des logements à vendre d'exception: des biens clés en main et à des prix attractifs !", img: "https://via.placeholder.com/400x250" },
    { id: 4, title: "Sans commission", icon: <ShieldCheck className="w-8 h-8 text-[#007b83]" />, desc: "Des maisons ou appartements en location sans frais de commission, avec une qualité garantie", img: "https://via.placeholder.com/400x250" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='relative h-[300px] md:h-[450px] w-full overflow-hidden'>
        <img 
          src={acc1} 
          alt="Bannière" 
          className="w-full h-full object-cover" 
        />
      </div>
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#007b83] inline-block border-b-4 border-[#007b83] pb-2">
            Recherchez un bien
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow group">
              <div className="relative overflow-hidden">
                <img src={cat.img} alt={cat.title} className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-sm">
                  {cat.icon}
                </div>
              </div>
              <div className="p-5 flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{cat.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{cat.desc}</p>
              </div>
              <div className="p-4 border-t border-gray-100 text-center">
                <button className="text-[#007b83] font-bold hover:text-[#ff8800] transition-colors">Voir</button>
              </div>
            </div>
          ))}
        </div>
      </section>
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
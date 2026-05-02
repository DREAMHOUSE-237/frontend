import React from 'react';
import { 
  MapPin, 
  Home, 
  Calendar, 
  MoreVertical, 
  Trash2, 
  Edit3,
  ExternalLink
} from 'lucide-react';

const MyPublications = () => {
  // Simulation des données provenant de ton backend
  const publications = [
    {
      id: 1,
      titre: "Studio moderne meublé",
      prix: "150 000",
      ville: "Yaoundé",
      quartier: "Bastos",
      categorie: "Studio",
      date: "12 Oct 2023",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400",
      statut: "validé"
    },
    {
      id: 2,
      titre: "Appartement de standing",
      prix: "350 000",
      ville: "Douala",
      quartier: "Bonapriso",
      categorie: "Appartement",
      date: "10 Oct 2023",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400",
      statut: "en attente"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête de la page */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes publications</h1>
            <p className="text-gray-500 text-sm">Gérez vos annonces immobilières</p>
          </div>
          <span className="bg-[#007b83]/10 text-[#007b83] px-4 py-2 rounded-full text-sm font-bold">
            {publications.length} Annonces
          </span>
        </div>

        {/* Liste des annonces */}
        <div className="space-y-4">
          {publications.map((pub) => (
            <div 
              key={pub.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col sm:flex-row group hover:shadow-md transition-shadow"
            >
              {/* Image de l'annonce */}
              <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                <img 
                  src={pub.image} 
                  alt={pub.titre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                    pub.statut === 'validé' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-amber-500 text-white'
                  }`}>
                    {pub.statut}
                  </span>
                </div>
              </div>

              {/* Détails de l'annonce */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{pub.titre}</h3>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-[#007b83]" /> {pub.quartier}, {pub.ville}
                      </span>
                      <span className="flex items-center gap-1">
                        <Home size={14} className="text-[#ff8800]" /> {pub.categorie}
                      </span>
                    </div>
                  </div>
                  
                  {/* Menu d'actions (Trois points) */}
                  <div className="flex gap-2">
                    <a href="/Modif">
                     <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit3 size={18} />
                    </button>
                    </a>
                   
                    <button className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Prix Mensuel</span>
                    <span className="text-xl font-black text-[#007b83]">{pub.prix} <small className="text-xs">FCFA</small></span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Calendar size={14} />
                    Posté le {pub.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* État vide si aucune publication */}
        {publications.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Aucune publication</h3>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore ajouté d'annonces.</p>
            <button className="bg-[#007b83] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
              Créer ma première annonce
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyPublications;
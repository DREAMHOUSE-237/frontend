import React from 'react';
import { Mail, Linkedin, GraduationCap } from 'lucide-react';

const Equipe = () => {
  const etudiants = [
    {
      id: 1,
      nom: "Votre Nom 1",
      role: "Responsable du Service Authentification , les logiques de Deploiement",
      description: "Étudiant en Master 1 - Informatique, Université de Yaoundé 1.",
      image: "https://via.placeholder.com/150" 
    },
    {
      id: 2,
      nom: "Votre Nom 2",
      role: "Responsable du Service de Publication",
      description: "Étudiant en Master 1 - Informatique, Université de Yaoundé 1.",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      nom: "Votre Nom 3",
      role: "Responsable du Service User et Identity",
      description: "Étudiant en Master 1 - Informatique, Université de Yaoundé 1.",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 4,
      nom: "Votre Nom 4",
      role: "Responsable du Service de Commentaire et Paiement",
      description: "Étudiant en Master 1 - Informatique, Université de Yaoundé 1.",
      image: "https://via.placeholder.com/150"
    }
    ,
    {
      id: 5,
      nom: "Votre Nom 4",
      role: "Responsable du Design UI/UX ",
      description: "Étudiant en Master 1 - Informatique, Université de Yaoundé 1.",
      image: "https://via.placeholder.com/150"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header de la page */}
      <div className="py-16 px-6 max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#007b83] rounded-full flex items-center justify-center text-white">
            <GraduationCap size={40} />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          <span className="text-[#007b83]">DreamHouse</span> est un projet porté par des étudiants de 
          <span className="text-[#ff8800]"> Master 1</span> de l'Université de Yaoundé 1.
        </h1>
        <p className="text-gray-600 leading-relaxed italic">
          Notre objectif est de faciliter les transactions immobilières au Cameroun 
          en connectant efficacement acheteurs, locataires et bailleurs à travers 
          une solution technologique moderne.
        </p>
      </div>

      {/* Section Équipe */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-[#007b83] text-2xl font-bold uppercase tracking-widest mb-16 border-b-2 border-[#007b83] w-fit mx-auto pb-2">
            Découvrez notre équipe
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {etudiants.map((membre) => (
              <div key={membre.id} className="group">
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100">
                  {/* Avatar avec cercle couleur */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full border-4 border-[#007b83] p-1 overflow-hidden group-hover:border-[#ff8800] transition-colors">
                      <img 
                        src={membre.image} 
                        alt={membre.nom} 
                        className="w-full h-full object-cover rounded-full bg-gray-200"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800">{membre.nom}</h3>
                  <p className="text-[#007b83] text-sm font-semibold mb-3 italic">{membre.role}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6">
                    {membre.description}
                  </p>

                  {/* Réseaux Sociaux */}
                  <div className="flex space-x-4 mt-auto">
                    <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-[#007b83] transition-colors">
                      <Linkedin size={18} />
                    </button>
                    <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-[#ff8800] transition-colors">
                      <Mail size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipe;
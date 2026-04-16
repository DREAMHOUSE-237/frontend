import React from 'react';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag as TagIcon, 
  ShieldCheck, 
  Search, 
  MessageCircle, 
  FileText,
  MapPin,
  Lightbulb
} from 'lucide-react';
import con from '../assets/con.jpg'
const ActusConseils = () => {
  
  const conseilsSupplementaires = [
    {
      title: "Vérifiez la situation juridique du bien",
      desc: "Avant tout paiement, exigez de voir le titre foncier ou le certificat de propriété. Assurez-vous que la personne avec qui vous traitez est bien le propriétaire ou un mandataire légitime.",
      icon: <ShieldCheck className="text-[#007b83]" />
    },
    {
      title: "Inspectez l'environnement en saison de pluie",
      desc: "À Yaoundé ou Douala, l'accessibilité change selon la météo. Vérifiez l'état des routes et l'absence de zones inondables autour du logement.",
      icon: <MapPin className="text-[#007b83]" />
    },
    {
      title: "Exigez un bail écrit",
      desc: "Ne vous contentez jamais d'un accord verbal. Un contrat de bail écrit et enregistré vous protège contre les expulsions arbitraires et définit clairement les charges (eau, électricité).",
      icon: <FileText className="text-[#007b83]" />
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* 1. Header de l'Article */}
      <div className="max-w-4xl mx-auto pt-12 px-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6 text-center">
          Les SECRETS Pour Toujours Avoir Des Locataires Dans Son Logement 
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm border-b pb-8">
          <div className="flex items-center space-x-1">
            <User size={16} /> <span>Par Équipe DreamHouse</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={16} /> <span>10 Mars 2026</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={16} /> <span>8 min de lecture</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
        
        {/* 2. Contenu Principal (Gauche) */}
        <div className="lg:col-span-2 space-y-10">
          <img 
            src={con}
            alt="Recherche logement" 
            className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
          />

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#007b83] flex items-center gap-2">
                1. Offrez un logement meublé attractif et compétitif
              </h2>
              <p className="mt-4">
                Pour attirer des locataires, assurez-vous que votre logement meublé est accueillant. Optez pour une décoration moderne, des meubles de qualité et des équipements fonctionnels (Wi-Fi, climatisation, réserve d'eau). Un beau logement se loue 3x plus vite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#007b83] flex items-center gap-2">
                2. Fixez un loyer juste (Prix du marché)
              </h2>
              <p className="mt-4">
                Un loyer trop élevé décourage, un loyer trop bas éveille les soupçons. Étudiez les prix dans votre quartier (Bastos, Akwa, etc.) pour rester compétitif tout en garantissant votre rentabilité.
              </p>
            </section>

             <section>
              <h2 className="text-2xl font-bold text-[#007b83] flex items-center gap-2">
                3. Faites la promotion de vos logements :
              </h2>
              <p className="mt-4">
               Les plateformes de location en ligne sont un excellent moyen de communiquer sur votre logement. Inscrivez-vous sur des sites spécialisés tels que DreamHouse. Assurez-vous de créer une annonce attrayante avec des photos de qualité et une description détaillée de votre logement et de ses avantages. Partagez des témoignages de locataires satisfaits, et des informations sur les événements ou les attractions locales.
              </p>
            </section>

            <div className="bg-[#f0f9fa] p-8 rounded-2xl border-l-4 border-[#007b83]">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lightbulb className="text-[#ff8800]" /> Conseils d'experts  pour chercheurs
              </h2>
              <div className="space-y-6">
                {conseilsSupplementaires.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Section Commentaires */}
          <div className="mt-16 border-t pt-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <MessageCircle className="text-[#007b83]" /> Commentaires
            </h3>
            
            <div className="space-y-6 mb-10">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-[#007b83] rounded-full flex items-center justify-center text-white font-bold">Y</div>
                  <span className="font-bold">Yvan Pimi</span>
                  <span className="text-xs text-gray-400">Il y a 2 jours</span>
                </div>
                <p className="text-gray-600 ml-13">Excellent article ! L'aspect de la réserve d'eau est crucial à Yaoundé.</p>
              </div>
            </div>

            {/* Formulaire */}
            <form className="bg-white border rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Nom *" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#007b83] outline-none" />
                <input type="email" placeholder="Email *" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#007b83] outline-none" />
              </div>
              <textarea placeholder="Laissez un message..." rows="4" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#007b83] outline-none mb-4"></textarea>
              <button className="bg-[#007b83] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#00666d] transition-all">
                Publier le commentaire
              </button>
            </form>
          </div>
        </div>

        {/* 4. Sidebar (Droite) */}
        <div className="space-y-8">
          <div className="bg-white border p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Contactez-nous</h3>
            <p className="text-sm text-gray-500 mb-4">Une question sur un logement ? Notre équipe Master 1 vous répond.</p>
            <button className="w-full py-3 border-2 border-[#007b83] text-[#007b83] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#f0f9fa]">
               Nous écrire <MessageCircle size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActusConseils;
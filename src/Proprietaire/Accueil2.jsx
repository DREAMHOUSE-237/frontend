import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Zap, 
  BadgeCheck, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  ArrowRight 
} from 'lucide-react';


const ProprietaireHome = () => {
  const navigate = useNavigate();
 const [userName, setUserName] = useState("Utilisateur");

 useEffect(() => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (userData) {
    const user = JSON.parse(userData);
    if (user.email) {
      setUserName(user.email.split('@')[0]);
      return; 
    }
  }

  // Décoder le token si l'objet user est absent
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      const name = payload.email || payload.nom || "Utilisateur";
      setUserName(name.includes('@') ? name.split('@')[0] : name);
    } catch (e) {
      console.error("Erreur décodage", e);
    }
  }
}, []);

  const user = {
    prenom: userName,
  };

  const partnerBg = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1920&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#f8f6f2] pb-20 font-sans">
      
      {/* 1. SECTION BIENVENUE */}
      <div className="w-full relative">
        <div 
          className="relative py-20 md:py-32 px-6 text-white overflow-hidden shadow-2xl bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${partnerBg})`,
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-[#1a2b3c]/85 backdrop-blur-[2px]"></div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-[#007b83] opacity-20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f97316] opacity-10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
          
          <div className="max-w-[1600px] mx-auto relative z-10">
            <h2 className="text-[#f97316] font-black uppercase tracking-[0.2em] text-sm mb-4">
              Espace Partenaire
            </h2>
            <h1 className="text-4xl md:text-7xl font-black leading-tight mb-10">
              Bienvenue dans votre <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007b83] to-blue-300">
                Lieu de Travail
              </span>
            </h1>
            
            {/* Badge Utilisateur */}
            <div className="flex items-center gap-5 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 w-fit shadow-2xl">
              <div className="w-14 h-14 bg-[#f97316] rounded-full flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/30 text-white">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="text-gray-300 text-xs uppercase font-black tracking-widest">Propriétaire Partenaire</p>
                <p className="text-2xl font-bold text-white">{user.prenom}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION DESCRIPTIONS (LES AVANTAGES) */}
      <div className="max-w-[1600px] mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Propagation */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-blue-50 text-[#007b83] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-black text-[#1a2b3c] mb-3">Maximisez votre visibilité</h3>
            <p className="text-gray-500 leading-relaxed">
              Facilitez la propagation de votre bien auprès de milliers de locataires potentiels chaque jour.
            </p>
          </div>

          {/* Card 2: Publication Facile */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-[#f97316]">
            <div className="w-14 h-14 bg-orange-50 text-[#f97316] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PlusCircle size={28} />
            </div>
            <h3 className="text-xl font-black text-[#1a2b3c] mb-3">Publication simplifiée</h3>
            <p className="text-gray-500 leading-relaxed">
              Ajoutez vos photos, descriptions et prix en quelques clics. Un processus pensé pour gagner du temps.
            </p>
          </div>

          {/* Card 3: Commission */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BadgeCheck size={28} />
            </div>
            <h3 className="text-xl font-black text-[#1a2b3c] mb-3">Transparence tarifaire</h3>
            <p className="text-gray-500 leading-relaxed">
              Frais de service fixes : payez seulement 5% du prix du loyer pour le type de publication si VENTE et 10000Fcfa si LOCATION ou BAIL lors de la publication de votre annonce.
            </p>
          </div>

          {/* Card 4: Modification/Suppression */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center"><Edit3 size={20} /></div>
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Trash2 size={20} /></div>
            </div>
            <h3 className="text-xl font-black text-[#1a2b3c] mb-3">Contrôle total</h3>
            <p className="text-gray-500 leading-relaxed">
              Modifiez vos tarifs ou supprimez votre bien instantanément une fois qu'il est pris ou loué.
            </p>
          </div>

          {/* Card 5: Contact Direct */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group lg:col-span-2">
            <div className="w-14 h-14 bg-green-50 text-[#25D366] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle size={28} />
            </div>
            <h3 className="text-xl font-black text-[#1a2b3c] mb-3">Lien direct via WhatsApp</h3>
            <p className="text-gray-500 leading-relaxed">
              Pas d'intermédiaires inutiles. Le client intéressé vous contacte directement sur votre messagerie WhatsApp pour conclure l'affaire.
            </p>
          </div>
        </div>
      </div>

      {/* 3. BOUTON D'ACTION FINAL */}
      <div className="max-w-[1600px] mx-auto px-6 mt-16 text-center">
        <button 
          onClick={() => navigate('/publication')}
          className="group relative inline-flex items-center justify-center px-12 py-6 font-black text-white bg-[#1a2b3c] rounded-3xl overflow-hidden shadow-2xl transition-all hover:bg-[#007b83] active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-3 text-lg uppercase tracking-widest">
            Commencer une publication
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#f97316] to-[#ff8800] opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </button>
        <p className="mt-6 text-gray-400 font-medium italic">
          Plus de 500 propriétaires nous font déjà confiance.
        </p>
      </div>

    </div>
  );
};

export default ProprietaireHome;
import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, DollarSign, Key, Calendar, Users, 
  Bath, Bike, MessageSquare, Send, User,
  Maximize2, Minimize2,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';

const Details = () => {
  const [comment, setComment] = useState("");
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const images = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070"
  ];

  const commentsList = [
    { id: 1, user: "Kieran Junior", text: "L'appartement est-il disponible immédiatement ?", date: "Hier" },
    { id: 2, user: "Alice Mbarga", text: "La caution est-elle négociable ?", date: "Il y a 2 jours" },
    { id: 3, user: "Marc Etoundi", text: "Superbe vue sur le Golf, je recommande.", date: "Il y a 5 jours" },
    { id: 4, user: "Samuel", text: "Le forage fonctionne-t-il avec un suppresseur ?", date: "Lundi" },
    { id: 4, user: "Samuel", text: "Le forage fonctionne-t-il avec un suppresseur ?", date: "Lundi" },
    { id: 4, user: "Samuel", text: "Le forage fonctionne-t-il avec un suppresseur ?", date: "Lundi" },
    { id: 4, user: "Samuel", text: "Le forage fonctionne-t-il avec un suppresseur ?", date: "Lundi" },
    { id: 4, user: "Samuel", text: "Le forage fonctionne-t-il avec un suppresseur ?", date: "Lundi" }
  ];

  // Fonctions de navigation (memoïsées pour être utilisées dans useEffect)
  const nextImage = useCallback(() => {
    setActiveImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Gestion du clavier pour la lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      
      if (e.key === 'Escape') setShowLightbox(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Nettoyage de l'évenement
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, nextImage, prevImage]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans text-gray-800 bg-white">
      
      {/* LIGHTBOX (Agrandissement image avec défilement) */}
      {showLightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 select-none">
          {/* Bouton Fermer */}
          <button 
            onClick={() => setShowLightbox(false)} 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            title="Fermer (Echap)"
          >
            <X size={40}/>
          </button>

          {/* Boutons de navigation de la Lightbox */}
          <button 
            onClick={prevImage} 
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            title="Précédent (Flèche gauche)"
          >
            <ChevronLeft size={32}/>
          </button>
          
          <button 
            onClick={nextImage} 
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            title="Suivant (Flèche droite)"
          >
            <ChevronRight size={32}/>
          </button>

          {/* Image grand format */}
          <img 
            src={images[activeImg]} 
            className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl object-contain animate-in fade-in zoom-in-95 duration-300" 
            alt={`Vue agrandie ${activeImg + 1}`} 
          />

          {/* Compteur d'images */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1.5 rounded-full text-sm font-medium">
            {activeImg + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLONNE GAUCHE (7/12) - VISUELS ET INFOS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Galerie Interactive (Page normale) */}
          <div className="space-y-2">
            <div className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-[16/9]">
              <img src={images[activeImg]} className="w-full h-full object-cover" alt="Principal" />
              
              {/* Boutons navigation sur page */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={prevImage} className="p-2 bg-white/80 rounded-full shadow hover:bg-white"><ChevronLeft/></button>
                <button onClick={nextImage} className="p-2 bg-white/80 rounded-full shadow hover:bg-white"><ChevronRight/></button>
              </div>
              
              {/* Bouton Agrandir */}
              <button 
                onClick={() => setShowLightbox(true)}
                className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded hover:bg-black transition-colors"
                title="Agrandir"
              >
                <Maximize2 size={18} />
              </button>
            </div>
            
            {/* Miniatures */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <img 
                  key={i} src={img} 
                  onClick={() => setActiveImg(i)}
                  className={`w-24 h-16 object-cover rounded cursor-pointer border-2 transition-all ${activeImg === i ? 'border-[#007b83] scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`} 
                  alt={`miniature ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Titre et Localisation */}
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-3xl font-light text-gray-700 italic">Appartement meublé .</h1>
            <div className="flex items-center text-[#007b83] mt-2 italic">
              <MapPin size={16} className="mr-1" />
              <span className="text-xs">Bastos, Yaoundé I, Yaoundé, Mfoundi, Région du Centre, Cameroun</span>
            </div>
          </div>

          {/* Tableau des informations (Simple) */}
          <div className="grid grid-cols-1 gap-1">
            <InfoLine icon={<DollarSign size={16}/>} label="Prix du Loyer" value="2,300,000 FCFA" />
            <InfoLine icon={<Key size={16}/>} label="Type de Publication" value="Location" />
            <InfoLine icon={<Calendar size={16}/>} label="Superficie" value="300 m^2" />
            <InfoLine icon={<Users size={16}/>} label="Nombre de Pieces" value="5" />
          </div>

          {/* Description */}
          <div className="pt-6 space-y-4">
            <h3 className="text-center text-gray-400 text-xs uppercase tracking-widest italic">Description du Bien </h3>
            <div className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto text-center italic">
              <p className="font-bold uppercase tracking-tight">Appartement ultra haut standing golf a louer meublé</p>
              <p className="text-[#007b83] font-bold">*LIEU* : Yaounde - CENTRE-VILLE - GOLF</p>
              <div className="mt-2 space-y-1">
                <p>✅ 02 chambres avec placards climatisé</p>
                <p>✅ 03 douches avec eau chaude</p>
                <p>✅ tres vaste cuisine avec rangement balcon</p>
                <p>✅ Salon lumineux</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (5/12) - CARTE, CONTACT, COMMENTAIRES */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Carte interactive agrandie */}
          <div className={`${isMapMaximized ? 'fixed inset-0 z-[150] p-10 bg-black/90' : 'relative'} transition-all duration-300`}>
            <div className={`bg-gray-100 border border-gray-200 rounded overflow-hidden relative ${isMapMaximized ? 'h-full w-full' : 'h-72 shadow-sm'}`}>
              <button 
                onClick={() => setIsMapMaximized(!isMapMaximized)}
                className="absolute top-3 right-3 z-10 bg-white p-2 rounded shadow hover:bg-gray-50 text-gray-600"
              >
                {isMapMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.653653139043!2d11.512687111245052!3d3.8842636960781794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7746538421%3A0xc3f34563a61f43a!2sBastos%2C%20Yaound%C3%A9!5e0!3m2!1sfr!2scm!4v1711012345678!5m2!1sfr!2scm" 
                className="w-full h-full grayscale-[0.3]"
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Carte Bastos Yaoundé"
              ></iframe>
            </div>
          </div>

          {/* Contact Agent */}
          <div className="border border-gray-100 rounded p-6 text-center space-y-4 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center border border-gray-50">
              <User size={40} className="text-gray-300" />
            </div>
            <div>
              <h3 className="font-bold text-xl italic uppercase tracking-tighter">OBAM Sylvia</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Agent Immobilier</p>
            </div>
            
            <a 
              href="https://wa.me/237694907134" 
              target="_blank" 
              rel="noreferrer"
              className="w-full bg-[#007b83] text-white py-4 rounded font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#00666d] transition shadow-lg uppercase"
            >
              <MessageSquare size={20} /> Contact WhatsApp
            </a>
            <button className="text-red-500 text-[10px] font-bold uppercase hover:underline">Signaler</button>
          </div>

          {/* Commentaires */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase text-gray-400 tracking-widest italic border-b pb-2">Commentaires</h3>
            
            <div className="max-h-64 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
              {commentsList.map(c => (
                <div key={c.id} className="text-[11px] border-b border-gray-50 pb-3 italic">
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>{c.user}</span>
                    <span className="font-normal text-gray-300">{c.date}</span>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <textarea 
                className="w-full border border-gray-100 p-3 text-xs rounded outline-none focus:border-[#007b83] transition bg-gray-50 italic"
                placeholder="Votre message..."
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="w-full mt-2 bg-gray-800 text-white py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-black transition">
                <Send size={14} className="inline mr-2" /> Envoyer
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Composants utilitaires
const InfoLine = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 transition group rounded">
    <div className="flex items-center gap-4 text-gray-400">
      <span className="w-5">{icon}</span>
      <span className="text-[13px] font-light italic">{label}</span>
    </div>
    <span className="text-[13px] font-semibold text-gray-700 italic tracking-tight">{value}</span>
  </div>
);

export default Details;
import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, DollarSign, Key, Calendar, Users, 
  MessageSquare, Send, User,
  Maximize2, Minimize2,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import LocationPicker from '../components/Map/LocationPicker';

const Details = () => {
  const [comment, setComment] = useState("");
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Coordonnées fictives (à remplacer par les data de ton API)
  const bienCoords = { lat: 3.8955, lng: 11.5110 };

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
    { id: 5, user: "Samuel", text: "Le forage fonctionne-t-il avec un suppresseur ?", date: "Lundi" }
  ];

  const nextImage = useCallback(() => {
    setActiveImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      if (e.key === 'Escape') setShowLightbox(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, nextImage, prevImage]);

  return (
    <div className="max-w-screen-2xl mx-auto p-4 md:p-10 font-sans text-gray-800 bg-white">
      
      {showLightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 select-none">
          <button onClick={() => setShowLightbox(false)} className="absolute top-6 right-6 text-white/70 hover:text-white z-10"><X size={40}/></button>
          <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full"><ChevronLeft size={32}/></button>
          <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full"><ChevronRight size={32}/></button>
          <img src={images[activeImg]} className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl object-contain animate-in fade-in zoom-in-95 duration-300" alt="" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-4">
            <div className="relative group overflow-hidden rounded-xl bg-gray-100 aspect-[16/9]">
              <img src={images[activeImg]} className="w-full h-full object-cover" alt="Principal" />
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={prevImage} className="p-3 bg-white/80 rounded-full shadow hover:bg-white"><ChevronLeft size={24}/></button>
                <button onClick={nextImage} className="p-3 bg-white/80 rounded-full shadow hover:bg-white"><ChevronRight size={24}/></button>
              </div>
              <button onClick={() => setShowLightbox(true)} className="absolute bottom-6 right-6 bg-black/50 text-white p-3 rounded hover:bg-black transition-colors"><Maximize2 size={22} /></button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <img 
                  key={i} src={img} 
                  onClick={() => setActiveImg(i)}
                  className={`w-32 h-20 object-cover rounded cursor-pointer border-2 transition-all ${activeImg === i ? 'border-[#007b83] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`} 
                  alt={`miniature ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="border-b border-gray-100 pb-8 space-y-3">
            <h1 className="text-4xl font-light text-gray-700 italic">Appartement meublé .</h1>
            <div className="flex items-center text-[#007b83] mt-2 italic">
              <MapPin size={18} className="mr-2" />
              <span className="text-sm">Bastos, Yaoundé I, Yaoundé, Mfoundi, Région du Centre, Cameroun</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 bg-gray-50/50 p-6 rounded-xl">
            <InfoLine icon={<DollarSign size={18}/>} label="Prix du Loyer" value="2,300,000 FCFA" />
            <InfoLine icon={<Key size={18}/>} label="Type de Publication" value="Location" />
            <InfoLine icon={<Calendar size={18}/>} label="Superficie" value="300 m²" />
            <InfoLine icon={<Users size={18}/>} label="Nombre de Pieces" value="5" />
          </div>

          <div className="pt-8 space-y-6">
            <h3 className="text-center text-gray-400 text-sm uppercase tracking-[0.3em] italic">Description du Bien </h3>
            <div className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto text-center italic space-y-2">
              <p className="font-bold uppercase tracking-tight text-lg text-gray-800">Appartement ultra haut standing golf a louer meublé</p>
              <p className="text-[#007b83] font-bold text-lg">*LIEU* : Yaounde - CENTRE-VILLE - GOLF</p>
              <div className="mt-4 space-y-2">
                <p>✅ 02 chambres avec placards climatisé</p>
                <p>✅ 03 douches avec eau chaude</p>
                <p>✅ tres vaste cuisine avec rangement balcon</p>
                <p>✅ Salon lumineux</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          
          <div className={`${isMapMaximized ? 'fixed inset-0 z-[150] p-10 bg-black/90' : 'relative'} transition-all duration-300`}>
            <div className={`bg-gray-100 border border-gray-200 rounded-xl overflow-hidden relative shadow-md ${isMapMaximized ? 'h-full w-full' : 'h-96'}`}>
      
      <button 
        onClick={() => setIsMapMaximized(!isMapMaximized)}
        className="absolute top-4 right-4 z-[1000] bg-white p-2.5 rounded shadow-lg"
      >
        {isMapMaximized ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
      </button>

      {/* IMPORTANT : On passe readOnly={true} ici */}
      <LocationPicker 
        mapPosition={bienCoords} 
        isExpanded={isMapMaximized}
        readOnly={true} 
      />
      
    </div>
          </div>

          <div className="border border-gray-100 rounded-2xl p-10 text-center space-y-6 shadow-sm bg-white">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center border border-gray-50">
              <User size={48} className="text-gray-300" />
            </div>
            <div>
              <h3 className="font-bold text-2xl italic uppercase tracking-tighter text-gray-900">OBAM Sylvia</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">Agent Immobilier</p>
            </div>
            <a 
              href="https://wa.me/237694907134" 
              target="_blank" 
              rel="noreferrer"
              className="w-full bg-[#007b83] text-white py-5 rounded-lg font-bold text-base flex items-center justify-center gap-3 hover:bg-[#00666d] transition-all shadow-lg uppercase"
            >
              <MessageSquare size={22} /> Contact WhatsApp
            </a>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-sm uppercase text-gray-400 tracking-[0.2em] italic border-b pb-4">Commentaires</h3>
            <div className="max-h-80 overflow-y-auto pr-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
              {commentsList.map(c => (
                <div key={c.id} className="text-xs border-b border-gray-50 pb-4 italic last:border-0">
                  <div className="flex justify-between font-bold text-gray-700 mb-2">
                    <span className="text-sm">{c.user}</span>
                    <span className="font-normal text-gray-300">{c.date}</span>
                  </div>
                  <p className="text-gray-500 leading-relaxed text-sm">"{c.text}"</p>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-4">
              <textarea 
                className="w-full border border-gray-100 p-4 text-sm rounded-xl outline-none focus:border-[#007b83] transition bg-gray-50 italic"
                placeholder="Posez votre question à Sylvia..."
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="w-full bg-gray-800 text-white py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md">
                <Send size={16} className="inline mr-2" /> Envoyer le message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoLine = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-3 px-4 hover:bg-white hover:shadow-sm transition group rounded-lg">
    <div className="flex items-center gap-5 text-gray-400">
      <span className="w-6 text-[#007b83]">{icon}</span>
      <span className="text-sm font-light italic">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-700 italic tracking-tight">{value}</span>
  </div>
);

export default Details;
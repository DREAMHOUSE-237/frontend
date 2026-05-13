import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin, DollarSign, Key, Calendar, Users,
  MessageSquare, Send, User,
  Maximize2, Minimize2,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import LocationPicker from '../components/Map/LocationPicker';
import { getPublicationById } from '../service/auth_service'; 
import { BienService } from '../service/auth_service'; 

const Details = () => {
  const { id } = useParams();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [coords, setCoords] = useState(null); // Initialisé à null pour forcer la donnée backend

  const commentsList = [
    { id: 1, user: "Kieran Junior", text: "L'appartement est-il disponible immédiatement ?", date: "Hier" },
    { id: 2, user: "Alice Mbarga", text: "La caution est-elle négociable ?", date: "Il y a 2 jours" },
    { id: 3, user: "Marc Etoundi", text: "Superbe vue sur le Golf, je recommande.", date: "Il y a 5 jours" }
  ];

  useEffect(() => {
    const fetchBien = async () => {
      try {
        setLoading(true);
        const data = await getPublicationById(id);
        
        // Récupération dynamique stricte depuis le backend (clés : lattitude, longitude)
        if (data.lattitude && data.longitude) {
          setCoords({
            lat: parseFloat(data.lattitude),
            lng: parseFloat(data.longitude)
          });
        }
        
        setBien(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du bien:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBien();
  }, [id]);

  const nextImage = useCallback(() => {
    if (!bien?.images || bien.images.length === 0) return;
    setActiveImg((prev) => (prev === bien.images.length - 1 ? 0 : prev + 1));
  }, [bien]);

  const prevImage = useCallback(() => {
    if (!bien?.images || bien.images.length === 0) return;
    setActiveImg((prev) => (prev === 0 ? bien.images.length - 1 : prev - 1));
  }, [bien]);

  if (loading) return <div className="h-screen flex items-center justify-center italic text-gray-400">Chargement des détails...</div>;
  if (!bien) return <div className="h-screen flex items-center justify-center">Bien introuvable.</div>;

  const images = bien.images && bien.images.length > 0 ? bien.images : [null];

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#f8f6f2' }}>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-10 font-sans text-gray-800">
        
        {showLightbox && (
          <div className="fixed inset-0 z-[100000] bg-black/95 flex items-center justify-center p-4">
            <button onClick={() => setShowLightbox(false)} className="absolute top-6 right-6 text-white/70 hover:text-white"><X size={40} /></button>
            <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full"><ChevronLeft size={32} /></button>
            <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full"><ChevronRight size={32} /></button>
            <img src={BienService.formatImageUrl(images[activeImg])} className="max-h-[90vh] max-w-[90vw] object-contain" alt="" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-10">
            
            {/* Galerie */}
            <div className="space-y-4">
              <div className="relative group overflow-hidden rounded-xl bg-gray-200 aspect-[16/9] shadow-sm">
                <img 
                  src={BienService.formatImageUrl(images[activeImg])} 
                  className="w-full h-full object-cover transition-all duration-700" 
                  alt={bien.titreBien} 
                />
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={prevImage} className="p-3 bg-white/80 rounded-full shadow"><ChevronLeft size={24} /></button>
                  <button onClick={nextImage} className="p-3 bg-white/80 rounded-full shadow"><ChevronRight size={24} /></button>
                </div>
                <button onClick={() => setShowLightbox(true)} className="absolute bottom-6 right-6 bg-black/50 text-white p-3 rounded"><Maximize2 size={22} /></button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <img
                    key={i} 
                    src={BienService.formatImageUrl(img)}
                    onClick={() => setActiveImg(i)}
                    className={`w-32 h-20 shrink-0 object-cover rounded-lg cursor-pointer border-2 transition-all ${activeImg === i ? 'border-[#007b83] scale-105 shadow-md' : 'border-transparent opacity-60'}`}
                    alt={`Vue ${i}`}
                  />
                ))}
              </div>
            </div>

           {/* Titre et Localisation */}
            <div className="border-b border-gray-200 pb-8 space-y-3">
              <h1 className="text-4xl font-light text-gray-700 italic">{bien.titreBien || "Sans titre"}</h1>
              <div className="flex items-center text-[#007b83] mt-2 italic">
                <MapPin size={18} className="mr-2" />
                <span className="text-sm">{bien.ville}, {bien.quartier} - Cameroun</span>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-1 gap-2 bg-white/60 p-6 rounded-xl border border-white/40 shadow-sm">
              <InfoLine icon={<DollarSign size={18} />} label="Prix" value={`${bien.prix?.toLocaleString()} FCFA`} />
              <InfoLine icon={<Key size={18} />} label="Type" value={bien.typePublication} />
              <InfoLine icon={<Calendar size={18} />} label="Catégorie" value={bien.categorie} />
              <InfoLine icon={<Users size={18} />} label="Pièces" value={bien.nbrePiece} />
            </div>

            {/* Description dynamique */}
            <div className="pt-8 space-y-6">
              <h3 className="text-center text-gray-400 text-sm uppercase tracking-[0.3em] italic font-bold">Description du Bien</h3>
              <div className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto text-center italic">
                <p className="whitespace-pre-line bg-white/40 p-6 rounded-2xl border border-white/20">
                  {bien.description || "Aucune description disponible."}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
            
            {/* Carte 100% Dynamique */}
            <div className={isMapMaximized ? 'fixed inset-0 z-[100000] bg-white' : 'relative h-80 z-10'}>
              <div className={`relative h-full w-full ${isMapMaximized ? '' : 'rounded-3xl shadow-xl overflow-hidden border-4 border-white'}`}>
                <button
                  onClick={() => setIsMapMaximized(!isMapMaximized)}
                  className="absolute top-4 right-4 z-[100001] bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  {isMapMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                {coords && (
                  <LocationPicker
                    mapPosition={coords}
                    readOnly={true}
                  />
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="border border-white bg-white/80 rounded-3xl p-8 text-center space-y-6 shadow-md">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center border border-white shadow-inner">
                <User size={40} className="text-[#007b83]" />
              </div>
              <div>
                <h3 className="font-bold text-xl italic uppercase tracking-tighter text-gray-900">Service Client</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Réponse rapide</p>
              </div>
              <a
                href={`https://wa.me/${bien.numeroPaiement?.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#007b83] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#00666d] transition-all shadow-lg uppercase text-sm"
              >
                <MessageSquare size={20} /> WhatsApp : {bien.numeroPaiement}
              </a>
            </div>

            {/* Section Commentaires */}
             <div className="space-y-6">
              <h3 className="font-bold text-xs uppercase text-gray-400 tracking-[0.2em] italic border-b border-gray-200 pb-4">Discussions récents</h3>
              <div className="max-h-80 overflow-y-auto pr-3 space-y-6 scrollbar-thin">
                {commentsList.map(c => (
                  <div key={c.id} className="text-xs border-b border-white pb-4 italic last:border-0">
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
                  className="w-full border border-white p-4 text-sm rounded-xl outline-none focus:border-[#007b83] transition bg-white/60 italic"
                  placeholder="Écrire un commentaire..."
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="w-full bg-gray-800 text-white py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-black transition-all">
                  <Send size={16} className="inline mr-2" /> Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoLine = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-3 px-4 hover:bg-white/40 rounded-lg transition-colors">
    <div className="flex items-center gap-4 text-gray-400">
      <span className="text-[#007b83]">{icon}</span>
      <span className="text-sm font-light italic">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-700 italic">{value}</span>
  </div>
);

export default Details;
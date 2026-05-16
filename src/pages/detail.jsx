import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, DollarSign, Key, Calendar, Users,
  MessageSquare, Send, User,
  Maximize2, Minimize2, Home, Loader2,
  ChevronLeft, ChevronRight, X, Heart, Trash2, Reply
} from 'lucide-react';
import LocationPicker from '../components/Map/LocationPicker';
import { getPublicationById, BienService, CommentService } from '../service/auth_service';

const Details = () => {
  const { id } = useParams();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [coords, setCoords] = useState(null); 
  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyText, setReplyText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBien = async () => {
      try {
        setLoading(true);
        const data = await getPublicationById(id);

        if (data.lattitude && data.longitude) {
          setCoords({
            lat: parseFloat(data.lattitude),
            lng: parseFloat(data.longitude)
          });
        }

        setBien(data);
        const fetchedComments = await CommentService.getByPublication(id);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Erreur lors de la récupération du bien:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBien();
  }, [id]);

  // Déclencheur global pour forcer le rafraîchissement de la carte Leaflet lors du plein écran
  useEffect(() => {
    if (isMapMaximized) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMapMaximized]);

  const handleSendComment = async () => {
    const userId = localStorage.getItem('userid');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      alert("Vous devez être connecté pour publier un commentaire.");
      navigate('/connexion');
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSending(true);
      const result = await CommentService.create(id, commentText);

      if (result.success) {
        setComments([result.data, ...comments]);
        setCommentText("");
      } else {
        alert(result.error?.message || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Erreur envoi commentaire:", error);
      alert("Une erreur réseau est survenue.");
    } finally {
      setSending(false);
    }
  };

  const handleLike = async (commentId) => {
    const res = await CommentService.toggleLike(commentId);
    if (res.success) {
      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, liked: res.data.liked, likeCount: res.data.likeCount } : c
      ));
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    const res = await CommentService.delete(commentId);
    if (res.success) {
      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, status: 'tombstoned', content: "[Ce commentaire a été supprimé]" } : c
      ));
    }
  };

  const handleSendReply = async (parentId) => {
    if (!replyText.trim()) return;
    const res = await CommentService.reply(id, replyText, parentId);
    if (res.success) {
      setComments(prev => prev.map(c =>
        c.id === parentId ? { ...c, replies: [...(c.replies || []), res.data], replyCount: (c.replyCount || 0) + 1 } : c
      ));
      setReplyText("");
      setReplyingTo(null);
    }
  };

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

        {/* Lightbox Galerie Plein Écran */}
        {showLightbox && (
          <div className="fixed inset-0 z-[100000] bg-black/95 flex items-center justify-center p-4">
            <button onClick={() => setShowLightbox(false)} className="absolute top-6 right-6 text-white/70 hover:text-white"><X size={40} /></button>
            <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full"><ChevronLeft size={32} /></button>
            <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full"><ChevronRight size={32} /></button>
            <img src={BienService.formatImageUrl(images[activeImg])} className="max-h-[90vh] max-w-[90vw] object-contain" alt="" />
          </div>
        )}

        {/* Mode Maximisé de la carte */}
        {isMapMaximized && coords && (
          <div className="fixed inset-0 z-[200000] bg-white w-screen h-screen">
            <button
              onClick={() => setIsMapMaximized(false)}
              className="absolute top-6 right-6 z-[200005] bg-gray-900 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
            >
              <Minimize2 size={24} />
            </button>
            <div className="w-full h-full">
              <LocationPicker mapPosition={coords} readOnly={true} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* ZONE GAUCHE */}
          <div className="lg:col-span-8 space-y-10">

            {/* GALERIE D'IMAGES — FIXE EN RELATIVE */}
            <div className="space-y-4">
              <div className="relative group overflow-hidden rounded-xl bg-gray-200 aspect-[16/9] shadow-sm">
                <img
                  src={BienService.formatImageUrl(images[activeImg])}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt={bien.titreBien}
                />
                
                {/* Flèches de navigation au survol */}
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  <button onClick={prevImage} className="p-3 bg-white/80 rounded-full shadow pointer-events-auto hover:bg-white"><ChevronLeft size={24} /></button>
                  <button onClick={nextImage} className="p-3 bg-white/80 rounded-full shadow pointer-events-auto hover:bg-white"><ChevronRight size={24} /></button>
                </div>
                
                {/* FIX DU BOUTON AGRANDIR IMAGE : Raccroché proprement au conteneur de l'image */}
                <button 
                  onClick={() => setShowLightbox(true)} 
                  className="absolute bottom-6 right-6 bg-black/60 text-white p-3 rounded-xl hover:bg-black transition-colors z-20 flex items-center justify-center shadow-lg"
                  title="Agrandir l'image"
                >
                  <Maximize2 size={20} />
                </button>
              </div>

              {/* Miniatures */}
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
              <InfoLine icon={<Home size={18} />} label="Type Bien Immobilier" value={bien.typeBienImmobilier} />
              <InfoLine icon={<Calendar size={18} />} label="Catégorie" value={bien.categorie} />
              <InfoLine icon={<Users size={18} />} label="Pièces" value={bien.nbrePiece} />
            </div>

            {/* Description du Bien */}
            <div className="space-y-6">
              <h3 className="text-center text-gray-400 text-sm uppercase tracking-[0.3em] italic font-bold">Description du Bien</h3>
              <div className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto text-center italic">
                <p className="whitespace-pre-line bg-white/40 p-6 rounded-2xl border border-white/20">
                  {bien.description || "Aucune description disponible."}
                </p>
              </div>
            </div>
          </div>

          {/* ZONE DROITE */}
          <div className="lg:col-span-4 space-y-12">

            {/* Carte Standard Miniature */}
            <div className="relative h-80 z-10">
              <div className="relative h-full w-full rounded-3xl shadow-xl overflow-hidden border-4 border-white">
                <button
                  onClick={() => setIsMapMaximized(true)}
                  className="absolute top-4 right-4 z-[50] bg-white text-gray-800 p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                >
                  <Maximize2 size={18} />
                </button>
                {coords && !isMapMaximized && (
                  <LocationPicker
                    mapPosition={coords}
                    readOnly={true}
                  />
                )}
              </div>
            </div>

            {/* Section Contact Responsable */}
            <div className="border border-white bg-white/80 rounded-3xl p-8 text-center space-y-6 shadow-md">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center border border-white shadow-inner">
                <User size={40} className="text-[#007b83]" />
              </div>
              <div>
                <h3 className="font-bold text-xl italic uppercase tracking-tighter text-gray-900">
                  Responsable du bien
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Réponse rapide
                </p>
              </div>
              <a
                href={`https://wa.me/+237${bien.numeroPaiement?.replace(/\s+/g, '')}?text=${encodeURIComponent(
                  `Bonjour, je suis intéressé par votre annonce "${bien.titreBien}" située à ${bien.quartier} (${bien.prix} FCFA). Est-elle toujours disponible ?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#007b83] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#00666d] transition-all shadow-lg uppercase text-sm"
              >
                <MessageSquare size={20} /> WhatsApp : {bien.numeroPaiement}
              </a>
            </div>

            {/* SECTION COMMENTAIRES */}
            <div className="space-y-6">
              <h3 className="font-bold text-xs uppercase text-gray-400 tracking-[0.2em] italic border-b border-gray-200 pb-4">
                Discussions ({comments.length})
              </h3>

              <div className="max-h-[500px] overflow-y-auto pr-3 space-y-6 scrollbar-thin">
                {comments.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-4">
                    Aucun commentaire pour le moment.
                  </p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="text-xs border-b border-white pb-6 italic last:border-0">
                      <div className="flex justify-between font-bold text-gray-700 mb-2">
                        <span className="text-sm text-[#007b83]">
                          {c.author.id === localStorage.getItem('userid')
                            ? localStorage.getItem('userEmail')
                            : `Utilisateur #${c.author.id.substring(0, 8)}`}
                        </span>
                        <span className="font-normal text-gray-300">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className={`text-gray-500 leading-relaxed text-sm bg-white/30 p-3 rounded-lg ${c.status === 'tombstoned' ? 'opacity-50 italic' : ''}`}>
                        {c.status === 'tombstoned' ? "[Ce commentaire a été supprimé]" : `"${c.content}"`}
                      </p>

                      <div className="flex gap-6 mt-3 px-1 items-center text-[10px] font-black uppercase tracking-tighter">
                        <button
                          onClick={() => handleLike(c.id)}
                          className={`flex items-center gap-1 transition-colors ${c.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          <Heart size={12} fill={c.liked ? "currentColor" : "none"} /> {c.likeCount} LIKES
                        </button>

                        {(!c.parentId || c.parentId === null) && c.status !== 'tombstoned' && (
                          <button
                            onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                            className="flex items-center gap-1 text-gray-400 hover:text-[#007b83]"
                          >
                            <Reply size={12} /> Répondre
                          </button>
                        )}

                        {c.author.id === localStorage.getItem('userid') && c.status !== 'tombstoned' && (
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="flex items-center gap-1 text-gray-300 hover:text-red-600 ml-auto"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      {replyingTo === c.id && (
                        <div className="ml-6 mt-4 flex gap-2 animate-in slide-in-from-top-2">
                          <input
                            className="flex-1 border-b border-[#007b83] p-2 text-xs outline-none bg-transparent italic"
                            placeholder="Répondre..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <button
                            onClick={() => handleSendReply(c.id)}
                            disabled={!replyText.trim()}
                            className="text-[#007b83] font-bold"
                          >
                            <Send size={14} />
                          </button>
                        </div>
                      )}

                      {c.replies && c.replies.length > 0 && (
                        <div className="ml-6 mt-4 space-y-4 border-l-2 border-[#007b83]/10 pl-4">
                          {c.replies.map(reply => (
                            <div key={reply.id} className="opacity-80">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[#007b83] font-bold">
                                  {reply.author.id === localStorage.getItem('userid') ? "Moi" : "Réponse"}
                                </span>
                                <span className="text-[10px] text-gray-300">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-500 italic">"{reply.content}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Écrire un commentaire */}
              <div className="pt-4 space-y-4">
                <textarea
                  className="w-full border border-white p-4 text-sm rounded-xl outline-none focus:border-[#007b83] transition bg-white/60 italic shadow-inner"
                  placeholder="Écrire un commentaire..."
                  rows="3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={sending}
                />
                <button
                  onClick={handleSendComment}
                  disabled={sending || !commentText.trim()}
                  className="w-full bg-gray-800 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? "Envoi..." : "Envoyer"}
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
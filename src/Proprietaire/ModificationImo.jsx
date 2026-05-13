import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Layout, Sparkles, X, Plus, Save, Loader2,
  Maximize2, Minimize2, Type, DollarSign, AlignLeft, Clock, Home, Navigation
} from 'lucide-react';
import LocationPicker from '../components/Map/LocationPicker';
import SearchLocation from '../components/Map/SearchLocation';
import { updateAnnonce, getPublicationById } from '../service/auth_service';

const ModifierPublication = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();
  const API_URL = "/api";

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const [position, setPosition] = useState({ lat: 3.848, lng: 11.502 });
  const [mapPosition, setMapPosition] = useState([3.848, 11.502]);

  const [formData, setFormData] = useState({
    titre: "",
    prix: "",
    superficie: "",
    pieces: "",
    description: "",
    typebienimmobilier: "",
    typePublication: "LOCATION",
    categorie: "NON_MEUBLE",
    region: "",
    ville: "",
    quartier: "",
    longitude: "",
    lattitude: "",
    images: [],
    documents: []
  });

  // Chargement des données au montage
  useEffect(() => {
    const loadPublication = async () => {
      try {
        setLoading(true);
        const data = await getPublicationById(id);

        setFormData({
          titre: data.titreBien || "",
          prix: data.prix || "",
          superficie: data.superficie || data.superfie || "",
          pieces: data.nbrePiece || "",
          description: data.description || "",
          typebienimmobilier: data.typebienimmobilier || "", // Attention à la casse selon votre backend
          typePublication: data.typePublication || "LOCATION",
          categorie: data.categorie || "NON_MEUBLE",
          region: data.region || "",
          ville: data.ville || "",
          quartier: data.quartier || "",
          images: data.images || [],
          documents: data.docuements || [] // Récupération des documents
        });

       if (data.lattitude && data.Longitude) {
        const lat = parseFloat(data.lattitude); // 3.805...
        const lng = parseFloat(data.Longitude); // 11.472...

        const coords = { lat, lng };
        
        // On met à jour la position du marqueur ET le centre de la carte
        setPosition(coords);
        setMapPosition([lat, lng]);
        
        console.log("Coordonnées chargées :", coords);
      }
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadPublication();
  }, [id, navigate]);

  // Gestion du plein écran carte
  useEffect(() => {
    if (isMapExpanded) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isMapExpanded]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFormData({ ...formData, images: [...formData.images, ...newImgs] });
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, documents: [...formData.documents, ...files] });
  };

  const removeMedia = (index, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      await updateAnnonce(id, formData, position);
      alert("Annonce mise à jour avec succès !");
      navigate(-1); // Retour à la liste
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#007b83]" size={40} />
        <p className="text-gray-500 font-medium">Chargement de l'annonce...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1a2b3c]">

      {/* HEADER */}
      <div className={`p-6 max-w-5xl mx-auto w-full flex items-center justify-between transition-all ${isMapExpanded ? 'hidden' : 'flex'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black tracking-tight">Modifier l'annonce</h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saveLoading}
          className="flex items-center gap-2 px-6 py-3 bg-[#007b83] text-white rounded-2xl font-bold shadow-lg hover:shadow-teal-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saveLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      <div className={`flex-1 w-full transition-all duration-500 ${isMapExpanded ? 'p-0 m-0 max-w-none' : 'max-w-5xl mx-auto px-6 pb-20 space-y-12'}`}>

        {!isMapExpanded && (
          <>
            {/* DESCRIPTION */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Layout className="text-[#007b83]" size={20} />
                <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500">Description principale</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Type size={16} /> Titre</label>
                  <input type="text" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Clock size={16} /> Superficie (m²)</label>
                  <input type="number" value={formData.superficie} onChange={(e) => setFormData({ ...formData, superficie: e.target.value })} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Home size={16} /> Pièces</label>
                  <input type="number" value={formData.pieces} onChange={(e) => setFormData({ ...formData, pieces: e.target.value })} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><DollarSign size={16} /> Prix (FCFA)</label>
                  <input type="number" value={formData.prix} onChange={(e) => setFormData({ ...formData, prix: e.target.value })} className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83]" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><AlignLeft size={16} /> Description</label>
                  <textarea rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83] resize-none"></textarea>
                </div>
              </div>
            </section>

            {/* MÉDIAS */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Sparkles className="text-[#ff8800]" size={20} />
                <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500">Médias et Détails</h2>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold">Photos du bien</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group">
                      <img
                        src={img.preview ? img.preview : `${API_URL}/PUBLICATION-SERVICE/uploads/${img}`}
                        className="w-full h-full object-cover"
                        alt="bien"
                      />
                      <button onClick={() => removeMedia(i, 'images')} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 hover:border-[#007b83] transition-colors group">
                    <Plus className="text-gray-400 group-hover:text-[#007b83]" size={24} />
                    <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold">Documents (Images)</label>
                <div className="flex flex-wrap gap-3">
                  {formData.documents.map((img, i) => (
                    <div key={i} className="aspect-square w-24 rounded-lg overflow-hidden border border-gray-100 relative group">
                      <img
                        src={img.preview ? img.preview : `${API_URL}/PUBLICATION-SERVICE/uploads/${img}`}
                        className="w-full h-full object-cover"
                        alt="document"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(i, 'documents')} // Correction ici: 'documents'
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 text-gray-500 font-bold text-xs">
                    <Plus size={16} /> Ajouter
                    <input type="file" multiple className="hidden" onChange={handleDocumentUpload} accept="image/*" />
                  </label>
                </div>
              </div>

              {/* SELECTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Type Publication</label>
                  <select value={formData.typePublication} onChange={(e) => setFormData({ ...formData, typePublication: e.target.value })} className="w-full p-4 mt-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83]">
                    <option value="VENTE">VENTE</option>
                    <option value="LOCATION">LOCATION</option>
                    <option value="BAIL">BAIL</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Catégorie</label>
                  <select value={formData.categorie} onChange={(e) => setFormData({ ...formData, categorie: e.target.value })} className="w-full p-4 mt-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83]">
                    <option value="MEUBLE">MEUBLE</option>
                    <option value="NON_MEUBLE">NON_MEUBLE</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Type de bien</label>
                  <select value={formData.typebienimmobilier} onChange={(e) => setFormData({ ...formData, typebienimmobilier: e.target.value })} className="w-full p-4 mt-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83]">
                    {["APPARTEMENT", "MAISON", "TERRAIN", "IMMEUBLE", "VILLA", "STUDIO", "BOUTIQUE", "BUREAU", "CHAMBRE"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          </>
        )}

        {/* LOCALISATION */}
        <section className={`transition-all duration-500 ${isMapExpanded ? 'fixed inset-0 z-[9999] bg-white' : 'w-full mt-12'}`}>
          {!isMapExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                value={formData.region} // Changé ici
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="Région"
                className="p-4 border border-gray-200 rounded-xl outline-none"
              />
              <input
                type="text"
                value={formData.ville} // Changé ici
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                placeholder="Ville"
                className="p-4 border border-gray-200 rounded-xl outline-none"
              />
              <input
                type="text"
                value={formData.quartier} // Changé ici
                onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                placeholder="Quartier"
                className="p-4 border border-gray-200 rounded-xl outline-none"
              />
            </div>
          )}

          <div className={`relative ${isMapExpanded ? 'w-screen h-screen' : 'w-full h-[500px] rounded-3xl overflow-hidden shadow-inner'}`}>
            <div className="absolute left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4 top-6">
              <SearchLocation setMapPosition={setMapPosition} />
            </div>
            <LocationPicker
              position={position}
              setPosition={setPosition}
              mapPosition={mapPosition}
              isExpanded={isMapExpanded}
            />
            {isMapExpanded && (
              <button onClick={() => setIsMapExpanded(false)} className="absolute bottom-10 right-10 z-[1001] bg-[#1a2b3c] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2">
                <Minimize2 size={20} /> QUITTER
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModifierPublication;
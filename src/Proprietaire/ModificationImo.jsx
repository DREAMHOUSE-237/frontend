import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Layout, Sparkles, X, Plus, Save, Loader2,
  Maximize2, Minimize2, Type, DollarSign, AlignLeft, Clock, Home, Navigation
} from 'lucide-react';
import LocationPicker from '../components/Map/LocationPicker';
import SearchLocation from '../components/Map/SearchLocation';
import { updateAnnonce, getPublicationById } from '../service/auth_service';

const ModifierPublication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const [position, setPosition] = useState(null);
  const [mapPosition, setMapPosition] = useState([3.848, 11.502]);

  const [formData, setFormData] = useState({
    titreBien: "",
    prix: "",
    superficie: "",
    pieces: "",
    description: "",
    typeBienImmobilier: "",
    typePublication: "LOCATION",
    categorie: "NON_MEUBLE",
    region: "",
    ville: "",
    quartier: "",
    images: [],
    documents: []
  });

  // Chargement des données au montage
  useEffect(() => {
    const loadPublication = async () => {
      try {
        setLoading(true);
        const data = await getPublicationById(id);

        // Transformation des images existantes du backend (strings) en objets compatibles UI
        const existingImages = (data.images || []).map(img => ({
          raw: img, // Chaîne de caractères représentant l'URL existante
          preview: img, // Déjà une URL Cloudinary complète
          isExisting: true // ✅ Marqueur de sécurité pour différencier de l'upload local
        }));

        // Transformation des documents existants (strings) en objets compatibles UI
        const existingDocs = (data.docuements || []).map(doc => ({
          raw: doc,
          preview: doc,
          isExisting: true // ✅ Marqueur de sécurité
        }));

        setFormData({
          titreBien: data.titreBien || "",
          prix: data.prix || "",
          superficie: data.superficie || data.superfie || "",
          pieces: data.nbrePiece || "",
          description: data.description || "",
          typeBienImmobilier: data.typeBienImmobilier || "",
          typePublication: data.typePublication || "LOCATION",
          categorie: data.categorie || "NON_MEUBLE",
          region: data.region || "",
          ville: data.ville || "",
          quartier: data.quartier || "",
          images: existingImages,
          documents: existingDocs
        });

        if (data.lattitude && data.longitude) {
          const lat = parseFloat(data.lattitude);
          const lng = parseFloat(data.longitude);
          setPosition({ lat, lng });
          setMapPosition([lat, lng]);
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement de la publication.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadPublication();
  }, [id, navigate]);

  // Événement de redimensionnement pour recalculer la géométrie de Leaflet
  useEffect(() => {
    if (isMapExpanded) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMapExpanded]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => ({
      raw: file, // Objet binaire natif File
      preview: URL.createObjectURL(file),
      isExisting: false // C'est un nouveau fichier
    }));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImgs] }));
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({
      raw: file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
  };

  const removeMedia = (index, type) => {
    const item = formData[type][index];
    if (item.preview && item.preview.startsWith('blob:')) {
      URL.revokeObjectURL(item.preview);
    }
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      if (!position) {
        alert("Veuillez positionner le marqueur sur la carte.");
        return;
      }
      setSaveLoading(true);

      // ✅ FIX SÉCURITÉ CLOUDINARY : On sépare les chaînes textuelles des nouveaux fichiers binaires
      const baseImagesUrls = formData.images.filter(img => img.isExisting).map(img => img.raw);
      const newImagesFiles = formData.images.filter(img => !img.isExisting).map(img => img.raw);

      const baseDocsUrls = formData.documents.filter(doc => doc.isExisting).map(doc => doc.raw);
      const newDocsFiles = formData.documents.filter(doc => !doc.isExisting).map(doc => doc.raw);

      const cleanPayload = {
        ...formData,
        // On passe uniquement les fichiers binaires bruts au gestionnaire d'envoi MultipartFormData
        images: newImagesFiles, 
        documents: newDocsFiles,
        // ✅ On transmet aussi les URLs existantes pour que le backend ne les supprime pas du catalogue SQL
        existingImages: baseImagesUrls,
        existingDocuments: baseDocsUrls
      };

      await updateAnnonce(id, cleanPayload, position);
      alert("Annonce mise à jour avec succès !");
      navigate(-1);
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

      {/* HEADER BAR */}
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
          className="flex items-center gap-2 px-6 py-3 bg-[#007b83] text-white rounded-2xl font-bold shadow-lg hover:bg-[#00666d] transition-all active:scale-95 disabled:opacity-50"
        >
          {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saveLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {/* FULLSCREEN MAP OVERLAY */}
      {isMapExpanded && position && (
        <div className="fixed inset-0 z-[200000] bg-white w-screen h-screen">
          <button
            onClick={() => setIsMapExpanded(false)}
            className="absolute top-6 right-6 z-[200005] bg-gray-900 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          >
            <Minimize2 size={24} />
          </button>
          <LocationPicker position={position} setPosition={setPosition} mapPosition={mapPosition} isExpanded={isMapExpanded} readOnly={false} />
        </div>
      )}

      <div className={`flex-1 w-full max-w-5xl mx-auto px-6 pb-20 space-y-12 ${isMapExpanded ? 'hidden' : 'block'}`}>

        {/* SECTION TEXTUELLE */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Layout className="text-[#007b83]" size={20} />
            <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500">Description principale</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Type size={16} /> Titre</label>
              <input type="text" value={formData.titreBien} onChange={(e) => setFormData({ ...formData, titreBien: e.target.value })} className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Clock size={16} /> Superficie (m²)</label>
              <input type="number" value={formData.superficie} onChange={(e) => setFormData({ ...formData, superficie: e.target.value })} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Home size={16} /> Pièces</label>
              <input type="number" value={formData.pieces} onChange={(e) => setFormData({ ...formData, pieces: e.target.value })} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><DollarSign size={16} /> Prix (FCFA)</label>
              <input type="number" value={formData.prix} onChange={(e) => setFormData({ ...formData, prix: e.target.value })} className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83]" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><AlignLeft size={16} /> Description</label>
              <textarea rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83] resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* GALERIES MÉDIAS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Sparkles className="text-[#ff8800]" size={20} />
            <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500">Médias et Détails</h2>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase">Photos du bien</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {formData.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group">
                  <img src={img.preview} className="w-full h-full object-cover" alt="bien" />
                  <button type="button" onClick={() => removeMedia(i, 'images')} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
            <label className="text-xs font-bold text-gray-400 uppercase">Documents de propriété (Images uniquement)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {formData.documents.map((doc, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group">
                  <img src={doc.preview} className="w-full h-full object-cover" alt="document" />
                  <button type="button" onClick={() => removeMedia(i, 'documents')} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 hover:border-[#007b83] transition-colors group">
                <Plus className="text-gray-400 group-hover:text-[#007b83]" size={24} />
                <input type="file" multiple className="hidden" onChange={handleDocumentUpload} accept="image/*" />
              </label>
            </div>
          </div>

          {/* DÉROULANTS DE CONFIGURATION */}
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
              <label className="text-xs font-bold text-gray-400 uppercase">Type Bien Immobilier</label>
              <select value={formData.typeBienImmobilier} onChange={(e) => setFormData({ ...formData, typeBienImmobilier: e.target.value })} className="w-full p-4 mt-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83] cursor-pointer" required>
                <option value="" disabled>-- Choisir une option --</option>
                <option value="APPARTEMENT">APPARTEMENT</option>
                <option value="MAISON">MAISON</option>
                <option value="TERRAIN">TERRAIN</option>
                <option value="IMMEUBLE">IMMEUBLE</option>
                <option value="VILLA">VILLA</option>
                <option value="STUDIO">STUDIO</option>
                <option value="BOUTIQUE">BOUTIQUE</option>
                <option value="BUREAU">BUREAU</option>
                <option value="CHAMBRE">CHAMBRE</option>
              </select>
            </div>
          </div>
        </section>

        {/* STRUCTURE LOCALISATION & MINI-MAP */}
        <section className="w-full mt-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <MapPin className="text-[#007b83]" size={20} />
            <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500">Adresse & Géolocalisation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Région</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83] cursor-pointer text-sm h-[54px]"
                required
              >
                <option value="" disabled>-- Choisir une Région --</option>
                <option value="Adamaoua_ExtremeNord">ADAMAOUA</option>
                <option value="YAOUNDE_Centre">CENTRE</option>
                <option value="Bertoua_Est">EST</option>
                <option value="Maroua_Ngaoundere">EXTRÊME-NORD</option>
                <option value="Douala_Littoral">LITTORAL</option>
                <option value="Garoua_Nord">NORD</option>
                <option value="Bamenda_NordOuest">NORD-OUEST</option>
                <option value="Bafoussam_Ouest">OUEST</option>
                <option value="Ebolowa_Sud">SUD</option>
                <option value="Buea_SudOuest">SUD-OUEST</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Ville</label>
              <input
                type="text"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                placeholder="Ville"
                className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83] h-[54px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Quartier</label>
              <input
                type="text"
                value={formData.quartier}
                onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                placeholder="Quartier"
                className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83] h-[54px]"
              />
            </div>
          </div>

          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-inner">
            <div className="absolute left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4 top-6">
              <SearchLocation setMapPosition={setMapPosition} />
            </div>
            <LocationPicker
              position={position}
              setPosition={setPosition}
              mapPosition={mapPosition}
              isExpanded={isMapExpanded}
              readOnly={false}
            />
            <button type="button" onClick={() => setIsMapExpanded(true)} className="absolute bottom-6 right-6 z-[1000] bg-white p-3 rounded-xl shadow-md hover:bg-gray-50 flex items-center justify-center">
              <Maximize2 size={18} className="text-[#1a2b3c]" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ModifierPublication;
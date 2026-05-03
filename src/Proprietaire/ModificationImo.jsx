import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, MapPin, Layout, Sparkles, X, Plus, Save,
  Maximize2, Minimize2, Type, DollarSign, AlignLeft, Clock, Home, Navigation
} from 'lucide-react';
import LocationPicker from '../components/Map/LocationPicker';
import SearchLocation from '../components/Map/SearchLocation';

const ModifierPublication = ({ publicationInitiale, onBack }) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // État pour la carte
  const [position, setPosition] = useState(publicationInitiale?.coords || { lat: 3.848, lng: 11.502 });
  const [mapPosition, setMapPosition] = useState(publicationInitiale?.coords || [3.848, 11.502]);

  // État unique pour tout le formulaire
  const [formData, setFormData] = useState({
    titre: publicationInitiale?.titre || "",
    prix: publicationInitiale?.prix || "",
    superficie: publicationInitiale?.superficie || "",
    pieces: publicationInitiale?.pieces || "",
    description: publicationInitiale?.description || "",
    typePublication: publicationInitiale?.typePublication || "louer",
    categorie: publicationInitiale?.categorie || "studio",
    region: publicationInitiale?.region || "",
    ville: publicationInitiale?.ville || "",
    quartier: publicationInitiale?.quartier || "",
    images: publicationInitiale?.images || []
  });

  // Gestion du plein écran et du scroll body
  useEffect(() => {
    if (isMapExpanded) {
      // Bloque le scroll de la page derrière
      document.body.style.overflow = 'hidden';
      // Force le rafraîchissement de la carte après l'animation
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'auto';
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMapExpanded]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFormData({ ...formData, images: [...formData.images, ...newImgs] });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    const finalData = { ...formData, coords: position };
    console.log("Enregistrement :", finalData);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1a2b3c]">

      {/* HEADER - Caché en plein écran pour gagner de la place */}
      <div className={`p-6 max-w-5xl mx-auto w-full flex items-center justify-between transition-all ${isMapExpanded ? 'hidden' : 'flex'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black tracking-tight">Modifier l'annonce</h1>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#007b83] text-white rounded-2xl font-bold shadow-lg hover:shadow-teal-100 transition-all active:scale-95"
        >
          <Save size={18} /> Enregistrer
        </button>
      </div>

      {/* CONTENEUR PRINCIPAL - Ajustement des marges en plein écran */}
      <div className={`flex-1 w-full transition-all duration-500 ${
        isMapExpanded 
          ? 'p-0 m-0 max-w-none' 
          : 'max-w-5xl mx-auto px-6 pb-20 space-y-12'
      }`}>

        {!isMapExpanded && (
          <>
            {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Layout className="text-[#007b83]" size={20} />
                <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500">Description principale</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Type size={16} /> Titre</label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Clock size={16} /> Superficie (m²)</label>
                  <input
                    type="number"
                    value={formData.superficie}
                    onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                    placeholder="100"
                    className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Home size={16} /> Nombre de Pièces</label>
                  <input
                    type="number"
                    value={formData.pieces}
                    onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
                    placeholder="5"
                    className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><DollarSign size={16} /> Prix (FCFA)</label>
                  <input
                    type="number"
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                    className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><AlignLeft size={16} /> Description détaillée</label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83] resize-none"
                  ></textarea>
                </div>
              </div>
            </section>

            {/* SECTION 2 : PHOTOS ET CATÉGORIE */}
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
                      <img src={img.preview || img} className="w-full h-full object-cover" alt="" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 hover:border-[#007b83] transition-colors group">
                    <Plus className="text-gray-400 group-hover:text-[#007b83]" size={24} />
                    <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Type de Publication</label>
                  <select
                    value={formData.typePublication}
                    onChange={(e) => setFormData({ ...formData, typePublication: e.target.value })}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83]"
                  >
                    <option value="louer">À Louer</option>
                    <option value="vendre">À Vendre</option>
                    <option value="nuitée">Par Nuitée</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83]"
                  >
                    <option value="chambre">Chambre</option>
                    <option value="studio">Studio</option>
                    <option value="appartement">Appartement</option>
                    <option value="maison">Maison</option>
                  </select>
                </div>
              </div>
            </section>
          </>
        )}

        {/* SECTION 3 : LOCALISATION - PLEIN ÉCRAN CORRIGÉ */}
        <section className={`transition-all duration-500 ${
          isMapExpanded
            ? 'fixed inset-0 z-[99999] bg-white' // z-index très haut et inset-0 pour couvrir la navbar
            : 'w-full mt-12'
        }`}>

          {!isMapExpanded && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                    <Navigation size={16} /> Région
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Ex: Centre, Littoral..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                    <Navigation size={16} /> Ville
                  </label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    placeholder="Ex: Yaoundé, Douala..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                    <MapPin size={16} /> Quartier
                  </label>
                  <input
                    type="text"
                    value={formData.quartier}
                    onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                    placeholder="Ex: Bastos, Bonapriso..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-500 rounded-lg"><MapPin size={20} /></div>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Emplacement précis</h2>
                </div>
                <button
                  onClick={() => setIsMapExpanded(true)}
                  className="flex items-center gap-2 text-[10px] font-black text-[#007b83] bg-teal-50 px-4 py-2 rounded-xl active:scale-95 transition-transform shadow-sm"
                >
                  <Maximize2 size={14} /> PLEIN ÉCRAN
                </button>
              </div>
            </>
          )}

          <div className={`relative transition-all duration-500 ease-in-out ${
            isMapExpanded
              ? 'w-screen h-screen'
              : 'w-full h-[600px] border-y border-gray-100 shadow-inner'
          }`}>

            {/* Barre de recherche */}
            <div className={`absolute left-1/2 -translate-x-1/2 z-[100001] w-full max-w-md px-4 transition-all ${isMapExpanded ? 'top-8' : 'top-6'}`}>
              <SearchLocation setMapPosition={setMapPosition} />
            </div>

            {/* La carte elle-même */}
            <div className="w-full h-full">
              <LocationPicker
                position={position}
                setPosition={setPosition}
                mapPosition={mapPosition}
              />
            </div>

            {/* Contrôles flottants */}
            <div className="absolute bottom-10 right-10 z-[100001] flex flex-col items-end gap-3">
              {isMapExpanded && (
                <button
                  onClick={() => setIsMapExpanded(false)}
                  className="bg-[#1a2b3c] text-white px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-black text-sm"
                >
                  <Minimize2 size={20} /> QUITTER LE PLEIN ÉCRAN
                </button>
              )}

              <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Coordonnées</p>
                <code className="text-xs font-bold text-[#007b83]">
                  {position.lat.toFixed(5)} , {position.lng.toFixed(5)}
                </code>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModifierPublication;
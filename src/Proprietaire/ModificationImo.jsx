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
    region: publicationInitiale?.region || "", // Ajouté
    ville: publicationInitiale?.ville || "",
    quartier: publicationInitiale?.quartier || "",
    images: publicationInitiale?.images || []
  });

  // Correction pour forcer la carte à se redessiner lors du passage en plein écran
  useEffect(() => {
    if (isMapExpanded) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
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
    // Logique d'envoi API ici
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1a2b3c]">

      {/* HEADER */}
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

      <div className={`flex-1 max-w-5xl mx-auto w-full px-6 pb-20 space-y-12 ${isMapExpanded ? 'p-0 m-0 max-w-none' : ''}`}>

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
                    onChange={(e) => setFormData({...formData, superficie: e.target.value})}
                    placeholder="100" 
                    className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2"><Home size={16} /> Nombre de Pièces</label>
                  <input 
                    type="number" 
                    value={formData.pieces}
                    onChange={(e) => setFormData({...formData, pieces: e.target.value})}
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

        {/* SECTION 3 : LOCALISATION */}
        <section className={isMapExpanded ? 'fixed inset-0 z-[9999] bg-white' : 'space-y-6'}>
          
          {!isMapExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                  <Navigation size={16} /> Région
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, ville: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, quartier: e.target.value})}
                  placeholder="Ex: Bastos, Bonapriso..."
                  className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {!isMapExpanded && (
            <div className="flex items-center justify-between">
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
          )}

          <div className={`relative transition-all duration-300 ${isMapExpanded
            ? 'w-full h-full' 
            : 'w-full aspect-video rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden'
            }`}>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
              <SearchLocation setMapPosition={setMapPosition} />
            </div>

            <div className="w-full h-full">
              <LocationPicker
                position={position}
                setPosition={setPosition}
                mapPosition={mapPosition}
              />
            </div>

            <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-3">
              {isMapExpanded && (
                <button
                  onClick={() => setIsMapExpanded(false)}
                  className="bg-[#1a2b3c] text-white px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold"
                >
                  <Minimize2 size={20} /> QUITTER LE PLEIN ÉCRAN
                </button>
              )}
              <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white">
                <p className="text-[11px] font-bold text-[#007b83]">
                  {position.lat.toFixed(5)} , {position.lng.toFixed(5)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModifierPublication;
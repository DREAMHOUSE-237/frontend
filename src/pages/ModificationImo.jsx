import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, MapPin, Layout, Sparkles, Type,
  AlignLeft, DollarSign, Clock, Home, X,
  Camera, Plus, Navigation, Check, Save
} from 'lucide-react';

const ModifierPublication = ({ publicationInitiale, onBack }) => {
  // On initialise l'état avec les données de la publication à modifier
  // Si aucune donnée n'est passée, on met des valeurs par défaut
  const [formData, setFormData] = useState({
    titre: publicationInitiale?.titre || "Studio moderne meublé",
    prix: publicationInitiale?.prix || "150000",
    superficie: publicationInitiale?.superficie || "45",
    pieces: publicationInitiale?.pieces || "2",
    description: publicationInitiale?.description || "Très beau studio situé en bordure de route...",
    typePublication: publicationInitiale?.typePublication || "louer",
    categorie: publicationInitiale?.categorie || "studio",
    ville: publicationInitiale?.ville || "Yaoundé",
    quartier: publicationInitiale?.quartier || "Bastos",
    images: publicationInitiale?.images || []
  });

  const [step, setStep] = useState(1);

  // Gestion des images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFormData({ ...formData, images: [...formData.images, ...newImgs] });
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleUpdate = () => {
    console.log("Données mises à jour :", formData);
    alert("Modification enregistrée avec succès !");
    if (onBack) onBack();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full font-sans text-gray-900">

      {/* HEADER FIXE */}
      <div className="bg-white border-b sticky top-0 z-20 w-full py-4 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/mes-publications">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <ChevronLeft size={24} />
              </button>
            </a>

            <h1 className="text-xl font-bold text-gray-800">Modifier l'annonce</h1>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-[#007b83] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#00666d] transition-all shadow-md active:scale-95"
          >
            <Save size={18} /> ENREGISTRER
          </button>
        </div>
      </div>

      <div className="flex-1 w-full p-6 max-w-5xl mx-auto space-y-10">

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

        {/* SECTION 3 : POSITION (AVEC PLACEHOLDER CARTE) */}
        <section className="space-y-6 pb-20">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <MapPin className="text-red-500" size={20} />
            <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500">Localisation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Navigation size={16} /> Ville</label>
              <input
                type="text"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><MapPin size={16} /> Quartier</label>
              <input
                type="text"
                value={formData.quartier}
                onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-[#007b83]"
              />
            </div>
          </div>

          {/* Placeholder de la Carte */}
          <div className="w-full aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 space-y-2">
            <MapPin size={40} className="opacity-20" />
            <p className="text-sm font-medium italic">L'interface de la carte sera implémentée ici</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModifierPublication;
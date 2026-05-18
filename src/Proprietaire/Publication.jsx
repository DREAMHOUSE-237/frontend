import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, MapPin, Layout,
  Sparkles, Type, AlignLeft, DollarSign, Clock, Check,
  Plus, Home, X, Smartphone, Navigation, Loader2, Maximize2, Minimize2, CreditCard
} from 'lucide-react';
import LocationPicker from '../components/Map/LocationPicker';
import SearchLocation from '../components/Map/SearchLocation';
import { createAnnoce } from '../service/auth_service';

const PublicationAnnonce = () => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [position, setPosition] = useState(null);
  const [mapPosition, setMapPosition] = useState([3.848, 11.502]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ÉTATS POUR LA PASSERELLE DE PAIEMENT
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentNumber, setPaymentNumber] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes en secondes

  const steps = [
    { id: 1, label: 'Description', icon: <Layout size={20} /> },
    { id: 2, label: 'Complément', icon: <Sparkles size={20} /> },
    { id: 3, label: 'Position', icon: <MapPin size={20} /> },
  ];

  const [formData, setFormData] = useState({
    titreBien: '',
    prix: '',
    superficie: '',
    nbrePiece: '',
    description: '',
    typePublication: '',
    typeBienImmobilier: '',
    categorie: '',
    region: '',
    ville: '',
    quartier: ''
  });

  // Vérifie si au moins un champ obligatoire ou structurel est vide
  const isFormInvalid = () => {
    return (
      !formData.titreBien.trim() ||
      !formData.prix ||
      !formData.superficie ||
      !formData.nbrePiece ||
      !formData.description.trim() ||
      !formData.typePublication ||
      !formData.typeBienImmobilier ||
      !formData.categorie ||
      !formData.region ||
      !formData.ville.trim() ||
      !formData.quartier.trim() ||
      images.length === 0 || 
      documents.length === 0 ||
      !position 
    );
  };

  // LOGIQUE DU COMPTE À REBOURS DE 5 MINUTES
  useEffect(() => {
    if (!showPaymentModal) return;
    if (timeLeft === 0) {
      alert("Le délai de paiement de 5 minutes est expiré. Veuillez réessayer.");
      setShowPaymentModal(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showPaymentModal, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SIMULATION DES DESIGN PATTERNS STRATEGIE DU BACKEND
  const calculerFraisPublication = () => {
    const prixBase = parseFloat(formData.prix) || 0;
    
    if (formData.typePublication === 'VENTE') {
      return prixBase * 0.05;
    } else if (formData.typePublication === 'LOCATION' || formData.typePublication === 'BAIL') {
      return 10000;
    }
    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      raw: file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({
      raw: file,
      preview: URL.createObjectURL(file)
    }));
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeDoc = (index) => {
    URL.revokeObjectURL(documents[index].preview);
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
      documents.forEach(doc => URL.revokeObjectURL(doc.preview));
    };
  }, [images, documents]);

  useEffect(() => {
    document.body.style.overflow = isMapExpanded || showPaymentModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMapExpanded, showPaymentModal]);

  const handleProcessToPayment = () => {
    if (isFormInvalid()) {
      alert("Veuillez remplir correctement l'intégralité du formulaire et placer le marqueur avant de continuer.");
      return;
    }
    setTimeLeft(300);
    setShowPaymentModal(true);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!paymentNumber || paymentNumber.length !== 9) {
      alert("Veuillez entrer un numéro de paiement valide à 9 chiffres.");
      return;
    }

    try {
      setLoading(true);
      setShowPaymentModal(false); 

      const adresse = {
        region: formData.region,
        ville: formData.ville,
        quartier: formData.quartier
      };

      const finalFormData = {
        ...formData,
        numeroPaiement: `237${paymentNumber}`
      };

      const rawImages = images.map(img => img.raw);
      const rawDocuments = documents.map(doc => doc.raw);

      await createAnnoce(
        finalFormData,
        rawImages,
        position,
        adresse,
        rawDocuments
      );

      alert("Paiement validé et annonce publiée avec succès !");

      // RESET INTEGRAL DES CHAMPS AVANT REDIRECTION
      images.forEach(img => URL.revokeObjectURL(img.preview));
      documents.forEach(doc => URL.revokeObjectURL(doc.preview));
      
      setImages([]);
      setDocuments([]);
      setPosition(null);
      setPaymentNumber('');
      setFormData({
        titreBien: '',
        prix: '',
        superficie: '',
        nbrePiece: '',
        description: '',
        typePublication: '',
        typeBienImmobilier: '',
        categorie: '',
        region: '',
        ville: '',
        quartier: ''
      });

      // Redirection finale de l'utilisateur
      window.location.href = '/mes-publications';

    } catch (err) {
      console.error("ERREUR TRANSFERT SERVEUR :", err);
      alert(err?.data?.message || "La transaction a échoué. Veuillez vérifier votre solde MoMo / Orange Money.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full font-sans text-gray-900 relative">
      
      {/* POPUP DE PAIEMENT  */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[300000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-gray-100 relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-[#007b83]/10 text-[#007b83] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CreditCard size={24} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Frais de Publication</h2>
              <p className="text-xs text-gray-400 font-medium">Finissez votre annonce en effectuant le dépôt d'activation, vous allez rececvoir un message de paiement</p>
            </div>

            {/* Ticket */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 mb-6">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>Type d'opération</span>
                <span className="uppercase tracking-wider text-gray-700 bg-white px-2 py-0.5 rounded-md border border-gray-100">{formData.typePublication}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>Montant du bien</span>
                <span className="text-gray-700">{parseFloat(formData.prix).toLocaleString()} FCFA</span>
              </div>
              <div className="h-[1px] bg-gray-200/60 my-1" />
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-gray-900">Frais à payer ({formData.typePublication === 'VENTE' ? 'Commission 5%' : 'Frais fixes'})</span>
                <span className="text-xl font-black text-[#007b83]">{calculerFraisPublication().toLocaleString()} <small className="text-[10px] font-bold">FCFA</small></span>
              </div>
            </div>

            {/* Minuteur */}
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Temps alloué pour le paiement</span>
              <div className={`text-2xl font-mono font-black mt-1 ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Formulaire Mobile Money / Orange Money */}
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Numéro de débit (MoMo / Orange Money)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-500 font-bold text-sm">+237</span>
                  <Smartphone className="absolute left-16 w-4 h-4 text-gray-400" />
                  <input 
                    type='number' 
                    required
                    value={paymentNumber}
                    onChange={(e) => { if (e.target.value.length <= 9) setPaymentNumber(e.target.value); }}
                    className="w-full pl-24 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 text-sm font-bold tracking-wider transition-all" 
                    placeholder="6XXXXXXXX" 
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a2b3c] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#007b83] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Check size={16} /> Confirmer et Payer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER & STEPPER */}
      <div className="bg-white w-full pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-[#1a2b3c] tracking-tight">
              Publier une Annonce
            </h1>
            <div className="h-1 w-12 bg-[#f97316] mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="relative flex justify-between items-end mb-4 px-4 sm:px-20">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center z-10">
                <div className={`mb-2 transition-colors duration-300 ${step >= s.id ? 'text-[#007b83]' : 'text-gray-300'}`}>
                  {s.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${step >= s.id ? 'text-[#007b83]' : 'text-gray-300'}`}>
                  {s.label}
                </span>
                <div className={`w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm transition-colors duration-300 ${step >= s.id ? 'bg-[#007b83]' : 'bg-gray-200'}`} />
              </div>
            ))}
            <div className="absolute bottom-[6px] left-0 right-0 h-[2px] bg-gray-100 mx-10 sm:mx-32 -z-0" />
            <div
              className="absolute bottom-[6px] left-0 h-[2px] bg-[#007b83] transition-all duration-500 ease-in-out mx-10 sm:mx-32 -z-0"
              style={{ width: `${((step - 1) / (steps.length - 0.5)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 w-full p-6 max-w-5xl mx-auto">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Type size={16} /> Titre du Bien</label>
              <input type="text" name='titreBien' value={formData.titreBien} placeholder="Studio moderne..." onChange={handleInputChange} required className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83] transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><DollarSign size={16} /> Prix du loyer (FCFA)</label>
              <input type="number" name='prix' value={formData.prix} required placeholder="150 000" onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Clock size={16} /> Superficie (m²)</label>
              <input type="number" name='superficie' value={formData.superficie} required placeholder="100" onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Home size={16} /> Nombre de Pièces</label>
              <input type="number" name='nbrePiece' value={formData.nbrePiece} required placeholder="5" onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold flex items-center gap-2"><AlignLeft size={16} /> Description</label>
              <textarea rows="4" name='description' value={formData.description} required placeholder="Détails importants..." onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83] resize-none"></textarea>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Photos Logement */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Photos du logement</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group">
                    <img src={img.preview} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X size={14} /></button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                  <Plus className="text-gray-400 group-hover:text-[#007b83]" size={24} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            {/* Documents Logement */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Photos des Documents du logement</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {documents.map((doc, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group">
                    <img src={doc.preview} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => removeDoc(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X size={14} /></button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                  <Plus className="text-gray-400 group-hover:text-[#007b83]" size={24} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleDocUpload} />
                </label>
              </div>
            </div>

            {/* Selects de Typologie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Type de Publication</label>
                <select name="typePublication" value={formData.typePublication} onChange={handleInputChange} className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] cursor-pointer" required>
                  <option value="" disabled>-- Choisir une option --</option>
                  <option value="VENTE">VENTE</option>
                  <option value="LOCATION">LOCATION</option>
                  <option value="BAIL">BAIL</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Type Bien Immobilier</label>
                <select name='typeBienImmobilier' value={formData.typeBienImmobilier} onChange={handleInputChange} className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] cursor-pointer" required>
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
              <div className="space-y-2">
                <label className="text-sm font-semibold">Catégorie du Bien</label>
                <select name='categorie' value={formData.categorie} onChange={handleInputChange} className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] cursor-pointer" required>
                  <option value="" disabled>-- Choisir une option --</option>
                  <option value="MEUBLE">MEUBLE</option>
                  <option value="NON_MEUBLE">NON_MEUBLE</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide"><Navigation size={16} /> Région</label>
                <select name='region' value={formData.region} onChange={handleInputChange} className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] cursor-pointer" required>
                  <option value="" disabled>-- Choisir une option --</option>
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
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide"><Navigation size={16} /> Ville</label>
                <input type="text" name='ville' value={formData.ville} onChange={handleInputChange} placeholder="Ex: Yaoundé..." className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide"><MapPin size={16} /> Quartier</label>
                <input type="text" name='quartier' value={formData.quartier} onChange={handleInputChange} placeholder="Ex: Bastos..." className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
              </div>
            </div>

            {/* Cadre Cartographie */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Localisation précise (Cliquez sur la carte)</h3>
                <button onClick={() => setIsMapExpanded(!isMapExpanded)} className={`flex items-center gap-2 text-[10px] font-bold transition-all ${isMapExpanded ? 'fixed top-6 right-6 z-[100001] bg-[#1a2b3c] text-white px-6 py-3 rounded-2xl' : 'relative z-10 text-[#007b83]'}`}>
                  {isMapExpanded ? <><Minimize2 size={14} /> QUITTER</> : <><Maximize2 size={14} /> PLEIN ÉCRAN</>}
                </button>
              </div>

              <div className={`transition-all ${isMapExpanded ? 'fixed top-8 left-1/2 -translate-x-1/2 z-[100001] w-full max-w-md px-4' : 'relative z-30'}`}>
                <SearchLocation setMapPosition={setMapPosition} />
              </div>

              <div className={`transition-all duration-500 overflow-hidden ${isMapExpanded ? 'fixed inset-0 z-[100000] bg-white w-screen h-screen' : 'relative w-full aspect-video md:aspect-[21/9] rounded-[2.5rem] border-4 border-white shadow-xl'}`}>
                <LocationPicker setPosition={setPosition} mapPosition={mapPosition} isExpanded={isMapExpanded} />
                {position && (
                  <div className={`absolute z-[100001] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border ${isMapExpanded ? 'bottom-10 right-10' : 'bottom-6 left-6'}`}>
                    <code className="text-xs font-bold text-[#007b83] font-mono">{position.lat.toFixed(5)} , {position.lng.toFixed(5)}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEPS COMMANDS */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
          {step > 1 ? (
            <button type="button" disabled={loading} onClick={() => setStep(step - 1)} className="px-6 py-3 text-gray-600 font-semibold flex items-center gap-2"><ChevronLeft size={20} /> Précédent</button>
          ) : <div />}
          
          {/* ✅ CONDITION STRICTE : Si on est au step 3, le bouton dépend de isFormInvalid() */}
          <button
            disabled={loading || (step === 3 && isFormInvalid())}
            onClick={() => { if (step < 3) { setStep(step + 1); } else { handleProcessToPayment(); } }}
            className="px-8 py-3 bg-[#007b83] text-white rounded-lg font-bold flex items-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-150 shadow-md"
          >
            {step === 3 ? (
              loading ? <><Loader2 size={20} className="animate-spin" /> CHARGEMENT...</> : <><Check size={20} /> PASSER AU PAIEMENT</>
            ) : (
              <><>Suivant</><ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationAnnonce;
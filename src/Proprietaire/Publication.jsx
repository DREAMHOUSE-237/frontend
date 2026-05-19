import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, MapPin, Layout,
  Sparkles, Type, AlignLeft, DollarSign, Clock, Check,
  Plus, Home, X, Smartphone, Navigation, Loader2, Maximize2, Minimize2, CreditCard,
  AlertCircle
} from 'lucide-react';
import LocationPicker from '../components/Map/LocationPicker';
import SearchLocation from '../components/Map/SearchLocation';
import { createAnnoce, getPublicationById } from '../service/auth_service';

const PublicationAnnonce = () => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [position, setPosition] = useState(null);
  const [mapPosition, setMapPosition] = useState([3.848, 11.502]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  // ÉTATS DE LA PASSERELLE DE PAIEMENT & WORKFLOW ASYNCHRONE
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentNumber, setPaymentNumber] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [apiError, setApiError] = useState('');
  const [redirectCount, setRedirectCount] = useState(4);
  const [createdBienId, setCreatedBienId] = useState(null);

  // Référence pour stopper le polling proprement
  const pollingIntervalRef = useRef(null);

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

  const normaliserRegion = (inputRegion) => {
    if (!inputRegion) return '';
    const cleanStr = inputRegion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (cleanStr.includes('centre')) return 'YAOUNDE_Centre';
    if (cleanStr.includes('littoral')) return 'Douala_Littoral';
    if (cleanStr.includes('ouest')) {
      if (cleanStr.includes('nord')) return 'Bamenda_NordOuest';
      if (cleanStr.includes('sud')) return 'Buea_SudOuest';
      return 'Bafoussam_Ouest';
    }
    if (cleanStr.includes('sud')) return 'Ebolowa_Sud';
    if (cleanStr.includes('est')) return 'Bertoua_Est';
    if (cleanStr.includes('nord')) return 'Garoua_Nord';
    if (cleanStr.includes('extreme')) return 'Maroua_Ngaoundere';
    if (cleanStr.includes('adamaoua')) return 'Adamaoua_ExtremeNord';
    return '';
  };

  useEffect(() => {
    if (!position) return;
    const reverseGeocode = async () => {
      try {
        setGeoLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1`
        );
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          const villeDetectee = addr.city || addr.town || addr.village || addr.county || '';
          const quartierDetecte = addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || addr.road || '';
          const regionDetectee = normaliserRegion(addr.state || addr.region);

          setFormData(prev => ({
            ...prev,
            ville: villeDetectee,
            quartier: quartierDetecte,
            region: regionDetectee || prev.region
          }));
        }
      } catch (error) {
        console.error("Erreur adresse :", error);
      } finally {
        setGeoLoading(false);
      }
    };
    reverseGeocode();
  }, [position]);

  const isFormInvalid = () => {
    return (
      !formData.titreBien.trim() ||
      !formData.prix ||
      !formData.superficie ||
      parseInt(formData.nbrePiece, 10) < 2 ||
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

  // FONCTION DE POLLING : Vérifie le statut toutes les 5 secondes
  const startPollingStatus = (bienId) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        // Appelle ton endpoint GET /api/biens/{id} via le service
        const response = await getPublicationById(bienId);
        const currentStatus = response.statutPublication || response.data?.statutPublication;

        console.log(`[Polling] Statut actuel du bien ${bienId} :`, currentStatus);

        if (currentStatus === 'ACTIVE') {
          clearInterval(pollingIntervalRef.current);
          setPaymentStatus('success');
          setLoading(false);
        } else if (currentStatus === 'REJETEE') {
          clearInterval(pollingIntervalRef.current);
          setPaymentStatus('error');
          setApiError("Le paiement a été rejeté ou a échoué. Veuillez vérifier votre solde ou votre code PIN.");
          setLoading(false);
        }
        // Si EN_ATTENTE, on ne fait rien, le polling continue
      } catch (err) {
        console.error("Erreur lors du polling du statut du bien:", err);
      }
    }, 5000); // 5 secondes
  };

  // Gestion du compte à rebours global (5 minutes max)
  useEffect(() => {
    if (!showPaymentModal || (paymentStatus !== 'idle' && paymentStatus !== 'pending_ussd')) return;
    if (timeLeft === 0) {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      setPaymentStatus('error');
      setApiError("Le délai d'attente de 5 minutes est dépassé. Veuillez vérifier vos messages USSD ou l'onglet 'Mes publications'.");
      setLoading(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showPaymentModal, timeLeft, paymentStatus]);

  // Redirection automatique après succès
  useEffect(() => {
    if (paymentStatus !== 'success') return;
    if (redirectCount === 0) {
      setShowPaymentModal(false);
      window.location.href = '/mes-publications';
      return;
    }

    const redirectTimer = setTimeout(() => {
      setRedirectCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(redirectTimer);
  }, [paymentStatus, redirectCount]);

  // Nettoyage des intervalles à la destruction du composant
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    const newImages = files.map(file => ({ raw: file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({ raw: file, preview: URL.createObjectURL(file) }));
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
      images.forEach(img => { if (img.preview.startsWith('blob:')) URL.revokeObjectURL(img.preview); });
      documents.forEach(doc => { if (doc.preview.startsWith('blob:')) URL.revokeObjectURL(doc.preview); });
    };
  }, [images, documents]);

  useEffect(() => {
    document.body.style.overflow = isMapExpanded || showPaymentModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMapExpanded, showPaymentModal]);

  const handleProcessToPayment = () => {
    if (isFormInvalid()) {
      alert("Veuillez remplir correctement l'intégralité du formulaire.");
      return;
    }
    setTimeLeft(300); // 5 minutes 
    setPaymentStatus('idle');
    setApiError('');
    setRedirectCount(4);
    setShowPaymentModal(true);
  };

  // 🔥 CRÉATION ET ENVOI DE LA REQUÊTE USSD
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!paymentNumber || paymentNumber.length !== 9) {
      alert("Veuillez entrer un numéro de paiement valide à 9 chiffres.");
      return;
    }

    try {
      setLoading(true);
      setPaymentStatus('processing');
      setApiError('');

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

      // Le backend enregistre le bien au statut EN_ATTENTE et déclenche le message RabbitMQ pour Campay
      const result = await createAnnoce(
        finalFormData,
        rawImages,
        position,
        adresse,
        rawDocuments
      );

      // On récupère l'id généré renvoyé par le DTO du backend
      const bienId = result?.id || result?.data?.id;

      if (bienId) {
        setCreatedBienId(bienId);
        setPaymentStatus('pending_ussd');
        startPollingStatus(bienId); //  Lancement immédiat du Polling toutes les 5s
      } else {
        throw new Error("L'annonce a été initiée mais l'ID de suivi est introuvable.");
      }

    } catch (err) {
      console.error("ERREUR :", err);
      setPaymentStatus('error');
      setApiError(err?.data?.message || err?.message || "Erreur de connexion avec le serveur lors de la soumission initiale.");
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
              onClick={() => {
                if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                setShowPaymentModal(false);
              }}
              disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-0"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-inner transition-colors ${paymentStatus === 'success' ? 'bg-green-100 text-green-600' :
                  paymentStatus === 'error' ? 'bg-red-100 text-red-600' :
                    paymentStatus === 'pending_ussd' ? 'bg-amber-100 text-amber-600' : 'bg-[#007b83]/10 text-[#007b83]'
                }`}>
                <CreditCard size={24} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {paymentStatus === 'success' ? "Publication Activée " :
                  paymentStatus === 'pending_ussd' ? "En attente de votre PIN " : "Frais de Publication"}
              </h2>
              <p className="text-xs text-gray-400 font-medium px-4">
                {paymentStatus === 'success' ? "Votre paiement a été validé ! L'annonce est instantanément visible sur le listing public." :
                  paymentStatus === 'pending_ussd' ? "Verifiez la demande de paiement sur votre mobile." :
                    "Finalisez votre annonce en effectuant le dépôt d'activation."}
              </p>
            </div>

            {/* Ticket de caisse */}
            {(paymentStatus !== 'success' && paymentStatus !== 'pending_ussd') && (
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
            )}

            {/* CHARGEMENTS & ETATS ASYNCHRONES */}
            <div className="text-center mb-6 py-2">
              {(paymentStatus === 'idle' || paymentStatus === 'pending_ussd') && (
                <>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Temps de validation restant</span>
                  <div className={`text-2xl font-mono font-black mt-1 ${timeLeft <= 45 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </>
              )}

              {paymentStatus === 'processing' && (
                <div className="text-sm font-bold text-[#007b83] flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-[#007b83]" size={32} />
                  <span className="italic uppercase tracking-wider text-xs text-center">Création de la publication.....</span>
                </div>
              )}

              {/* 📲 ÉCRAN D'ATTENTE USSD  */}
              {paymentStatus === 'pending_ussd' && (
                <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-left space-y-3 mt-2 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide">
                    <Loader2 className="animate-spin text-amber-600" size={16} /> Demande initiée avec succès
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Un message de confirmation va apparaître sur votre téléphone connecté au numéro <strong className="font-bold font-mono">6{paymentNumber}</strong>.<br /><br />
                    1. Saisissez votre **code PIN** pour valider la transaction.<br />
                    2. Si aucun message ne s'affiche,vérifiez vos approbations via Momo(MTN)/ Orange Money(OM).
                  </p>

                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="text-sm font-bold text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center gap-2">
                  <span className="uppercase tracking-widest text-xs font-black">Félicitations !</span>
                  <p className="font-normal text-xs text-green-700">Paiement reçu. Redirection vers vos propriétés dans {redirectCount}s...</p>
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="text-left text-xs font-semibold text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px]">
                    <AlertCircle size={14} /> Échec de l'activation
                  </div>
                  <p className="italic font-medium text-red-700">{apiError}</p>
                </div>
              )}
            </div>

            {/* Formulaire de saisie du numéro */}
            {(paymentStatus !== 'success' && paymentStatus !== 'pending_ussd') && (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Numéro de débit Mobile Money (Orange / MTN)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-500 font-bold text-sm">+237</span>
                    <Smartphone className="absolute left-16 w-4 h-4 text-gray-400" />
                    <input
                      type='number'
                      required
                      disabled={paymentStatus === 'processing'}
                      value={paymentNumber}
                      onChange={(e) => { if (e.target.value.length <= 9) setPaymentNumber(e.target.value); }}
                      className="w-full pl-24 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#007b83] focus:ring-4 focus:ring-[#007b83]/10 text-sm font-bold tracking-wider transition-all"
                      placeholder="6XXXXXXXX"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentStatus === 'processing'}
                  className="w-full bg-[#1a2b3c] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#007b83] transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-300"
                >
                  {paymentStatus === 'error' ? "Réessayer le paiement" : "Lancer la demande de paiement"}
                </button>
              </form>
            )}

            {/* Bouton de secours si on est bloqué sur l'écran USSD et qu'on veut quitter ou relancer */}
            {paymentStatus === 'error' && (
              <button
                onClick={() => {
                  setPaymentStatus('idle');
                  setTimeLeft(300);
                }}
                className="w-full mt-2 text-center text-xs font-bold text-[#007b83] underline"
              >
                Changer de numéro ou modifier les informations
              </button>
            )}
          </div>
        </div>
      )}

      {/* HEADER & STEPPER */}
      <div className="bg-white w-full pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-[#1a2b3c] tracking-tight">Publier une Annonce</h1>
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

      {/* CONTENU PRINCIPAL DU FORMULAIRE */}
      <div className="flex-1 w-full p-6 max-w-5xl mx-auto">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Type size={16} /> Titre du Bien</label>
              <input type="text" name='titreBien' value={formData.titreBien} placeholder="Studio moderne..." onChange={handleInputChange} required className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Home size={16} /> Nombre de Pièces
              </label>
              <input type="number" name='nbrePiece' min="2" value={formData.nbrePiece} required placeholder="Minimum 2 pièces" onChange={handleInputChange} className={`w-full p-4 border rounded-lg outline-none transition-colors ${formData.nbrePiece && parseInt(formData.nbrePiece, 10) < 2
                  ? 'border-red-500 focus:border-red-500 bg-red-50/30'
                  : 'border-gray-200 focus:border-[#007b83]'
                }`}
              />
              {/* Message d'erreur dynamique */}
              {formData.nbrePiece && parseInt(formData.nbrePiece, 10) < 2 && (
                <p className="text-xs text-red-500 font-medium animate-in fade-in duration-200">
                  ⚠️ Le bien doit posséder au minimum 2 pièces pour être publié.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Clock size={16} /> Superficie (m²)</label>
              <input type="number" name='superficie' value={formData.superficie} required placeholder="100" onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold flex items-center gap-2"><AlignLeft size={16} /> Description</label>
              <textarea rows="4" name='description' value={formData.description} required placeholder="Détails importants..." onChange={handleInputChange} className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83] resize-none"></textarea>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Photos du logement</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group">
                    <img src={img.preview} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 group">
                  <Plus className="text-gray-400 group-hover:text-[#007b83]" size={24} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Photos des Documents du logement</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {documents.map((doc, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group">
                    <img src={doc.preview} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => removeDoc(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 group">
                  <Plus className="text-gray-400 group-hover:text-[#007b83]" size={24} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleDocUpload} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Type de Publication</label>
                <select name="typePublication" value={formData.typePublication} onChange={handleInputChange} className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" required>
                  <option value="" disabled>-- Choisir une option --</option>
                  <option value="VENTE">VENTE</option>
                  <option value="LOCATION">LOCATION</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Type Bien Immobilier</label>
                <select name='typeBienImmobilier' value={formData.typeBienImmobilier} onChange={handleInputChange} className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" required>
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
                <select name='categorie' value={formData.categorie} onChange={handleInputChange} className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" required>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Localisation précise (Cliquez sur la carte)</h3>
                <button onClick={() => setIsMapExpanded(!isMapExpanded)} className={`flex items-center gap-2 text-[10px] font-bold ${isMapExpanded ? 'fixed top-6 right-6 z-[100001] bg-[#1a2b3c] text-white px-6 py-3 rounded-2xl' : 'relative z-10 text-[#007b83]'}`}>
                  {isMapExpanded ? <><Minimize2 size={14} /> QUITTER</> : <><Maximize2 size={14} /> PLEIN ÉCRAN</>}
                </button>
              </div>

              <div className={`transition-all ${isMapExpanded ? 'fixed top-8 left-1/2 -translate-x-1/2 z-[100001] w-full max-w-md px-4' : 'relative z-30'}`}>
                <SearchLocation setMapPosition={setMapPosition} />
              </div>

              <div className={`transition-all duration-500 overflow-hidden ${isMapExpanded ? 'fixed inset-0 z-[100000] bg-white w-screen h-screen' : 'relative w-full aspect-video md:aspect-[21/9] rounded-[2.5rem] border-4 border-white shadow-xl'}`}>
                <LocationPicker setPosition={setPosition} mapPosition={mapPosition} isExpanded={isMapExpanded} />
                {position && (
                  <div className={`absolute z-[100001] bg-white/95 backdrop-blur-md p-3 rounded-2xl border ${isMapExpanded ? 'bottom-10 right-10' : 'bottom-6 left-6'}`}>
                    <code className="text-xs font-bold text-[#007b83] font-mono">{position.lat.toFixed(5)} , {position.lng.toFixed(5)}</code>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                  <Navigation size={16} /> Région {geoLoading && <Loader2 size={12} className="animate-spin text-[#007b83] inline ml-1" />}
                </label>
                <select name='region' value={formData.region} onChange={handleInputChange} className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" required>
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
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                  <Navigation size={16} /> Ville
                </label>
                <input type="text" name='ville' value={formData.ville} onChange={handleInputChange} placeholder="Ville..." className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                  <MapPin size={16} /> Quartier
                </label>
                <input type="text" name='quartier' value={formData.quartier} onChange={handleInputChange} placeholder="Quartier..." className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
              </div>
            </div>
          </div>
        )}

        {/* BOUTONS DE NAVIGATION */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
          {step > 1 ? (
            <button type="button" disabled={loading} onClick={() => setStep(step - 1)} className="px-6 py-3 text-gray-600 font-semibold flex items-center gap-2"><ChevronLeft size={20} /> Précédent</button>
          ) : <div />}

          <button
            disabled={loading || (step === 3 && isFormInvalid())}
            onClick={() => { if (step < 3) { setStep(step + 1); } else { handleProcessToPayment(); } }}
            className="px-8 py-3 bg-[#007b83] text-white rounded-lg font-bold flex items-center gap-2 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {step === 3 ? <><Check size={20} /> PASSER AU PAIEMENT</> : <><>Suivant</><ChevronRight size={20} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationAnnonce;
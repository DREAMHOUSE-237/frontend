import React, { useState } from "react";
import {
  Home,
  AlignLeft,
  Link as LinkIcon,
  Building2,
  DollarSign,
  FileText,
  File,
  RotateCcw,
  Send,
  X,
  Upload,
  Trash2,
  CheckCircle,
  Paperclip,
  LayoutList,
  User,
  MapPin,
  Smartphone,
} from "lucide-react";

// --- NAVBAR (Inchagé) ---
const Navbar = ({ activePage }) => {
  const navItems = [
    { name: "Publication", href: "/Publication", icon: Home },
    { name: "Mes Publications", href: "/MesPublications", icon: LayoutList },
    { name: "Mon profil", href: "/MonProfil", icon: User },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Home className="w-6 h-6 text-blue-600" />
              DreamHouse
            </h1>
          </div>
          <div className="flex items-center">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activePage === item.name
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-1.5" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- PAGE PRINCIPALE ---
export default function PublierBienImmobilier() {
  const [formData, setFormData] = useState({
    titre: "",
    superficie: "",
    nombrePieces: "",
    prix: "",
    description: "",
    region: "",
    ville: "",
    quartier: "",
    typePublication: "",
    categorie: "",
  });

  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // ÉTAT POUR LE NUMÉRO DE PAIEMENT
  const [paymentNumber, setPaymentNumber] = useState(""); 
  // ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map((file) => ({
      file,
      name: file.name,
      id: Math.random().toString(36),
    }));
    setDocuments((prev) => [...prev, ...newDocuments]);
  };

  const removeDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };
  
  const calculateFees = () => {
    const prix = parseFloat(formData.prix) || 0;
    // Les frais ne sont calculés que si le prix est supérieur à 1000 XAF pour éviter les montants très faibles
    return (prix > 1000 ? (prix * 0.05) : 0).toFixed(0); 
  };
  
  const totalFees = parseFloat(calculateFees());

  const handleReset = () => {
    setFormData({
      titre: "",
      superficie: "",
      nombrePieces: "",
      prix: "",
      description: "",
      region: "",
      ville: "",
      quartier: "",
      typePublication: "",
      categorie: "",
    });
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setDocuments([]);
    setPaymentNumber(""); 
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // ✅ Vérification du numéro de paiement ici avant la modale
    if (!paymentNumber || paymentNumber.length < 8 || paymentNumber.length > 9 || !/^\d+$/.test(paymentNumber)) { 
        setError("Veuillez entrer un numéro de téléphone de paiement valide (8 ou 9 chiffres) avant de continuer.");
        return;
    }
    
    // Si tout est bon, ouvrir la modale de confirmation
    setShowModal(true);
  };

  // ✅ Fonction FINALE avec préfixe +237
  const confirmPublish = async () => {
    
    // On suppose que la vérification du numéro est déjà faite dans handleSubmit
    const fullPaymentNumber = `237${paymentNumber}`; 

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // --- LOGIQUE DE PAIEMENT (SIMULÉE) ---
      console.log(`Déclenchement du paiement de ${totalFees} XAF sur le numéro: ${fullPaymentNumber}`);
      // ------------------------------------

      const formDataToSend = new FormData();

      // ✅ Récupérer l'email de l'utilisateur connecté
      const userEmail = localStorage.getItem('userEmail') || 
                        sessionStorage.getItem('userEmail') || 
                        "proprietaire@dreamhouse.com";

      const bienData = {
        titreBien: formData.titre,
        superfie: parseFloat(formData.superficie),
        nbrePiece: parseInt(formData.nombrePieces),
        prix: parseFloat(formData.prix),
        description: formData.description,
        adresse: {
          region: formData.region,
          ville: formData.ville,
          quartier: formData.quartier
        },
        typePublication: formData.typePublication,
        categorie: formData.categorie,
        proprietaireEmail: userEmail,
        // Envoi du numéro de paiement complet au backend
        numeroPaiement: fullPaymentNumber
      };

      console.log("=== DONNÉES À ENVOYER (avec numéro complet) ===");
      console.log("bienData:", bienData);

      formDataToSend.append(
        "bien",
        new Blob([JSON.stringify(bienData)], { type: "application/json" })
      );

      images.forEach((image) => {
        formDataToSend.append("images", image.file);
      });
      documents.forEach((document) => {
        formDataToSend.append("documents", document.file);
      });

      // ✅ Appel API pour la publication (SIMULÉ)
      // Simuler une réponse réussie après un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici, le code réel ferait l'appel fetch
    
      const response = await fetch("/api/biens", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Erreur HTTP: ${response.status}. Vérifiez les données ou le statut du paiement.`
        );
      }
      const responseData = await response.json();
      

      setSuccess(true);
      
      // Redirection après succès
      setTimeout(() => {
        setShowModal(false);
        handleReset();
        // Optionnel: navigate('/MesPublications');
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de la publication/paiement:", err);
      setError(
        err?.message || "Une erreur est survenue lors de la publication"
      );
    } finally {
      setLoading(false);
    }
  };
  // --- Rendu JSX ---
  return (
    <div className="bg-gray-50">
      <Navbar activePage="Publication" />

      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Publier un Bien Immobilier
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Colonne gauche : Détails du Bien */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Détails du Bien
                </h2>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du bien <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="titre"
                      value={formData.titre}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Superficie (m²) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="superficie"
                      value={formData.superficie}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de pièces <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="nombrePieces"
                      value={formData.nombrePieces}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Colonne droite : Localisation, Classification, Médias & Paiement */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Localisation & Classification
                </h2>

                {/* Champs de Localisation */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Région <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Ex: CENTRE"
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Ex: YAOUNDE"
                      required
                      disabled={!formData.region}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quartier <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="quartier"
                      value={formData.quartier}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Ex: Bastos"
                      required
                    />
                  </div>
                </div>

                {/* Champs de Classification */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de publication <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="typePublication"
                      value={formData.typePublication}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                      required
                    >
                      <option value="">-- Choisir une option --</option>
                      <option value="VENTE">VENTE</option>
                      <option value="LOCATION">LOCATION</option>
                    </select>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="categorie"
                      value={formData.categorie}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                      required
                    >
                      <option value="">-- Choisir une option --</option>
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

                {/* Images */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images du Bien
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium mb-1">
                        Télécharger les Images
                      </p>
                      <p className="text-gray-500 text-sm">
                        ({images.length} fichier(s) sélectionné(s))
                      </p>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {images.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.preview}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documents */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documents de Propriété
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <File className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium mb-1">
                        Télécharger les Documents
                      </p>
                      <p className="text-gray-500 text-sm">
                        ({documents.length} fichier(s) sélectionné(s))
                      </p>
                    </label>
                  </div>

                  {documents.length > 0 && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-3 space-y-2">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex justify-between items-center p-2 bg-white rounded shadow-sm border border-gray-100"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">
                              {doc.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id)}
                            className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* ------------------------------------------- */}
                {/* ✅ CHAMP DE PAIEMENT DÉPLACÉ ICI (Mobile Money) */}
                {/* ------------------------------------------- */}
                <h2 className="text-xl font-semibold text-gray-800 mb-6 border-t pt-6">
                    Paiement des Frais ({totalFees.toLocaleString('fr-FR')} FCFA)
                </h2>
                <div className="mb-5 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de paiement (Mobile Money/Orange Money) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-sm">+237</span>
                        <Smartphone className="absolute left-16 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={paymentNumber}
                          onChange={(e) => setPaymentNumber(e.target.value.replace(/\D/g, '').slice(0, 9))} // Ne permet que les chiffres, maximum 9
                          className="w-full pl-24 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          placeholder="6XXXXXXXX (obligatoire)"
                          required
                          maxLength={9} 
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Les frais de publication de **{totalFees.toLocaleString('fr-FR')} FCFA** seront débités du numéro **+237 {paymentNumber || '6XXXXXXXX'}** après confirmation.
                    </p>
                    <p className="text-sm font-medium text-blue-700 mt-2">
                        (Frais : 5% du prix de vente/location. Calculé sur {parseFloat(formData.prix).toLocaleString('fr-FR')} FCFA)
                    </p>
                </div>
                {/* ------------------------------------------- */}
                {/* FIN CHAMP DE PAIEMENT DÉPLACÉ */}
                {/* ------------------------------------------- */}


                <p className="text-sm text-gray-500 italic mt-4">
                  * La date de publication est automatiquement définie par le backend.
                </p>
              </div>
            </div>

            {/* Boutons d'Action (En bas) */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <RotateCcw className="w-5 h-5" />
                Réinitialiser
              </button>
              <button
                type="submit" // Déclenche handleSubmit (qui fait la vérification et ouvre la modale)
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                <Send className="w-5 h-5" />
                Publier (Confirmer & Payer)
              </button>
            </div>
            
            {/* Affichage des erreurs au niveau du formulaire si le numéro de paiement n'est pas valide */}
            {error && !showModal && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto">
                    <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                        <X className="w-4 h-4" /> {error}
                    </p>
                </div>
            )}
          </form>
        </div>
      </div>

    {/* Modal de Confirmation (Simplifiée) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Confirmer la Publication
              </h3>
              <p className="text-gray-600">
                Veuillez confirmer l'envoi de la publication et l'initiation du paiement.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                
              {/* Détails de la transaction */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bien à Publier :</span>
                <span className="font-semibold text-gray-800 truncate max-w-[60%]">
                    {formData.titre || "Nouveau Bien"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Numéro de Paiement :</span>
                <span className="font-semibold text-green-700">
                  +237 {paymentNumber}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    Montant Total à Payer :
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalFees.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            </div>

            {/* Affichage des erreurs si elles surviennent au moment du paiement/de la publication */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm font-medium">
                  Bien publié avec succès! Redirection en cours ...
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                onClick={confirmPublish}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Paiement & Publication ...
                  </>
                ) : (
                  "Confirmer & Payer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import {
    MapPin, Home as HomeIcon, Star, X, ChevronLeft, ChevronRight, Phone, Mail,
    Loader2, AlertCircle, LayoutList, User
} from 'lucide-react';

// URL de l'API (via le proxy de Vite)
const API_URL = '/api/biens';

// Fonction pour construire l'URL complète des images
const getImageUrl = (imageName) => {
    // Si c'est déjà une URL complète, on la retourne telle quelle
    if (imageName.startsWith('http')) {
        return imageName;
    }
    // Sinon, on suppose que c'est un nom de fichier stocké sur le serveur
    return `http://localhost:8080/images/${imageName}`;
};

// --- Fonction de Mappage de la Card (Affiche la liste) ---
const ListingCard = ({ listing, openDetails }) => {
    // 1. Mappage des champs
    const price = listing.prix ? listing.prix.toLocaleString('fr-FR') + ' XAF' : 'N/A';

    // 2. Mappage de l'Adresse - Adapté à votre structure
    let location = 'Localisation non précisée';
    if (listing.ville || listing.quartier || listing.region) {
        const parts = [];
        if (listing.quartier) parts.push(listing.quartier);
        if (listing.ville) parts.push(listing.ville);
        if (listing.region && listing.ville !== listing.region) {
            parts.push(listing.region);
        }
        location = parts.join(', ') || 'Localisation non précisée';
    }

    // 3. Mappage du nombre de pièces
    const rooms = listing.nbrePiece || 0;

    // 4. Mappage du Titre
    const title = listing.titreBien || 'Bien Sans Titre';

    // 5. Mappage des Images
    const firstImage = (listing.images && listing.images.length > 0)
        ? getImageUrl(listing.images[0])
        : "https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800";

    // 6. Mappage de la Note (par défaut)
    const rating = 4.0;

    return (
        <div
            key={listing.id}
            onClick={() => openDetails(listing)}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer"
        >
            <img
                src={firstImage}
                alt={title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800"
                }}
            />
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xl font-bold text-orange-500">
                        {price}
                        <span className="text-sm font-normal text-gray-500"> / {listing.typePublication === 'VENTE' ? 'vente' : 'mois'}</span>
                    </p>
                    <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                        <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
                    </div>
                </div>
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                        {title}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                        {listing.categorie || 'Non spécifié'}
                    </span>
                </div>
                <div className="flex justify-between items-center text-gray-600 text-sm">
                    <div className="flex items-center truncate max-w-[60%]">
                        <MapPin className="w-4 h-4 mr-1 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center">
                        <HomeIcon className="w-4 h-4 mr-1" />
                        <span>{rooms} pièce{rooms > 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Composant Principal Home ---
const HomePage = () => {
    const [listings, setListings] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Appel API ---
    const fetchListings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Erreur HTTP ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorText;
                } catch {
                    errorMessage = errorText;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            // Adaptation des données reçues du backend
            const listingsData = Array.isArray(data) ? data : data.content || data.data || [];

            // Filtrer pour ne montrer que les biens ACTIFS
            const activeListings = listingsData; // Afficher tout pour l'instant

            setListings(activeListings);

        } catch (err) {
            let userMessage = `Impossible de charger les annonces. Détails: ${err.message}.`;
            if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
                userMessage = `Problème de connexion (CORS/Réseau). Vérifiez le serveur backend (${API_URL}) et le proxy Vite.`;
            }
            setError(userMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const openPropertyDetails = (listing) => {
        const processedImages = (listing.images && listing.images.length > 0)
            ? listing.images.map(img => getImageUrl(img))
            : ["https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800"];

        const propertyWithImages = {
            ...listing,
            images: processedImages
        };
        setSelectedProperty(propertyWithImages);
        setCurrentImageIndex(0);
    };

    const closePropertyDetails = () => {
        setSelectedProperty(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        if (selectedProperty) {
            setCurrentImageIndex((prev) =>
                prev === selectedProperty.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const previousImage = () => {
        if (selectedProperty) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedProperty.images.length - 1 : prev - 1
            );
        }
    };

    // --- FONCTION POUR OUVRIR WHATSAPP ---
    const openWhatsApp = (phoneNumber) => {
        if (!phoneNumber) {
            console.warn('Aucun numéro de paiement fourni pour ce bien.');
            alert('Numéro de contact non disponible pour ce bien.');
            return;
        }
        
        // Nettoyage du numéro (supprime espaces et +)
        const cleanPhone = phoneNumber.replace(/[\s\+]/g, '');
        
        // Vérification basique du format
        if (!/^\d+$/.test(cleanPhone) || cleanPhone.length < 9) {
            console.warn(`Format de numéro invalide: ${phoneNumber}`);
            alert(`Numéro de contact invalide: ${phoneNumber}`);
            return;
        }
        
        // Construction de l'URL WhatsApp avec un message pré-rempli
        const message = `Bonjour, je suis intéressé par votre bien "${selectedProperty?.titreBien || ''}" (ID: ${selectedProperty?.id || ''})`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        
        // Ouvrir dans un nouvel onglet
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    // --- Rendu de la Modal (Détails) ---
    const renderModal = () => {
        if (!selectedProperty) return null;

        // 1. Mappage des champs pour la Modal
        const price = selectedProperty.prix ? selectedProperty.prix.toLocaleString('fr-FR') + ' XAF' : 'N/A';

        // 2. Localisation
        let location = 'Localisation non précisée';
        if (selectedProperty.ville || selectedProperty.quartier || selectedProperty.region) {
            const parts = [];
            if (selectedProperty.quartier) parts.push(selectedProperty.quartier);
            if (selectedProperty.ville) parts.push(selectedProperty.ville);
            if (selectedProperty.region && selectedProperty.ville !== selectedProperty.region) {
                parts.push(selectedProperty.region);
            }
            location = parts.join(', ') || 'Localisation non précisée';
        }

        // 3. Nombre de pièces
        const rooms = selectedProperty.nbrePiece || 0;

        // 4. Titre et description
        const title = selectedProperty.titreBien || 'Bien Sans Titre';
        const description = selectedProperty.description || 'Aucune description fournie.';

        // 5. Catégorie et type
        const category = selectedProperty.categorie || 'Non spécifié';
        const typePublication = selectedProperty.typePublication || 'VENTE';

        // 6. Numéro de paiement (pour WhatsApp)
        const contactNumber = selectedProperty.numeroPaiement || null;

        // 7. Image actuelle du carrousel
        const currentImage = selectedProperty.images[currentImageIndex] ||
            "https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800";

        // 8. Date de publication formatée
        let dateFormatted = 'Date non disponible';
        if (selectedProperty.datePublication) {
            try {
                const date = new Date(selectedProperty.datePublication);
                dateFormatted = date.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
            } catch (e) {
                dateFormatted = selectedProperty.datePublication;
            }
        }

        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                    {/* Bouton fermer */}
                    <button
                        onClick={closePropertyDetails}
                        className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Galerie d'images */}
                    <div className="relative h-96 bg-gray-900">
                        <img
                            src={currentImage}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800"
                            }}
                        />

                        {/* Boutons navigation images */}
                        {selectedProperty.images.length > 1 && (
                            <>
                                <button
                                    onClick={previousImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                                >
                                    <ChevronRight className="w-6 h-6 text-gray-800" />
                                </button>

                                {/* Indicateur d'images */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
                                    {currentImageIndex + 1} / {selectedProperty.images.length}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Informations détaillées */}
                    <div className="p-6">
                        {/* En-tête avec catégorie et type */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                                        {category}
                                    </span>
                                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                        {typePublication}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
                                <div className="flex items-center text-gray-600 mb-2">
                                    <MapPin className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                                    <span>{location}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-orange-500">{price}</div>
                                <div className="text-gray-500">
                                    {typePublication === 'VENTE' ? 'à vendre' : 'par mois'}
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Publié le {dateFormatted}
                                </div>
                            </div>
                        </div>

                        {/* Caractéristiques */}
                        <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <HomeIcon className="w-6 h-6 text-blue-600" />
                                <div>
                                    <div className="font-semibold text-gray-800">{rooms}</div>
                                    <div className="text-xs text-gray-500">
                                        pièce{rooms > 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                            {/* Superficie */}
                            {selectedProperty.superficie && (
                                <div className="flex items-center gap-2">
                                    <LayoutList className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <div className="font-semibold text-gray-800">
                                            {selectedProperty.superficie.toLocaleString('fr-FR')} m²
                                        </div>
                                        <div className="text-xs text-gray-500">Superficie</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {description}
                            </p>
                        </div>

                        {/* Informations supplémentaires */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Informations Complémentaires</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Catégorie</p>
                                    <p className="font-semibold text-gray-800">{category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Type de publication</p>
                                    <p className="font-semibold text-gray-800">{typePublication}</p>
                                </div>
                                {selectedProperty.superficie && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Superficie</p>
                                        <p className="font-semibold text-gray-800">
                                            {selectedProperty.superficie.toLocaleString('fr-FR')} m²
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Date de publication</p>
                                    <p className="font-semibold text-gray-800">{dateFormatted}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact - SECTION MODIFIÉE POUR WHATSAPP */}
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Intéressé par ce bien ?</h3>
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-gray-700 mb-2">
                                        Contactez directement via WhatsApp pour plus d'informations ou une visite.
                                    </p>
                                    {/* Affichage du numéro de paiement */}
                                    <p className="text-gray-700 flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                                        <span className="font-semibold">Numéro de contact :</span>
                                        <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                            {contactNumber || 'Non spécifié'}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Cliquez sur le bouton pour ouvrir WhatsApp avec ce numéro
                                    </p>
                                </div>
                                {/* Bouton WhatsApp */}
                                <button
                                    onClick={() => openWhatsApp(contactNumber)}
                                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!contactNumber}
                                    title={contactNumber ? `Ouvrir WhatsApp avec le numéro ${contactNumber}` : 'Numéro non disponible'}
                                >
                                    <Phone className="w-5 h-5" />
                                    Contacter sur WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-5 md:px-10">
                {/* MESSAGE D'ACCUEIL */}
                <header className="mb-8 text-center pt-4">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Bienvenue chez <span className="text-red-600">DreamHouse</span>
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Votre rêve d'immobilier commence ici. Trouvez la maison idéale.
                    </p>
                </header>

                {/* SECTION DES ANNONCES */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Annonces Actuelles
                    </h2>
                    {!isLoading && !error && (
                        <div className="text-gray-600 text-sm">
                            {listings.length} annonce{listings.length !== 1 ? 's' : ''} disponible{listings.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* État de chargement */}
                {isLoading && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                        <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-500 animate-spin" />
                        <p className="text-lg text-gray-600">Chargement des annonces...</p>
                    </div>
                )}

                {/* Message d'erreur */}
                {error && !isLoading && (
                    <div className="text-center py-10 bg-red-50 border border-red-300 rounded-xl shadow-lg">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                        <p className="text-lg font-bold text-red-700">Erreur de Connexion</p>
                        <p className="text-sm text-red-600 mt-2">{error}</p>
                        <button
                            onClick={fetchListings}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Affichage des annonces */}
                {!isLoading && !error && listings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                openDetails={openPropertyDetails}
                            />
                        ))}
                    </div>
                ) : !isLoading && !error && (
                    <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-lg">
                        <LayoutList className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">Aucune annonce immobilière active trouvée.</p>
                        <p className="text-sm mt-2">Revenez plus tard pour découvrir de nouvelles annonces.</p>
                    </div>
                )}

                {/* Rendu de la Modal */}
                {renderModal()}
            </div>
        </div>
    );
};

export default HomePage;
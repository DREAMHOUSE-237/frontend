import React, { useState, useEffect } from 'react';
import {
    Search, Bell, MapPin, Bed, Bath, Star, X, ChevronLeft,
    ChevronRight, Phone, Mail, Home as HomeIcon,
    LayoutList, User, Filter, ChevronDown, Loader2
} from 'lucide-react';

// URL de l'API
const API_BASE_URL = '/api/biens';

// Options pour les filtres
const TYPE_PUBLICATION_OPTIONS = [
    { value: '', label: 'Tous les types' },
    { value: 'LOCATION', label: 'Location' },
    { value: 'VENTE', label: 'Vente' }
];

const CATEGORIE_OPTIONS = [
    { value: '', label: 'Toutes catégories' },
    { value: 'CHAMBRE', label: 'Chambre' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'APPARTEMENT', label: 'Appartement' },
    { value: 'IMMEUBLE', label: 'Immeuble' },
    { value: 'TERRAIN', label: 'Terrain' },
    { value: 'MAISON', label: 'Maison' },
    { value: 'BOUTIQUE', label: 'Boutique' },
    { value: 'BUREAU', label: 'Bureau' }
];

// Fonction pour construire l'URL complète des images
const getImageUrl = (imageName) => {
    if (!imageName) {
        return "https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800";
    }

    // Si c'est déjà une URL complète
    if (imageName.startsWith('http')) {
        return imageName;
    }

    // Construire l'URL vers vos uploads
    return `http://192.168.172.81:8079/DREAMHOUSE/uploads/${imageName}`;
};

// --- Composant Discovery ---
const Discovery = () => {
    // États pour les données
    const [allListings, setAllListings] = useState([]); // Toutes les annonces
    const [filteredListings, setFilteredListings] = useState([]); // Annonces filtrées
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);

    // États pour les filtres
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypePublication, setSelectedTypePublication] = useState('');
    const [selectedCategorie, setSelectedCategorie] = useState('');
    const [selectedVille, setSelectedVille] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedQuartier, setSelectedQuartier] = useState('');
    const [prixMax, setPrixMax] = useState('');
    const [nbrePieceMin, setNbrePieceMin] = useState('');

    // État pour afficher/cacher les filtres avancés
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Fonction pour charger toutes les annonces initiales
    const fetchAllListings = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const listingsData = Array.isArray(data) ? data : data.content || data.data || [];
            setAllListings(listingsData);
            setFilteredListings(listingsData);

        } catch (err) {
            console.error('Erreur lors du chargement des annonces:', err);
            setError(`Impossible de charger les annonces: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour effectuer la recherche côté client avec tous les filtres
    const performSearch = async () => {
        setIsSearching(true);
        setError(null);

        try {
            // D'abord, appliquer tous les filtres côté client
            let results = [...allListings];

            // Appliquer chaque filtre séquentiellement
            if (selectedCategorie) {
                results = results.filter(listing =>
                    listing.categorie === selectedCategorie
                );
            }

            if (selectedTypePublication) {
                results = results.filter(listing =>
                    listing.typePublication === selectedTypePublication
                );
            }

            if (prixMax) {
                const maxPrice = parseFloat(prixMax);
                if (!isNaN(maxPrice)) {
                    results = results.filter(listing =>
                        listing.prix && listing.prix <= maxPrice
                    );
                }
            }

            if (nbrePieceMin) {
                const minRooms = parseInt(nbrePieceMin);
                if (!isNaN(minRooms)) {
                    results = results.filter(listing =>
                        listing.nbrePiece && listing.nbrePiece >= minRooms
                    );
                }
            }

            if (selectedVille) {
                const villeUpper = selectedVille.toUpperCase();
                results = results.filter(listing =>
                    listing.ville && listing.ville.toUpperCase() === villeUpper
                );
            }

            if (selectedQuartier) {
                const quartierLower = selectedQuartier.toLowerCase();
                results = results.filter(listing =>
                    listing.quartier && listing.quartier.toLowerCase().includes(quartierLower)
                );
            }

            if (selectedRegion) {
                const regionUpper = selectedRegion.toUpperCase();
                results = results.filter(listing =>
                    listing.region && listing.region.toUpperCase() === regionUpper
                );
            }

            // Recherche textuelle globale
            if (searchQuery) {
                const queryLower = searchQuery.toLowerCase();
                results = results.filter(listing =>
                    (listing.titreBien && listing.titreBien.toLowerCase().includes(queryLower)) ||
                    (listing.quartier && listing.quartier.toLowerCase().includes(queryLower)) ||
                    (listing.description && listing.description.toLowerCase().includes(queryLower)) ||
                    (listing.ville && listing.ville.toLowerCase().includes(queryLower)) ||
                    (listing.region && listing.region.toLowerCase().includes(queryLower))
                );
            }

            setFilteredListings(results);

        } catch (err) {
            console.error('Erreur lors de la recherche:', err);
            setError(`Erreur de recherche: ${err.message}`);
        } finally {
            setIsSearching(false);
        }
    };

    // Fonction alternative pour utiliser les endpoints API individuels (optionnel)
    const performApiSearch = async () => {
        setIsSearching(true);
        setError(null);

        try {
            // Détecter quel filtre est sélectionné
            const filters = [];
            if (selectedCategorie) filters.push({ type: 'categorie', value: selectedCategorie });
            if (selectedTypePublication) filters.push({ type: 'type-publication', value: selectedTypePublication });
            if (prixMax) filters.push({ type: 'prix-max', value: prixMax });
            if (nbrePieceMin) filters.push({ type: 'nbre-piece-min', value: nbrePieceMin });
            if (selectedVille) filters.push({ type: 'ville', value: selectedVille });
            if (selectedQuartier) filters.push({ type: 'quartier', value: selectedQuartier });
            if (selectedRegion) filters.push({ type: 'region', value: selectedRegion });

            // Si un seul filtre est sélectionné, utiliser l'API
            if (filters.length === 1) {
                const filter = filters[0];
                let endpoint = '';

                switch (filter.type) {
                    case 'categorie':
                        endpoint = `${API_BASE_URL}/search/categorie?categorie=${filter.value}`;
                        break;
                    case 'type-publication':
                        endpoint = `${API_BASE_URL}/search/type-publication?typePublication=${filter.value}`;
                        break;
                    case 'prix-max':
                        endpoint = `${API_BASE_URL}/search/prix-max?prixMax=${filter.value}`;
                        break;
                    case 'nbre-piece-min':
                        endpoint = `${API_BASE_URL}/search/nbre-piece-min?nbrePieceMin=${filter.value}`;
                        break;
                    case 'ville':
                        endpoint = `${API_BASE_URL}/search/ville?ville=${encodeURIComponent(filter.value.toUpperCase())}`;
                        break;
                    case 'quartier':
                        endpoint = `${API_BASE_URL}/search/quartier?quartier=${encodeURIComponent(filter.value)}`;
                        break;
                    case 'region':
                        endpoint = `${API_BASE_URL}/search/region?region=${encodeURIComponent(filter.value.toUpperCase())}`;
                        break;
                }

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const listingsData = Array.isArray(data) ? data : data.content || data.data || [];

                // Appliquer la recherche textuelle si nécessaire
                let results = listingsData;
                if (searchQuery) {
                    const queryLower = searchQuery.toLowerCase();
                    results = listingsData.filter(listing =>
                        (listing.titreBien && listing.titreBien.toLowerCase().includes(queryLower)) ||
                        (listing.quartier && listing.quartier.toLowerCase().includes(queryLower)) ||
                        (listing.description && listing.description.toLowerCase().includes(queryLower)) ||
                        (listing.ville && listing.ville.toLowerCase().includes(queryLower))
                    );
                }

                setFilteredListings(results);
            } else {
                // Si plusieurs filtres, faire la recherche côté client
                await performSearch();
            }

        } catch (err) {
            console.error('Erreur lors de la recherche API:', err);
            // En cas d'erreur, basculer vers la recherche côté client
            await performSearch();
        } finally {
            setIsSearching(false);
        }
    };

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedTypePublication('');
        setSelectedCategorie('');
        setSelectedVille('');
        setSelectedRegion('');
        setSelectedQuartier('');
        setPrixMax('');
        setNbrePieceMin('');
        setFilteredListings(allListings);
    };

    // Charger les annonces au démarrage
    useEffect(() => {
        fetchAllListings();
    }, []);

    // Appliquer la recherche lorsque les filtres changent
    useEffect(() => {
        if (!isLoading) {
            performSearch();
        }
    }, [
        selectedTypePublication,
        selectedCategorie,
        selectedVille,
        selectedRegion,
        selectedQuartier,
        prixMax,
        nbrePieceMin,
        searchQuery
    ]);

    // Gestion de l'ouverture/fermeture des détails
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

    const openWhatsApp = (phone) => {
        const cleanPhone = phone.replace(/\s/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    // Fonction pour formater la localisation
    const formatLocation = (listing) => {
        const parts = [];
        if (listing.quartier) parts.push(listing.quartier);
        if (listing.ville) parts.push(listing.ville);
        if (listing.region) parts.push(listing.region);
        return parts.join(', ') || 'Localisation non précisée';
    };

    // Rendu d'une carte de bien
    const renderListingCard = (listing) => {
        const price = listing.prix ? listing.prix.toLocaleString('fr-FR') + ' XAF' : 'N/A';
        const rooms = listing.nbrePiece || 0;
        const title = listing.titreBien || 'Bien Sans Titre';
        const location = formatLocation(listing);
        const firstImage = (listing.images && listing.images.length > 0)
            ? getImageUrl(listing.images[0])
            : "https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800";
        const typeLabel = listing.typePublication === 'VENTE' ? 'À vendre' : 'À louer';

        return (
            <div
                key={listing.id}
                onClick={() => openPropertyDetails(listing)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
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
                            <span className="text-sm font-normal text-gray-500">
                                {listing.typePublication === 'VENTE' ? '' : ' / mois'}
                            </span>
                        </p>
                        <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${listing.typePublication === 'VENTE'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                {typeLabel}
                            </span>
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

    // Rendu de la modal de détails
    const renderModal = () => {
        if (!selectedProperty) return null;

        const price = selectedProperty.prix ? selectedProperty.prix.toLocaleString('fr-FR') + ' XAF' : 'N/A';
        const rooms = selectedProperty.nbrePiece || 0;
        const title = selectedProperty.titreBien || 'Bien Sans Titre';
        const location = formatLocation(selectedProperty);
        const description = selectedProperty.description || 'Aucune description fournie.';
        const category = selectedProperty.categorie || 'Non spécifié';
        const typePublication = selectedProperty.typePublication || 'VENTE';
        const typeLabel = typePublication === 'VENTE' ? 'À vendre' : 'À louer';
        const currentImage = selectedProperty.images[currentImageIndex] ||
            "https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800";

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
                        {/* En-tête */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                                        {category}
                                    </span>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${typePublication === 'VENTE'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {typeLabel}
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
                                    {typePublication === 'VENTE' ? '' : 'par mois'}
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

                        {/* Contact */}
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Intéressé par ce bien ?</h3>
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-gray-700 mb-2">
                                        Contactez l'agence via WhatsApp pour plus d'informations ou une visite.
                                    </p>
                                    {/* Affichage du numéro de paiement */}
                                    <p className="text-gray-700 flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                                        <span className="font-semibold">Numéro de contact :</span>
                                        <span className="ml-2 font-mono">{selectedProperty.numeroPaiement || 'Non spécifié'}</span>
                                    </p>
                                </div>
                                {/* Bouton WhatsApp - Utilise le numéroPaiement de la propriété */}
                                <button
                                    onClick={() => openWhatsApp(selectedProperty.numeroPaiement)}
                                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!selectedProperty.numeroPaiement}
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

            <div className="p-5 md:p-10">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Découvrez <br />Votre Futur Bien
                    </h1>
                    <Bell className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900" />
                </div>

                {/* BARRE DE RECHERCHE */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par titre, ville, quartier ou description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                </div>

                {/* FILTRES PRINCIPAUX */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Filter className="w-5 h-5 mr-2 text-orange-500" />
                            Filtres de recherche
                        </h3>
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            {showAdvancedFilters ? 'Masquer' : 'Afficher'} les filtres avancés
                            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Filtres de base */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Type de publication */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type de publication
                            </label>
                            <select
                                value={selectedTypePublication}
                                onChange={(e) => setSelectedTypePublication(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                {TYPE_PUBLICATION_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Catégorie */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catégorie
                            </label>
                            <select
                                value={selectedCategorie}
                                onChange={(e) => setSelectedCategorie(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                {CATEGORIE_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ville (champ texte) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ville
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Yaoundé, Douala..."
                                value={selectedVille}
                                onChange={(e) => setSelectedVille(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        {/* Bouton de recherche alternative (API) */}
                        <div className="flex items-end">
                            <button
                                onClick={performApiSearch}
                                disabled={isSearching}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                                title="Recherche avec l'API (pour un seul filtre)"
                            >
                                {isSearching ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Recherche ...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4 mr-2" />
                                        Recherche
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Filtres avancés */}
                    {showAdvancedFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                            {/* Région (champ texte) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Région
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Centre, Littoral..."
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Quartier */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quartier
                                </label>
                                <input
                                    type="text"
                                    placeholder="Entrez un quartier..."
                                    value={selectedQuartier}
                                    onChange={(e) => setSelectedQuartier(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Prix maximum */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prix maximum (XAF)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ex: 50000"
                                    value={prixMax}
                                    onChange={(e) => setPrixMax(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Nombre de pièces minimum */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pièces minimum
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ex: 2"
                                    value={nbrePieceMin}
                                    onChange={(e) => setNbrePieceMin(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Réinitialiser
                        </button>
                        <button
                            onClick={performSearch}
                            disabled={isSearching}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            {isSearching ? 'Filtrage...' : 'Filtrer côté client'}
                        </button>
                    </div>
                </div>

                {/* RÉSULTATS */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {filteredListings.length > 0 ? 'Résultats de la recherche' : 'Aucun résultat'}
                    </h2>
                    <span className="text-sm text-gray-500">
                        {filteredListings.length} bien{filteredListings.length !== 1 ? 's' : ''} trouvé{filteredListings.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* État de chargement */}
                {isLoading && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                        <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                        <p className="text-lg text-gray-600">Chargement des annonces...</p>
                    </div>
                )}

                {/* Message d'erreur */}
                {error && !isLoading && (
                    <div className="text-center py-10 bg-red-50 border border-red-300 rounded-xl shadow-lg">
                        <div className="text-lg font-bold text-red-700 mb-2">Erreur</div>
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchAllListings}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Affichage des annonces */}
                {!isLoading && !error && filteredListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredListings.map(renderListingCard)}
                    </div>
                ) : !isLoading && !error && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun bien trouvé</h3>
                        <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche</p>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}

                {/* Modal de détails */}
                {renderModal()}
            </div>
        </div>
    );
};

export default Discovery;
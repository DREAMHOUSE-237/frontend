import React, { useState, useEffect } from 'react';
import { 
    Home, Trash2, Eye, Archive, RotateCcw, Filter, Search, DollarSign, Bed, Bath, LayoutList, AlertCircle, Loader2, User
} from 'lucide-react';

// --- NAVBAR ---
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

// --- Configuration API ---
const API_BASE_URL = '/api/biens';

// --- Composants Réutilisables ---

// Fonction pour obtenir le style en fonction du statut
const getStatusBadge = (status) => {
    switch (status) {
        case 'Active':
        case 'ACTIVE':
        case 'ACTIF':
            return 'bg-green-100 text-green-700';
        case 'En attente':
        case 'EN_ATTENTE':
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-700';
        case 'Archivée':
        case 'ARCHIVED':
        case 'ARCHIVEE':
        case 'ARCHIVE':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

// Fonction pour formater le statut pour l'affichage
const formatStatus = (status) => {
    const statusMap = {
        'ACTIF': 'Active',
        'ACTIVE': 'Active',
        'EN_ATTENTE': 'En attente',
        'PENDING': 'En attente',
        'ARCHIVE': 'Archivée',
        'ARCHIVED': 'Archivée',
        'ARCHIVEE': 'Archivée'
    };
    return statusMap[status] || status;
};

// Fonction pour formater la date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
};

// Fonction pour construire l'URL des images
const getImageUrl = (imageName) => {
    if (!imageName) {
        return "https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800";
    }
    
    if (imageName.startsWith('http')) {
        return imageName;
    }
    
    return `http://192.168.172.81:8079/DREAMHOUSE/uploads/${imageName}`;
};

// Composant de ligne de publication
const PublicationRow = ({ publication, onView, onDelete }) => {
    // Formater les données
    const title = publication.titreBien || publication.titre || 'Sans titre';
    const category = publication.categorie || 'N/A';
    const price = publication.prix ? `${publication.prix.toLocaleString('fr-FR')} FCFA` : 'N/A';
    const rooms = publication.nbrePiece || publication.nombrePieces || 0;
    const area = publication.superfie || publication.superficie || 0;
    const status = publication.statut || publication.status || 'ACTIF';
    const date = publication.datePublication || publication.date || '';
    const firstImage = publication.images && publication.images.length > 0 
        ? getImageUrl(publication.images[0])
        : null;

    return (
        <tr className="border-b hover:bg-gray-50 transition-colors">
            {/* Colonne 1: Titre, Catégorie et Image */}
            <td className="px-6 py-4">
                <div className="flex items-center">
                    {firstImage && (
                        <img 
                            src={firstImage} 
                            alt={title}
                            className="w-12 h-12 object-cover rounded-lg mr-4"
                            onError={(e) => { 
                                e.target.onerror = null; 
                                e.target.src = "https://images.unsplash.com/photo-1570129477492-f0b89d6e4c7d?w=800" 
                            }}
                        />
                    )}
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 truncate max-w-xs">{title}</span>
                        <span className="text-xs text-blue-600 font-medium mt-0.5">
                            {category}
                        </span>
                    </div>
                </div>
            </td>

            {/* Colonne 2: Prix */}
            <td className="px-6 py-4">
                <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-medium text-gray-800">{price}</span>
                </div>
            </td>
            
            {/* Colonne 3: Détails */}
            <td className="px-6 py-4 hidden md:table-cell">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                        <Bed className="w-4 h-4 mr-2" />
                        <span>{rooms} pièce{rooms > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <LayoutList className="w-4 h-4 mr-2" />
                        <span>{area} m²</span>
                    </div>
                </div>
            </td>

            {/* Colonne 4: Statut */}
            <td className="px-6 py-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(status)}`}>
                    {formatStatus(status)}
                </span>
            </td>

            {/* Colonne 5: Date */}
            <td className="px-6 py-4 hidden lg:table-cell">
                <div className="text-sm text-gray-500">
                    {formatDate(date)}
                </div>
            </td>

            {/* Colonne 6: Actions - Uniquement suppression */}
            <td className="px-6 py-4">
                <div className="flex justify-end">
                    <button
                        onClick={() => onDelete(publication.id || publication.bienId)}
                        className="p-2 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        title="Supprimer définitivement"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

// Composant de chargement
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Chargement de vos publications...</span>
    </div>
);

// Composant d'erreur
const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-6">
        <div className="flex items-center mb-3">
            <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
        </div>
        <p className="text-red-700 mb-4">{message}</p>
        <button
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
            Réessayer
        </button>
    </div>
);

// --- Composant Principal ---
export default function MesPublications() {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    // Récupérer les infos utilisateur
    useEffect(() => {
        const getUserInfo = () => {
            try {
                // Essayer depuis localStorage
                const userData = localStorage.getItem('user');
                if (userData) {
                    return JSON.parse(userData);
                }
                
                // Essayer depuis le token JWT
                const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        return {
                            id: payload.sub || payload.userId || payload.id,
                            email: payload.email,
                            username: payload.username || payload.name
                        };
                    } catch (e) {
                        console.log('Token non JWT ou invalide');
                    }
                }
            } catch (error) {
                console.error('Erreur parsing user info:', error);
            }
            return null;
        };
        
        const user = getUserInfo();
        setUserInfo(user);
    }, []);

    // Fonction pour récupérer les publications depuis l'API
    const fetchPublications = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: headers,
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Erreur ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorText;
                } catch {
                    errorMessage = errorText;
                }
                
                // Si 401/403, inviter à se connecter
                if (response.status === 401 || response.status === 403) {
                    errorMessage = `Authentification requise. Veuillez vous connecter.`;
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Adapter selon la structure de la réponse
            let publicationsData = [];
            
            if (Array.isArray(data)) {
                publicationsData = data;
            } else if (data.content) {
                publicationsData = data.content;
            } else if (data.data) {
                publicationsData = data.data;
            } else {
                publicationsData = Object.values(data);
            }
            
            // Filtrer par utilisateur connecté
            if (userInfo) {
                publicationsData = publicationsData.filter(pub => {
                    return pub.proprietaireId === userInfo.id || 
                           pub.utilisateurEmail === userInfo.email ||
                           !pub.proprietaireId;
                });
            }
            
            setPublications(publicationsData);
            
        } catch (err) {
            console.error('Erreur lors du chargement des publications:', err);
            
            if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
                setError(`
                    Problème de connexion au serveur. 
                    
                    Solutions:
                    1. Vérifiez que le serveur backend est démarré
                    2. Assurez-vous que le proxy Vite est configuré
                    3. Redémarrez le serveur de développement
                    4. Vérifiez votre connexion réseau
                    
                    Détails: ${err.message}
                `);
            } else {
                setError(`Erreur: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Charger les publications au montage
    useEffect(() => {
        fetchPublications();
    }, [userInfo]);

    // --- Fonctions de Gestion ---

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette publication ? Cette action est irréversible.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            const headers = {};
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: headers
            });

            if (response.ok) {
                fetchPublications();
                alert('Publication supprimée avec succès !');
            } else {
                throw new Error('Erreur lors de la suppression');
            }
        } catch (err) {
            console.error('Erreur:', err);
            alert(`Erreur: ${err.message}`);
        }
    };

    // Affichage en cas d'erreur
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar activePage="Mes Publications" />
                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        <ErrorMessage message={error} onRetry={fetchPublications} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar activePage="Mes Publications" />
            
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <LayoutList className="w-8 h-8 text-blue-600" />
                            Mes Publications
                        </h1>
                        
                        {/* Info utilisateur */}
                        {userInfo && (
                            <div className="flex items-center mt-2 text-gray-600">
                                <User className="w-4 h-4 mr-2" />
                                <span>Connecté en tant que: <strong>{userInfo.email || userInfo.username}</strong></span>
                            </div>
                        )}
                        
                        <p className="text-gray-600 mt-2">
                            Gérez l'ensemble de vos annonces immobilières publiées. 
                            <span className="ml-2 text-blue-600 font-medium">
                                ({publications.length} publication{publications.length > 1 ? 's' : ''})
                            </span>
                        </p>
                    </div>

                    {/* Tableau des Publications */}
                    <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                        {loading ? (
                            <LoadingSpinner />
                        ) : publications.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Publication
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Prix
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                            Détails
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {publications.map(pub => (
                                        <PublicationRow
                                            key={pub.id || pub.bienId || `pub-${Math.random()}`}
                                            publication={pub}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                <Archive className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg font-medium">Aucune publication trouvée</p>
                                <p className="text-sm mt-2">Vous n'avez pas encore publié d'annonce.</p>
                                <a
                                    href="/Publication"
                                    className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Publier une annonce
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
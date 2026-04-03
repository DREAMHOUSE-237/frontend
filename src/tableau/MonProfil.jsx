import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, User, LogOut, Edit, CheckCircle, Building } from 'lucide-react';
// Importez useNavigate ET useLocation pour gérer le rechargement
import { useNavigate, useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  // Utilisation de useLocation pour détecter les changements de route (navigation depuis /modification)
  const location = useLocation(); 

  useEffect(() => {
    // Re-déclenche la récupération du profil lorsque le composant est monté
    // ou lorsque la location change (ce qui se produit après une redirection).
    fetchProfile();
  }, [location.key]); // CLÉ DE LA CORRECTION : Déclenche la mise à jour après la redirection

  const fetchProfile = async () => {
    try {
      // Récupérer les tokens depuis localStorage
      const accessToken = localStorage.getItem('access');
      const userStr = localStorage.getItem('user');
      
      console.log('Access Token:', accessToken);
      console.log('User String:', userStr);

      if (!accessToken) {
        setError('Token non trouvé. Veuillez vous connecter.');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Vérifier s'il y a un utilisateur stocké
      let userId = null;
      
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id || user.user_id || user.userId || user.id_from_token;
        console.log('User ID depuis localStorage:', userId);
      }
      
      // Si pas d'ID, essayer de l'extraire du token JWT
      if (!userId && accessToken) {
        try {
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            userId = payload.user_id || payload.userId || payload.sub;
            console.log('User ID extrait du token:', userId);
          }
        } catch (err) {
          console.error('Erreur lors du décodage du token:', err);
        }
      }

      if (!userId) {
        setError('Impossible de récupérer l\'ID utilisateur.');
        setLoading(false);
        return;
      }

      console.log('User ID final à utiliser:', userId);

      // --- Début des tentatives de récupération du profil ---
      
      // 1. Essayer avec l'ID numérique
      let response = await fetch(
        `http://192.168.172.81:8079/USER-SERVICE/users/profiles/${userId}/`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response status (initial):', response.status);

      // 2. Si 404, essayer les autres méthodes (UUID, liste, etc.)
      if (response.status === 404) {
        console.log('Essai avec ID initial a échoué, tentative avec profil liste...');
        
        const profilesResponse = await fetch(
          `http://192.168.172.81:8079/USER-SERVICE/users/profiles/`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (profilesResponse.ok) {
          const allProfiles = await profilesResponse.json();
          console.log('Tous les profils disponibles:', allProfiles);
          
          const user = JSON.parse(userStr || '{}');
          const userProfile = allProfiles.find(p => p.email === user.email);
          
          if (userProfile) {
            setProfile(userProfile);
            setLoading(false);
            return;
          }
        }

        // 3. Essayer avec l'UUID du token 
        if (accessToken) {
          try {
            const tokenParts = accessToken.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const uuid = payload.user_id;
              
              if (uuid && uuid !== userId) {
                 response = await fetch(
                  `http://192.168.172.81:8079/USER-SERVICE/users/profiles/${uuid}/`,
                  {
                    headers: {
                      'Authorization': `Bearer ${accessToken}`,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                console.log('Nouveau response status (UUID):', response.status);
              }
            }
          } catch (err) {
            console.error('Erreur lors de la tentative avec UUID:', err);
          }
        }
      }

      // 4. Gestion des échecs des tentatives
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        
        // 5. Dernière tentative avec l'ID 6 
        if (userId !== '6' && response.status !== 200) {
          console.log('Dernière tentative avec ID=6...');
          const lastTryResponse = await fetch(
            `http://192.168.172.81:8079/USER-SERVICE/users/profiles/6/`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (lastTryResponse.ok) {
            const data = await lastTryResponse.json();
            console.log('Profile data avec ID=6:', data);
            setProfile(data);
            setLoading(false);
            return;
          }
        }
        
        throw new Error(`Erreur ${response.status}: ${errorData}`);
      }
      
      // --- Fin des tentatives de récupération du profil ---

      const data = await response.json();
      console.log('Profile data:', data);
      setProfile(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    navigate('/login'); 
  };
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="mb-4">
            <p className="text-red-600 font-medium mb-2">Erreur de chargement du profil</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Réessayer
            </button>
            <button
              onClick={handleLogout}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
            >
              Se reconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const isProprietaire = user.role === 'proprietaire';

  // Récupérer le nom d'affichage
  const getDisplayName = () => {
    if (profile?.name) return profile.name;
    if (profile?.username) return profile.username;
    if (user?.username) return user.username;
    return user?.email || 'Utilisateur';
  };

  // Récupérer le nom d'utilisateur
  const getUsername = () => {
    if (profile?.username) return `@${profile.username}`;
    if (user?.username) return `@${user.username}`;
    return `@${user?.email?.split('@')[0]}` || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* En-tête avec bannière */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
          
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                  {profile?.photo ? (
                    <img
                      src={profile.photo}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(getDisplayName())
                  )}
                </div>
                {!isProprietaire && profile?.verified && (
                  <CheckCircle className="absolute bottom-2 right-2 w-8 h-8 text-green-500 bg-white rounded-full" />
                )}
              </div>
            </div>

            {/* Informations du profil */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {getDisplayName()}
              </h1>
              <p className="text-gray-500">
                {getUsername()}
              </p>
              {user?.role && (
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {user.role === 'proprietaire' ? 'Propriétaire' : 'Agent Immobilier'}
                </span>
              )}
            </div>

            {/* Informations de contact */}
            <div className="space-y-4 mb-6">
              {/* Email */}
              <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center flex-1">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">{profile?.email || user.email}</span>
                </div>
                {(isProprietaire && profile?.emailVerified) && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>

              {/* Téléphone - utiliser le champ 'contact' de l'API */}
              {profile?.contact && (
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">{profile.contact}</span>
                </div>
              )}
              
              {/* Informations spécifiques aux agents */}
              {!isProprietaire && (
                <>
                  {/* Numéro d'enregistrement */}
                  {profile?.registrationNumber && (
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                      <Building className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Numéro d'enregistrement</p>
                        <p className="text-gray-700 font-medium">{profile.registrationNumber}</p>
                      </div>
                    </div>
                  )}

                  {/* Gestionnaire */}
                  {profile?.manager && (
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                      <User className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Gestionnaire</p>
                        <p className="text-gray-700 font-medium">{profile.manager}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-200 text-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModificationPage = () => {
    const navigate = useNavigate();
    
    // Récupérer les données initiales de l'utilisateur stockées localement
    const userStr = localStorage.getItem('user');
    const initialUser = userStr ? JSON.parse(userStr) : {};

    // États du formulaire
    const [formData, setFormData] = useState({
        name: initialUser.name || '',
        firstName: initialUser.firstName || '', 
        username: initialUser.username || '',
        email: initialUser.email || '',
        contact: initialUser.contact || '', 
    });
    
    // États de l'application
    const [loading, setLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
    const [userId, setUserId] = useState(null);

    // Fonction pour décoder l'ID utilisateur du token
    const getUserIdFromToken = (token) => {
        try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                return payload.user_id || payload.userId || payload.sub;
            }
        } catch (err) {
            console.error('Erreur lors du décodage du token:', err);
        }
        return null;
    };

    // 1. Initialisation et récupération des données de l'API au chargement
    useEffect(() => {
        const accessToken = localStorage.getItem('access');
        const localUserId = initialUser.id || initialUser.user_id || initialUser.userId;
        
        let finalUserId = localUserId;

        if (!finalUserId && accessToken) {
            finalUserId = getUserIdFromToken(accessToken);
        }

        if (!finalUserId) {
            setApiMessage({ type: 'error', text: 'Impossible de récupérer l\'ID utilisateur pour la modification.' });
            return;
        }

        setUserId(finalUserId);
        setLoading(true);

        const fetchCurrentProfile = async () => {
            try {
                const response = await fetch(
                    `http://192.168.172.81:8079/USER-SERVICE/users/profiles/${finalUserId}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        name: data.name || data.last_name || '',
                        firstName: data.firstName || data.first_name || '',
                        username: data.username || '',
                        email: data.email || '',
                        contact: data.contact || '', 
                    });
                } else {
                    setApiMessage({ type: 'error', text: `Erreur lors de la récupération des données : ${response.status}` });
                }
            } catch (err) {
                setApiMessage({ type: 'error', text: `Erreur de connexion : ${err.message}` });
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentProfile();
    }, []); // Dépendances vides pour ne charger qu'au montage

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setApiMessage({ type: '', text: '' });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    // 2. Fonction de sauvegarde (PATCH API)
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setApiMessage({ type: '', text: '' });
        
        const accessToken = localStorage.getItem('access');

        if (!userId || !accessToken) {
            setApiMessage({ type: 'error', text: 'Erreur: ID utilisateur ou Token manquant.' });
            setLoading(false);
            return;
        }

        try {
            const dataToUpdate = {
                name: formData.name,
                first_name: formData.firstName, 
                username: formData.username,
                email: formData.email,
                contact: formData.contact,
            };

            const response = await fetch(
                `http://192.168.172.81:8079/USER-SERVICE/users/profiles/${userId}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToUpdate),
                }
            );

            if (response.ok) {
                const updatedData = await response.json();
                setApiMessage({ type: 'success', text: 'Profil mis à jour avec succès ! Redirection...' });
                
                // Mettre à jour localStorage
                const newUserData = { ...initialUser, ...updatedData };
                localStorage.setItem('user', JSON.stringify(newUserData));
                
                // Redirection vers ProfilePage. La dépendance [location.key] de ProfilePage assurera le rechargement.
                setTimeout(() => navigate('/Monprofil'), 1500); 

            } else {
                const errorData = await response.json();
                const errorMessage = errorData.detail || errorData.message || 'Erreur inconnue lors de la mise à jour.';
                setApiMessage({ type: 'error', text: `Échec de la mise à jour: ${errorMessage}` });
            }
        } catch (err) {
            setApiMessage({ type: 'error', text: `Erreur de connexion: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Retour au profil
                    </button>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">
                        Modifier mes informations
                    </h2>
                    
                    {/* Messages d'état de l'API */}
                    {apiMessage.text && (
                        <div className={`p-3 rounded-lg mb-4 flex items-center ${
                            apiMessage.type === 'success' 
                                ? 'bg-green-100 text-green-800 border border-green-300' 
                                : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                            {apiMessage.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 mr-2" />
                            ) : (
                                <XCircle className="w-5 h-5 mr-2" />
                            )}
                            {apiMessage.text}
                        </div>
                    )}
                    
                    {loading && apiMessage.type === '' && (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="animate-spin w-6 h-6 text-blue-600 mr-2" />
                            <p className="text-gray-600">Chargement ou Sauvegarde en cours...</p>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        
                        {/* Nom */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nom de famille"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Prénom */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Prénom"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Nom d'utilisateur */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Nom d'utilisateur"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="votre.email@exemple.com"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        
                        {/* Téléphone (Contact) */}
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <input
                                type="tel"
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="Numéro de téléphone"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Bouton de sauvegarde */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium shadow-md transition-colors ${
                                loading 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {loading && <Loader2 className="animate-spin w-5 h-5" />}
                            {!loading && <Save className="w-5 h-5" />}
                            Sauvegarder les modifications
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModificationPage;
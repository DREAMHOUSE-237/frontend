import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Edit, LogOut, CheckCircle } from 'lucide-react';

const UserProfile = () => {
    const [userData, setUserData] = useState({
        name: 'Jean Kamdem',
        username: '@jeankamdem',
        email: 'jean.kamdem@email.com',
        emailVerified: true,
        phone: '+237 6 77 88 99 00',
        location: 'Douala, Cameroon',
        initials: 'JK'
    });

    // Simuler le chargement des données depuis l'API
    useEffect(() => {
        // fetchUserProfile();
    }, []);

    const handleEdit = () => {
        console.log('Modifier le profil');
        // Rediriger vers la page d'édition
        // window.location.href = '/profil/edit';
    };

    const handleLogout = () => {
        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            window.location.href = '/login';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Carte principale du profil */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    
                    {/* En-tête avec avatar */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-12 text-center">
                        {/* Avatar avec initiales */}
                        <div className="flex justify-center mb-6">
                            <div className="w-40 h-40 bg-blue-600 rounded-full flex items-center justify-center shadow-xl">
                                <span className="text-6xl font-bold text-white">
                                    {userData.initials}
                                </span>
                            </div>
                        </div>

                        {/* Nom de l'utilisateur */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {userData.name}
                        </h1>

                        {/* Username */}
                        <p className="text-lg text-gray-500">
                            {userData.username}
                        </p>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t border-gray-200"></div>

                    {/* Informations détaillées */}
                    <div className="px-8 py-8 space-y-6">
                        
                        {/* Email */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Mail size={24} className="text-gray-600" />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                                <a 
                                    href={`mailto:${userData.email}`}
                                    className="text-base text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    {userData.email}
                                </a>
                                {userData.emailVerified && (
                                    <CheckCircle size={20} className="text-blue-500 flex-shrink-0" />
                                )}
                            </div>
                        </div>

                        {/* Téléphone */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Phone size={24} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <a 
                                    href={`tel:${userData.phone}`}
                                    className="text-base text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    {userData.phone}
                                </a>
                            </div>
                        </div>

                        {/* Localisation */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <MapPin size={24} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-base text-gray-700">
                                    {userData.location}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t border-gray-200"></div>

                    {/* Boutons d'action */}
                    <div className="px-8 py-6 space-y-3">
                        {/* Bouton Modifier */}
                        <button
                            onClick={handleEdit}
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 hover:border-gray-300"
                        >
                            <Edit size={20} />
                            <span>Modifier le profil</span>
                        </button>

                        {/* Bouton Déconnexion */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-white hover:bg-red-50 text-red-600 font-semibold py-4 px-6 rounded-xl border-2 border-red-200 transition-all duration-200 flex items-center justify-center space-x-2 hover:border-red-300"
                        >
                            <LogOut size={20} />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>

                {/* Bouton retour (optionnel) */}
                <div className="text-center mt-6">
                    <a 
                        href="/dashboard"
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        ← Retour au tableau de bord
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
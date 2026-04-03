import React, { useState, useEffect } from 'react';
import { Home, FileText, User, Mail, Phone, MapPin, Edit, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate

const AgencyProfile = () => {
    const navigate = useNavigate(); // Initialisation de useNavigate
    
    const [agencyData, setAgencyData] = useState({
        name: 'DreamHouse Realty',
        username: '@dreamhouse_realty',
        verified: true,
        registrationNumber: 'RC/DLA/2023/B/1234',
        fullRegistration: 'RC/DLA/2023/B/1234',
        manager: 'Marie Fotso',
        email: 'contact@dreamhouse.com',
        phone: '+237 6 99 88 77 66',
        address: 'Bonamoussadi, Douala',
        logo: null
    });

    const [isEditing, setIsEditing] = useState(false);

    // Simuler le chargement des données depuis l'API
    useEffect(() => {
        // fetchAgencyProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        // Rediriger vers la page d'édition ou ouvrir une modale
        console.log('Modifier le profil');
    };
    
    const handleLogout = () => {
        // Logique de déconnexion (suppression du token, nettoyage de la session, etc.)
        console.log("Déconnexion de l'agence...");
        // Redirection simulée vers la page de connexion
        navigate('/login'); 
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Carte principale du profil */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    
                    {/* En-tête avec logo */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-12 text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                                <Home size={64} className="text-white" strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Nom de l'agence */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {agencyData.name}
                        </h1>

                        {/* Username */}
                        <p className="text-lg text-gray-500 mb-4">
                            {agencyData.username}
                        </p>

                        {/* Badge vérifié */}
                        {agencyData.verified && (
                            <div className="inline-block">
                                <span className="px-6 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                                    Agence Vérifiée
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Séparateur */}
                    <div className="border-t border-gray-200"></div>

                    {/* Informations détaillées */}
                    <div className="px-8 py-8 space-y-6">
                        
                        {/* Numéro RC */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText size={24} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                    RC/DLA/2023/B/1234:
                                </p>
                                <p className="text-base text-gray-700">
                                    {agencyData.fullRegistration}
                                </p>
                            </div>
                        </div>

                        {/* PDG */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <User size={24} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                    PDG:
                                </p>
                                <p className="text-base text-gray-700">
                                    {agencyData.manager}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Mail size={24} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <a 
                                    href={`mailto:${agencyData.email}`}
                                    className="text-base text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    {agencyData.email}
                                </a>
                            </div>
                        </div>

                        {/* Téléphone */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Phone size={24} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <a 
                                    href={`tel:${agencyData.phone}`}
                                    className="text-base text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    {agencyData.phone}
                                </a>
                            </div>
                        </div>

                        {/* Adresse */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <MapPin size={24} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-base text-gray-700">
                                    {agencyData.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t border-gray-200"></div>

                    {/* Boutons d'Action (Modifier et Déconnexion) */}
                    <div className="px-8 py-6 space-y-4">
                        {/* Bouton Modifier */}
                        <button
                            onClick={handleEdit}
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 hover:border-gray-300"
                        >
                            <Edit size={20} />
                            <span>Modifier le profil</span>
                        </button>

                        {/* Bouton Déconnexion (Nouveau) */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-white text-red-600 font-semibold py-4 px-6 rounded-xl border-2 border-red-100 hover:bg-red-50 transition-all duration-200 flex items-center justify-center space-x-2"
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

export default AgencyProfile;
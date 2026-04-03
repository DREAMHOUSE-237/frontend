import React, { useState } from 'react';
import { Mail, Lock, User, Upload, ArrowLeft, Phone } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    // Reste sur l'onglet 'inscription' pour la démonstration
    const [activeTab, setActiveTab] = useState('inscription'); 
    
    // État principal du formulaire
    const [formData, setFormData] = useState({
        accountType: 'Propriétaire', // Correspond à l'image
        email: '',
        password: '',
        telephone: '',
        // Champs Propriétaire
        nom: '',
        prenom: '',
        username: '',
        // Champs Agence Immobilière
        nomAgence: '',
        localisation: '',
        numeroIdentification: '',
        nomPDG: '',
        // État des fichiers (pour Propriétaire)
        cniRecto: null,
        cniVerso: null,
    });

    // Types de compte basés sur les images fournies
    const accountOptions = ['Propriétaire', 'Agent Immobilier'];

    // Fonction générique pour mettre à jour l'état du formulaire
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (files) {
             setFormData(prev => ({
                ...prev,
                [name]: files[0], // Stocke l'objet File
            }));
        } else {
             setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Gérer la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Soumission de l'onglet: ${activeTab}`);
        console.log("Données soumises:", formData);
        
        // Logique d'appel API ici...
        // Note: Pour les fichiers, vous devrez utiliser FormData pour l'envoi d'API
    };

    // --- Composants de Champ Réutilisables ---

    const InputField = ({ label, name, type = "text", placeholder, icon: Icon, required = true }) => (
        <>
            <label className="block text-sm font-medium text-gray-700 pt-1">
                {label}
            </label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />}
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-600 focus:border-red-600"
                    value={formData[name] || ''}
                    onChange={handleChange}
                    required={required}
                />
            </div>
        </>
    );

    const FileUploadField = ({ label, name }) => {
        const fileName = formData[name] ? formData[name].name : label;
        return (
            <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-600 transition duration-150">
                <input
                    type="file"
                    name={name}
                    id={name}
                    className="hidden"
                    onChange={handleChange}
                    required
                />
                <label htmlFor={name} className="flex flex-col items-center cursor-pointer text-center">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className={`mt-1 text-xs font-medium ${formData[name] ? 'text-green-600' : 'text-gray-600'}`}>
                        {fileName}
                    </span>
                </label>
            </div>
        );
    };
    
    // --- Rendu des champs d'inscription spécifiques ---

    const renderRegistrationFields = () => {
        // Le type de compte est toujours 'Propriétaire' ou 'Agent Immobilier' ici.
        if (formData.accountType === 'Propriétaire') {
            return (
                <>
                    {/* Ligne Nom / Prénom */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Nom" name="nom" placeholder="Nom" />
                        <InputField label="Prénom" name="prenom" placeholder="Prénom" />
                    </div>
                    
                    <InputField label="Nom d'utilisateur" name="username" placeholder="username" />
                    
                    {/* Documents d'identité */}
                    <label className="block text-sm font-medium text-gray-700 pt-1">
                        Documents d'identité (CNI)
                    </label>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <FileUploadField label="Télécharger CNI Recto" name="cniRecto" />
                        <FileUploadField label="Télécharger CNI Verso" name="cniVerso" />
                    </div>
                </>
            );
        }
        
        if (formData.accountType === 'Agent Immobilier') {
            return (
                <>
                    <InputField label="Nom de l'agence" name="nomAgence" placeholder="DreamHouse Realty" />
                    <InputField label="Localisation" name="localisation" placeholder="Douala, Cameroun" />
                    <InputField label="Numéro d'identification" name="numeroIdentification" placeholder="RC/DLA/2023/B/1234" />
                    <InputField label="Nom du PDG" name="nomPDG" placeholder="Nom du dirigeant" />
                </>
            );
        }

        return null;
    };

    // --- Rendu complet du formulaire ---

    const renderFormContent = () => {
        if (activeTab === 'connexion') {
            return (
                <>
                    {/* Le champ Type de Compte est toujours là */}
                    <InputField label="Email" name="email" type="email" placeholder="votre@email.com" icon={Mail} />
                    <InputField label="Mot de passe" name="password" type="password" placeholder="••••••••" icon={Lock} />
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-lg text-base hover:bg-red-700 transition duration-200 shadow-md mt-4"
                    >
                        Se connecter
                    </button>
                </>
            );
        }

        // --- Champs Inscription ---
        return (
            <>
                {/* Champs Spécifiques au Type de Compte */}
                {renderRegistrationFields()}

                {/* Champs Communs à l'inscription (Email et Téléphone) */}
                <InputField label="Email" name="email" type="email" placeholder="votre@email.com" icon={Mail} />
                <InputField 
                    label="Téléphone" 
                    name="telephone" 
                    type="tel" 
                    placeholder="+237 6 XX XX XX XX" 
                    icon={Phone}
                />

                <InputField label="Mot de passe" name="password" type="password" placeholder="••••••••" icon={Lock} />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-base hover:bg-blue-700 transition duration-200 shadow-md mt-4"
                >
                    S'inscrire
                </button>
            </>
        );
    };


    return (
        // CONTENEUR PRINCIPAL AVEC FOND D'ÉCRAN
        <div className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
            <div 
                className="absolute inset-0 bg-cover bg-top" 
                style={{ 
                    backgroundImage: `url('/public/s2.png')`, // Chemin de votre image de fond
                    filter: 'brightness(0.7)' 
                }}
            ></div>

            {/* CARTE DU FORMULAIRE */}
            <div className="bg-white rounded-3xl p-6 z-10 shadow-2xl w-full max-w-sm mx-4 max-h-[95vh] overflow-y-auto"> 
                
                {/* EN-TÊTE ET TITRES */}
                <div className="flex items-center mb-4">
                    <ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer mr-2" />
                    <div className="flex-1 flex justify-center items-center -ml-7">
                        <span className="text-2xl mr-1 text-red-600">🏠</span>
                        <h1 className="text-2xl font-bold text-gray-800">DreamHouse</h1>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-1 text-center">Bienvenue</h2>
                <p className="text-sm text-gray-500 mb-5 text-center">
                    Connectez-vous ou créez un compte
                </p>

                {/* --- CONTRÔLE DES ONGLETS (Connexion / Inscription) --- */}
                <div className="flex p-1 bg-gray-100 rounded-lg mb-5">
                    <button
                        onClick={() => setActiveTab('connexion')}
                        className={`flex-1 py-1.5 text-base rounded-lg font-medium transition duration-200 ${
                            activeTab === 'connexion' 
                                ? 'bg-white shadow text-gray-800' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Connexion
                    </button>
                    <button
                        onClick={() => setActiveTab('inscription')}
                        className={`flex-1 py-1.5 text-base rounded-lg font-medium transition duration-200 ${
                            activeTab === 'inscription' 
                                ? 'bg-white shadow text-gray-800' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Inscription
                    </button>
                </div>


                <form onSubmit={handleSubmit} className="space-y-3">
                    
                    {/* TYPE DE COMPTE (Toujours visible) */}
                    <label className="block text-sm font-medium text-gray-700">
                        Type de compte
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-600 focus:border-red-600 appearance-none bg-white"
                            required
                        >
                            {accountOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                            ▼
                        </span>
                    </div>

                    {/* Rendu Conditionnel du Reste du Formulaire */}
                    {renderFormContent()}
                </form>

            </div>
        </div>
    );
};

export default RegisterPage;
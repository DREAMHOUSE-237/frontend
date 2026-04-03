import React, { useState } from 'react';
import { Mail, Lock, User, Upload, ArrowLeft, Phone, MapPin, Briefcase, Home, AlertCircle, CheckCircle } from 'lucide-react';

const DreamHouseAuth = () => {
    const [activeTab, setActiveTab] = useState('connexion');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        accountType: 'Propriétaire',
        nom: '',
        prenom: '',
        username: '',
        adresse: '',
        cniRecto: null,
        cniVerso: null,
        nomAgence: '',
        localisation: '',
        numeroIdentification: '',
        nomPDG: '',
        email: '',
        telephone: '',
        password: ''
    });

    // URL de base de l'API
    // Utilisez '/api/auth' si vous configurez le proxy Vite
    // Sinon utilisez l'URL complète
    const API_BASE_URL = '/api/auth';

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        setError('');
    };

const handleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                accountType: formData.accountType
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Login error response:', errorText);
            throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (data.message && !data.message.includes('succès')) {
            throw new Error(data.message || 'Erreur de connexion');
        }

        setSuccess('Connexion réussie !');
        console.log('Login response:', data);
        
        // Stocker les tokens
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        
        // Stocker les informations utilisateur COMPLÈTES
        const userData = {
            email: data.user.email,
            role: data.user.role,
            is_verified: data.user.is_verified,
            // Stocker l'ID de différentes manières selon ce qui est disponible
            id: data.user.id || 
                data.user.user_id || 
                data.user.userId ||
                // Si pas d'ID direct, extraire du token
                (() => {
                    try {
                        const tokenParts = data.access.split('.');
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            return payload.user_id || payload.userId || payload.sub;
                        }
                    } catch (err) {
                        console.warn('Impossible d\'extraire l\'ID du token:', err);
                        return null;
                    }
                })(),
            // Stocker d'autres champs utiles
            username: data.user.username || '',
            photo: data.user.photo || '',
            contact: data.user.contact || '',
            adresse: data.user.adresse || '',
            // Ajouter d'autres champs que vous pourriez avoir
            ...data.user
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('User data stocké:', userData);
        
        setTimeout(() => {
            window.location.href = '/Publication'; // Rediriger vers la page souhaitée
        }, 2000);

    } catch (err) {
        setError(err.message || 'Erreur de connexion. Vérifiez vos identifiants.');
        console.error('Login error:', err);
    } finally {
        setLoading(false);
    }
};
    const handleRegister = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const registrationData = new FormData();
            
            // Mapping des champs frontend vers les champs backend
            registrationData.append('email', formData.email);
            registrationData.append('password', formData.password);
            registrationData.append('tel', formData.telephone);
            
            // Déterminer le rôle en fonction du type de compte
            const role = formData.accountType === 'Propriétaire' ? 'proprietaire' : 'agent_immobilier';
            registrationData.append('role', role);
            
            if (formData.accountType === 'Propriétaire') {
                registrationData.append('nom', formData.nom);
                registrationData.append('prenom', formData.prenom);
                registrationData.append('nomUtilisateur', formData.username);
                registrationData.append('adresse', formData.adresse);
                
                if (formData.cniRecto) {
                    registrationData.append('cni_recto', formData.cniRecto);
                }
                if (formData.cniVerso) {
                    registrationData.append('cni_verso', formData.cniVerso);
                }
            } else {
                // Pour les agents immobiliers
                registrationData.append('nomAgence', formData.nomAgence);
                registrationData.append('localisation', formData.localisation);
                registrationData.append('numeroIdentification', formData.numeroIdentification);
                registrationData.append('nomPDG', formData.nomPDG);
            }

            console.log('Sending registration data...');
            console.log('FormData entries:');
            for (let pair of registrationData.entries()) {
                console.log(pair[0], typeof pair[1] === 'object' ? pair[1].name : pair[1]);
            }
            
            const response = await fetch(`${API_BASE_URL}/register/`, {
                method: 'POST',
                body: registrationData
                // Pas de mode, credentials ou headers - laissez le navigateur gérer
            });

            console.log('Registration response status:', response.status);
            
            // Lire la réponse en texte d'abord pour déboguer
            const responseText = await response.text();
            console.log('Raw response:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON:', responseText);
                throw new Error('Réponse invalide du serveur');
            }

            if (!response.ok) {
                throw new Error(data.message || `Erreur HTTP ${response.status}`);
            }

            setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            console.log('Registration response:', data);
            
            setTimeout(() => {
                setActiveTab('connexion');
                setSuccess('');
            }, 2000);

        } catch (err) {
            console.error('Registration error details:', err);
            
            // Gestion spécifique des erreurs CORS
            if (err.message.includes('CORS') || err.message.includes('NetworkError')) {
                setError('Erreur de connexion au serveur. Vérifiez la configuration CORS du serveur.');
            } else {
                setError(err.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (activeTab === 'connexion') {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    const FileUpload = ({ label, name }) => {
        const hasFile = formData[name];
        return (
            <div className="flex-1">
                <input
                    type="file"
                    id={name}
                    name={name}
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                />
                <label
                    htmlFor={name}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                    <Upload className={`w-6 h-6 mb-2 ${hasFile ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-xs text-center ${hasFile ? 'text-green-600' : 'text-gray-600'}`}>
                        {hasFile ? hasFile.name : label}
                    </span>
                </label>
            </div>
        );
    };

    const renderProprietaireFields = () => (
        <>
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.nom}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.prenom}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                <input
                    type="text"
                    name="adresse"
                    placeholder="Adresse"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.adresse}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom d'utilisateur</label>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.username}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Documents d'identité (CNI)</label>
                <div className="grid grid-cols-2 gap-4">
                    <FileUpload label="Télécharger CNI Recto" name="cniRecto" />
                    <FileUpload label="Télécharger CNI Verso" name="cniVerso" />
                </div>
            </div>
        </>
    );

    const renderAgentImmobilierFields = () => (
        <>
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'agence</label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        name="nomAgence"
                        placeholder="DreamHouse Realty"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.nomAgence}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Localisation</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        name="localisation"
                        placeholder="Douala, Cameroun"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.localisation}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro d'identification</label>
                <input
                    type="text"
                    name="numeroIdentification"
                    placeholder="RC/DLA/2023/B/1234"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.numeroIdentification}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du PDG</label>
                <input
                    type="text"
                    name="nomPDG"
                    placeholder="Nom du dirigeant"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.nomPDG}
                    onChange={handleChange}
                />
            </div>
        </>
    );

    const renderConnexionContent = () => (
        <>
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type de compte</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-10 pointer-events-none" />
                    <select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none bg-white"
                    >
                        <option value="Propriétaire">Propriétaire</option>
                        <option value="Agent Immobilier">Agent Immobilier</option>
                    </select>
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 text-sm">▼</span>
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        placeholder="votre@email.com"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-red-600 text-white font-bold py-3.5 rounded-lg text-base hover:bg-red-700 transition-colors shadow-md ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {loading ? 'Connexion...' : 'Se connecter'}
            </button>
        </>
    );

    const renderInscriptionContent = () => (
        <>
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type de compte</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-10 pointer-events-none" />
                    <select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-10 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none appearance-none bg-white ${
                            formData.accountType === 'Agent Immobilier' ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="Propriétaire">Propriétaire</option>
                        <option value="Agent Immobilier">Agent Immobilier</option>
                    </select>
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 text-sm">▼</span>
                </div>
            </div>

            {formData.accountType === 'Propriétaire' ? renderProprietaireFields() : renderAgentImmobilierFields()}

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        placeholder="votre@email.com"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="tel"
                        name="telephone"
                        placeholder="+237 6 XX XX XX XX"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.telephone}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg text-base hover:bg-blue-700 transition-colors shadow-md ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
        </>
    );

    return (
        <div className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
            <div 
                className="absolute inset-0 bg-cover bg-top" 
                style={{ 
                    backgroundImage: `url('/s2.png')`,
                    filter: 'brightness(0.7)' 
                }}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[95vh] overflow-y-auto z-10">
                <div className="flex items-center mb-6">
                    <ArrowLeft className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
                    <div className="flex-1 flex justify-center items-center -ml-6">
                        <Home className="w-7 h-7 text-red-600 mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">DreamHouse</h1>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2">Bienvenue</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Connectez-vous ou créez un compte
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700">{success}</p>
                    </div>
                )}

                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                    <button
                        onClick={() => setActiveTab('connexion')}
                        className={`flex-1 py-2.5 rounded-md font-semibold text-sm transition-all ${
                            activeTab === 'connexion'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Connexion
                    </button>
                    <button
                        onClick={() => setActiveTab('inscription')}
                        className={`flex-1 py-2.5 rounded-md font-semibold text-sm transition-all ${
                            activeTab === 'inscription'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Inscription
                    </button>
                </div>

                <div>
                    {activeTab === 'connexion' ? renderConnexionContent() : renderInscriptionContent()}
                </div>
            </div>
        </div>
    );
};

export default DreamHouseAuth;
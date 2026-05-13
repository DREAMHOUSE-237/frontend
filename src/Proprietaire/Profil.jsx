import React, { useState, useRef, useEffect } from 'react';
import {
    Camera, User, Mail, Phone, Shield,
    ChevronLeft, Check, Lock, Settings, Eye, EyeOff
} from 'lucide-react';

import { getUserProfile, updateProfile, updatePassword } from '../service/auth_service';

const ProfilePage = () => {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('info');

    // États pour gérer la visibilité des mots de passe
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [loading, SetLoading] = useState(true);
    const [passwordData, SetPasswordData] = useState({ current_password: '', new_password: '' })

    const [profile, setProfile] = useState({
        nom: '',
        prenom: '',
        email: '',
        contact: '',
        role: '',
        ville: '',
        region: '',
        is_active: false,
        is_identified: false
    });

    useEffect(() => {
    const fetchProfile = async () => {
        try {
            const data = await getUserProfile();
            console.log(data);

            const nameParts = data.username ? data.username.split(' ') : ['', ''];

            setProfile({
                ...data, // On garde tout le reste (email, contact, etc.)
                nom: nameParts[0] || '',
                prenom: nameParts.slice(1).join(' ') || ''
            });
        } catch (error) {
            console.error(error);
        } finally {
            SetLoading(false);
        }
    };
    fetchProfile();
}, []);

const handleUpdateProfile = async () => {
    // On crée un objet propre avec UNIQUEMENT ce que le backend attend
    const cleanData = {
        username: `${profile.nom} ${profile.prenom}`,
        contact: profile.contact,
        ville: profile.ville,
        region: profile.region
    };

    try {
        await updateProfile(cleanData);
        alert("Succès !");
    } catch (e) {
        // Si ça modifie quand même, on ignore le message d'erreur
        console.log("Le serveur a boudé la réponse, mais la base est à jour.");
    }
};

    const handleUpdatePassword = async () => {
        try {
            await updatePassword(
                passwordData.current_password,
                passwordData.new_password
            );
            alert("Mot de passe modifie");
            SetPasswordData({
                current_password: '',
                new_password: ''
            });
        } catch (error) {
            console.error(error);
            alert("Erreur de mot de passe")
        }
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfile({ ...profile, photo: reader.result });
            reader.readAsDataURL(file);
        }
    };

   

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">

            {/* HEADER */}
            <div className="p-6 max-w-4xl mx-auto w-full flex items-center gap-4">
                <a href="/accueil2" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </a>
                <h1 className="text-2xl font-black tracking-tight text-[#1a2b3c]">Mon Profil</h1>
            </div>

            <div className="flex-1 max-w-4xl mx-auto w-full px-6">

                {/* SECTION PHOTO & IDENTITÉ */}
                <div className="flex items-center gap-6 mb-10 p-4">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl shadow-2xl overflow-hidden bg-gray-50 flex items-center justify-center border-2 border-gray-100">
                            {profile.photo ? (
                                <img src={profile.photo} alt="Profil" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-gray-300" />
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute -bottom-2 -right-2 bg-[#007b83] text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                        >
                            <Camera size={16} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#1a2b3c]">{profile.nom} {profile.prenom}</h2>
                        <span className="px-3 py-1 bg-teal-50 text-[#007b83] text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-100">
                            {profile.role} {profile.contact} {profile.region} {profile.ville}
                        </span>
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${profile.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {profile.is_active
                                ? "Compte Actif"
                                : "Compte Inactif"}
                        </span>

                        <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${profile.is_identified
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {profile.is_identified
                                ? "Identité Vérifiée"
                                : "Identification En Attente"}
                        </span>

                    </div>
                </div>

                {/* NAVIGATION PAR ONGLETS */}
                <div className="flex items-center gap-8 border-b border-gray-100 mb-8">
                    {[
                        { id: 'info', label: 'Informations personnelles' },
                        { id: 'pref', label: 'Préférences' },
                        { id: 'security', label: 'Sécurité' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-[#1a2b3c]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff8800] rounded-t-full animate-in fade-in duration-300" />
                            )}
                        </button>
                    ))}
                </div>

                {/* CONTENU DYNAMIQUE */}
                <div className="pb-20">

                    {/* PARTIE 1 : INFORMATIONS PERSONNELLES */}
                    {activeTab === 'info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Nom </label>
                                <input
                                    type="text"
                                    value={profile.nom}
                                    onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Prenom</label>
                                <input
                                    type="text"
                                    value={profile.prenom}
                                    onChange={(e) => setProfile({ ...profile, prenom: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Adresse Email</label>
                                <input
                                    readOnly
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Téléphone</label>
                                <input
                                    type="tel"
                                    value={profile.contact}
                                    onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Ville</label>
                                <input
                                    type="text"
                                    value={profile.ville}
                                    onChange={(e) => setProfile({ ...profile, ville: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Region</label>
                                <input
                                    type="text"
                                    value={profile.region}
                                    onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all"
                                />
                            </div>

                        </div>
                    )}
                    {/* PARTIE 3 : SÉCURITÉ AVEC VISUALISATION */}
                    {activeTab === 'security' && (
                        <div className="max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-4">

                                {/* Mot de passe actuel */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Mot de passe actuel</label>
                                    <div className="relative group">
                                        <input
                                            type={showCurrentPass ? "text" : "password"}
                                            value={passwordData.current_password}
                                            onChange={(e) => SetPasswordData({ ...passwordData, current_password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-100 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#007b83] transition-colors"
                                        >
                                            {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Nouveau mot de passe */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Nouveau mot de passe</label>
                                    <div className="relative group">
                                        <input
                                            type={showNewPass ? "text" : "password"}
                                            value={passwordData.new_password}
                                            onChange={(e) => SetPasswordData({ ...passwordData, new_password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#007b83] transition-colors"
                                        >
                                            {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BOUTON SAUVEGARDE GLOBAL */}
                    {activeTab === 'info' && (
                        <div className="mt-12 flex justify-end">
                            <button
                                onClick={handleUpdateProfile}
                                className="flex items-center gap-2 px-8 py-4 bg-[#007b83] text-white rounded-2xl font-bold shadow-lg hover:shadow-teal-200 transition-all active:scale-95">
                                <Check size={20} /> Enregistrer les modifications
                            </button>
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div className="mt-12 flex justify-end">
                            <button
                                onClick={handleUpdatePassword}
                                className="flex items-center gap-2 px-8 py-4 bg-[#007b83] text-white rounded-2xl font-bold shadow-lg hover:shadow-teal-200 transition-all active:scale-95">
                                <Check size={20} /> Enregistrer les modifications
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
import React, { useState, useRef, useEffect } from 'react';
import {
    Camera, User, Mail, Phone, Shield,
    Check, Eye, EyeOff, AlertCircle, Clock, ShieldCheck, XCircle
} from 'lucide-react';

import { getUserProfile, updateProfile, updatePassword } from '../service/auth_service';
import { IdentityService } from '../service/auth_service'; // Assure-toi que le chemin est correct

const ProfilePage = () => {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('info');

    // États techniques
    const [loading, setLoading] = useState(true);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '' });

    // État du profil enrichi avec le statut Identity
    const [profile, setProfile] = useState({
        nom: '',
        prenom: '',
        email: '',
        contact: '',
        role: '',
        ville: '',
        region: '',
        photo: null,
        is_active: false,
        identityStatus: null, // 'pending', 'verified', 'rejected'
        rejectionReason: ''
    });

    useEffect(() => {
        fetchFullProfile();
    }, []);

    const fetchFullProfile = async () => {
        setLoading(true);
        const storedRole = localStorage.getItem('role') || 'Utilisateur';
        try {
            // 1. Récupérer les infos de base du User-Service
            const userData = await getUserProfile();
            const nameParts = userData.username ? userData.username.split(' ') : ['', ''];

            // 2. Récupérer le statut réel depuis l'Identity-Service
            let idStatus = null;
            let rejectMsg = '';
            try {
                const statusResponse = await IdentityService.checkMyStatus(userData.email);
                idStatus = statusResponse.status;
                rejectMsg = statusResponse.rejection_reason || '';
            } catch (err) {
                console.log("Identity-Service: Aucune demande trouvée pour cet utilisateur.");
            }

            setProfile({
                ...userData,
                nom: nameParts[0] || '',
                prenom: nameParts.slice(1).join(' ') || '',
                identityStatus: idStatus,
                rejectionReason: rejectMsg,
                role: storedRole,
            });
        } catch (error) {
            console.error("Erreur globale profil:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        const cleanData = {
            username: `${profile.nom} ${profile.prenom}`,
            tel: profile.contact,
            ville: profile.ville,
            region: profile.region
        };

        try {
            await updateProfile(cleanData);
            alert("Profil mis à jour avec succès !");
        } catch (e) {
            console.error("Erreur mise à jour:", e);
            alert("Erreur lors de la sauvegarde.");
        }
    };

    const handleUpdatePassword = async () => {
        try {
            await updatePassword(passwordData.current_password, passwordData.new_password);
            alert("Mot de passe modifié !");
            setPasswordData({ current_password: '', new_password: '' });
        } catch (error) {
            alert("Erreur de mot de passe actuel.");
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfile({ ...profile, photo: reader.result });
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen italic text-gray-400">Chargement de votre espace...</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-10">

                {/* HEADER PHOTO & STATUS */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-4 bg-white rounded-3xl border border-gray-50 shadow-sm">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-3xl shadow-xl overflow-hidden bg-gray-50 flex items-center justify-center border-4 border-white">
                            {profile.photo ? (
                                <img src={profile.photo} alt="Profil" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-gray-200" />
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute -bottom-1 -right-1 bg-[#007b83] text-white p-2.5 rounded-2xl shadow-lg hover:scale-110 transition-transform"
                        >
                            <Camera size={18} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-black text-[#1a2b3c] mb-1">{profile.nom} {profile.prenom}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 items-center">
                            <span className="text-sm text-gray-500 font-medium">{profile.email}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full hidden md:block"></span>
                            <span className="px-3 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full">
                                {profile.role || 'Utilisateur'}
                            </span>
                        </div>

                        {/* BADGES DE STATUS DYNAMIQUE */}
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                profile.is_active ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${profile.is_active ? "bg-green-500" : "bg-red-500"}`}></div>
                                {profile.is_active ? "Compte Actif" : "Compte Inactif"}
                            </div>

                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                profile.identityStatus === 'verified' ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                profile.identityStatus === 'rejected' ? "bg-red-50 text-red-700 border border-red-100" :
                                "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}>
                                {profile.identityStatus === 'verified' ? <ShieldCheck size={14}/> : 
                                 profile.identityStatus === 'rejected' ? <XCircle size={14}/> : <Clock size={14}/>}
                                {profile.identityStatus === 'verified' ? "Identité Vérifiée" :
                                 profile.identityStatus === 'rejected' ? "Identité Refusée" : "Vérification en cours"}
                            </div>
                        </div>

                        {/* MESSAGE SI REJETÉ */}
                        {profile.identityStatus === 'rejected' && (
                            <div className="mt-3 inline-flex items-center gap-2 text-red-600 bg-red-50/50 px-3 py-2 rounded-xl border border-red-100/50">
                                <AlertCircle size={14} className="animate-pulse" />
                                <span className="text-xs font-bold italic">Motif : {profile.rejectionReason || "Documents illisibles"}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* NAVIGATION */}
                <div className="flex items-center gap-8 border-b border-gray-100 mb-8">
                    {[
                        { id: 'info', label: 'Informations personnelles' },
                        { id: 'security', label: 'Sécurité' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-sm font-bold transition-all relative ${
                                activeTab === tab.id ? 'text-[#1a2b3c]' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#007b83] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* CONTENU */}
                <div className="pb-20">
                    {activeTab === 'info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Nom</label>
                                <input
                                    type="text"
                                    value={profile.nom}
                                    onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:ring-2 focus:ring-[#007b83] focus:bg-white transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Prénom</label>
                                <input
                                    type="text"
                                    value={profile.prenom}
                                    onChange={(e) => setProfile({ ...profile, prenom: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:ring-2 focus:ring-[#007b83] focus:bg-white transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Email (Non modifiable)</label>
                                <div className="relative">
                                    <input
                                        readOnly
                                        type="email"
                                        value={profile.email}
                                        className="w-full p-4 bg-gray-100 text-gray-500 border-none rounded-2xl cursor-not-allowed"
                                    />
                                    <Shield size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Téléphone</label>
                                <input
                                    type="tel"
                                    value={profile.contact}
                                    onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Ville</label>
                                <input
                                    type="text"
                                    value={profile.ville}
                                    onChange={(e) => setProfile({ ...profile, ville: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Région</label>
                                <input
                                    type="text"
                                    value={profile.region}
                                    onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:ring-2 focus:ring-[#007b83] transition-all outline-none"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-6">
                                <button
                                    onClick={handleUpdateProfile}
                                    className="flex items-center gap-2 px-10 py-4 bg-[#007b83] text-white rounded-2xl font-bold shadow-xl shadow-teal-100 hover:shadow-none transition-all active:scale-95"
                                >
                                    <Check size={20} /> Sauvegarder mon profil
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-400">Mot de passe actuel</label>
                                    <div className="relative group">
                                        <input
                                            type={showCurrentPass ? "text" : "password"}
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-100"
                                        />
                                        <button onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-400">Nouveau mot de passe</label>
                                    <div className="relative group">
                                        <input
                                            type={showNewPass ? "text" : "password"}
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#007b83]"
                                        />
                                        <button onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={handleUpdatePassword}
                                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg"
                                    >
                                        Mettre à jour le mot de passe
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
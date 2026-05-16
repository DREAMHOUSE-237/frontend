import React, { useState, useRef, useEffect } from 'react';
import {
    Camera, User, Mail, Phone, Shield, Upload,
    Check, Eye, EyeOff, AlertCircle, Clock, ShieldCheck, XCircle, X
} from 'lucide-react';

import { getUserProfile, updateProfile, updatePassword, submitIdentity } from '../service/auth_service';
import { IdentityService } from '../service/auth_service';

const ProfilePage = () => {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('info');

    // États techniques
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '' });

    // État pour la modale CNI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cniRecto, setCniRecto] = useState(null);
    const [cniVerso, setCniVerso] = useState(null);

    // État du profil enrichi
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
        identityStatus: null, // null/'none', 'pending', 'verified', 'rejected'
        rejectionReason: ''
    });

    // Vérification stricte si le rôle nécessite et est éligible aux CNI
    const isEligibleForIdentity = ['proprietaire', 'agence', 'agent'].includes(profile.role?.toLowerCase());

    useEffect(() => {
        fetchFullProfile();
    }, []);

    const fetchFullProfile = async () => {
        setLoading(true);
        const storedRole = localStorage.getItem('role') || 'Utilisateur';
        try {
            const userData = await getUserProfile();
            const nameParts = userData.username ? userData.username.split(' ') : ['', ''];

            let idStatus = null;
            let rejectMsg = '';

            // On ne check le statut d'identité que si le rôle local requiert une vérification
            if (['proprietaire', 'agence', 'agent'].includes(storedRole.toLowerCase())) {
                try {
                    const statusResponse = await IdentityService.checkMyStatus(userData.email);
                    idStatus = statusResponse.status;
                    rejectMsg = statusResponse.rejection_reason || '';
                } catch (err) {
                    console.log("Identity-Service: Aucun dossier d'identité trouvé pour ce profil.");
                    idStatus = 'none';
                }
            }

            setProfile({
                ...userData,
                nom: nameParts[0] || '',
                prenom: nameParts.slice(1).join(' ') || '',
                identityStatus: idStatus,
                rejectionReason: rejectMsg,
                role: storedRole,
                contact: userData.tel || userData.contact || ''
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

    const handleCniSubmit = async (e) => {
        e.preventDefault();
        if (!cniRecto || !cniVerso) {
            alert("Veuillez fournir les deux fichiers (Recto et Verso).");
            return;
        }

        try {
            setSubmitLoading(true);
            await submitIdentity(profile.email, profile.role.toLowerCase(), cniRecto, cniVerso);
            alert("Documents d'identité téléversés avec succès !");
            setIsModalOpen(false);
            fetchFullProfile();
        } catch (err) {
            alert(err.message || "Erreur lors du téléversement");
        } finally {
            setSubmitLoading(false);
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
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900">
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-10">

                {/* HEADER PHOTO & STATUS */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
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
                            <span className="px-3 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full tracking-wider">
                                {profile.role || 'Utilisateur'}
                            </span>
                        </div>

                        {/* GRILLE DE STATUS CONDITIONNELLE */}
                        {/* GRILLE DE STATUS CONDITIONNELLE */}
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">

                            {/* 1. Affichage pour le CLIENT : Uniquement le statut du compte utilisateur */}
                            {profile.role?.toLowerCase() === 'client' ? (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white border text-green-700 border-green-200">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    Compte Actif
                                </div>
                            ) : (
                                /* 2. Affichage pour PROPRIÉTAIRE et AGENCE : Statut de compte + Statut de vérification d'identité */
                                <>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white border ${profile.is_active ? "text-green-700 border-green-200" : "text-red-700 border-red-200"
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${profile.is_active ? "bg-green-500" : "bg-red-500"}`}></div>
                                        {profile.is_active ? "Compte Actif" : "Compte Inactif"}
                                    </div>

                                    {profile.identityStatus && profile.identityStatus !== 'none' && (
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white border ${profile.identityStatus === 'verified' ? "text-blue-700 border-blue-200" :
                                            profile.identityStatus === 'rejected' ? "text-red-700 border-red-200" :
                                                "text-amber-700 border-amber-200"
                                            }`}>
                                            {profile.identityStatus === 'verified' ? <ShieldCheck size={14} /> :
                                                profile.identityStatus === 'rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                                            {profile.identityStatus === 'verified' ? "Identité Vérifiée" :
                                                profile.identityStatus === 'rejected' ? "Identité Refusée" : "Vérification en cours"}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Bouton d'action d'envoi CNI : Strictement réservé aux partenaires non vérifiés */}
                            {isEligibleForIdentity && (!profile.identityStatus || profile.identityStatus === 'none') && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
                                >
                                    <Upload size={12} /> Soumettre ma CNI
                                </button>
                            )}
                        </div>

                        {/* Bloc Message de Rejet : Masqué pour les clients */}
                        {isEligibleForIdentity && profile.identityStatus === 'rejected' && (
                            <div className="mt-4 flex flex-col md:flex-row gap-3 items-center md:items-start animate-in fade-in duration-300">
                                <div className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                                    <AlertCircle size={14} />
                                    <span className="text-xs font-bold italic">Motif du rejet : {profile.rejectionReason || "Documents illisibles"}</span>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-black transition-colors"
                                >
                                    Nouvelle tentative
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="flex items-center gap-8 border-b border-gray-200/60 mb-8">
                    {[
                        { id: 'info', label: 'Informations personnelles' },
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
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#007b83] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* FORM PANEL */}
                <div className="pb-20">
                    {activeTab === 'info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Nom</label>
                                <input
                                    type="text"
                                    value={profile.nom}
                                    onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                                    className="w-full p-4 bg-gray-50 focus:bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#007b83]/20 transition-all outline-none font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Prénom</label>
                                <input
                                    type="text"
                                    value={profile.prenom}
                                    onChange={(e) => setProfile({ ...profile, prenom: e.target.value })}
                                    className="w-full p-4 bg-gray-50 focus:bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#007b83]/20 transition-all outline-none font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Email (Verrouillé)</label>
                                <div className="relative">
                                    <input
                                        readOnly
                                        type="email"
                                        value={profile.email}
                                        className="w-full p-4 bg-gray-100 text-gray-400 border border-transparent rounded-2xl cursor-not-allowed font-medium"
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
                                    className="w-full p-4 bg-gray-50 focus:bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#007b83]/20 transition-all outline-none font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Ville</label>
                                <input
                                    type="text"
                                    value={profile.ville}
                                    onChange={(e) => setProfile({ ...profile, ville: e.target.value })}
                                    className="w-full p-4 bg-gray-50 focus:bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#007b83]/20 transition-all outline-none font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Région</label>
                                <input
                                    type="text"
                                    value={profile.region}
                                    onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                                    className="w-full p-4 bg-gray-50 focus:bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#007b83]/20 transition-all outline-none font-medium"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button
                                    onClick={handleUpdateProfile}
                                    className="flex items-center gap-2 px-8 py-4 bg-[#007b83] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:bg-[#00666d] transition-all"
                                >
                                    <Check size={16} /> Enregistrer les modifications
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="max-w-md bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-400 ml-1">Mot de passe actuel</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPass ? "text" : "password"}
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#007b83]/20 outline-none font-medium"
                                        />
                                        <button onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-400 ml-1">Nouveau mot de passe</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPass ? "text" : "password"}
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#007b83]/20 outline-none font-medium"
                                        />
                                        <button onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={handleUpdatePassword}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-black transition-colors shadow-md"
                                    >
                                        Mettre à jour le mot de passe
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* LA MODALE : S'affiche uniquement pour les rôles éligibles si ouverte */}
            {isModalOpen && isEligibleForIdentity && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Vérification de sécurité</h3>
                                <p className="text-xs text-gray-400">Fournissez les scans nets de votre CNI d'origine</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200/60 rounded-full transition-colors text-gray-400 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCniSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* RECTO BOX */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CNI — Face Recto</label>
                                    <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 transition-colors cursor-pointer overflow-hidden">
                                        <input
                                            type="file" accept="image/*" required
                                            onChange={(e) => setCniRecto(e.target.files[0])}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        {cniRecto ? (
                                            <img src={URL.createObjectURL(cniRecto)} alt="Recto Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="text-gray-300 mb-1" size={24} />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Choisir le Recto</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* VERSO BOX */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CNI — Face Verso</label>
                                    <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 transition-colors cursor-pointer overflow-hidden">
                                        <input
                                            type="file" accept="image/*" required
                                            onChange={(e) => setCniVerso(e.target.files[0])}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        {cniVerso ? (
                                            <img src={URL.createObjectURL(cniVerso)} alt="Verso Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="text-gray-300 mb-1" size={24} />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Choisir le Verso</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full py-4 bg-[#007b83] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00666d] transition-all disabled:opacity-50"
                            >
                                {submitLoading ? "Téléversement et traitement..." : "Lancer la vérification"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
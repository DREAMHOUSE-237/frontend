import React, { useState, useRef, useEffect } from 'react';
import {
    Camera, User, Mail, Phone, Shield, Upload,
    Check, AlertCircle, Clock, ShieldCheck, XCircle, X
} from 'lucide-react';

import { getUserProfile } from '../service/auth_service';
import { IdentityService } from '../service/auth_service';

const ProfilePage = () => {
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    
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
        identityStatus: null, 
        rejectionReason: ''
    });

    // On normalise la vérification du rôle (qu'il soit pending_proprietaire ou proprietaire, il est éligible à l'identité)
    const isEligibleForIdentity = ['proprietaire', 'agence', 'agent', 'pending_proprietaire', 'pending_agence'].some(
        r => profile.role?.toLowerCase()?.includes(r)
    );

    useEffect(() => {
        fetchFullProfile();
    }, []);

    const fetchFullProfile = async () => {
        setLoading(true);
        try {
            // 1. Récupérer les infos en temps réel depuis le USER-SERVICE
            const userData = await getUserProfile();
            const nameParts = userData.username ? userData.username.split(' ') : ['', ''];
            
            // On extrait le rôle renvoyé par l'API 
            const currentRole = userData.role || localStorage.getItem('role') || 'Utilisateur';

            let idStatus = null;
            let rejectMsg = '';

            // 2. On vérifie le statut d'identité si le rôle requiert une validation
            if (['proprietaire', 'agence', 'agent', 'pending_proprietaire', 'pending_agence'].some(r => currentRole.toLowerCase().includes(r))) {
                try {
                    const statusResponse = await IdentityService.checkMyStatus(userData.email);
                    idStatus = statusResponse.status; 
                    rejectMsg = statusResponse.rejection_reason || '';
                    
                    //  Si l'identité est validée côté Identity-Service, on met à jour localement 
                    if (statusResponse.status === 'verified') {
                        userData.is_active = true; 
                    }
                } catch (err) {
                    console.log("Identity-Service: Aucun dossier trouvé.");
                    idStatus = 'none';
                }
            }

            // Mettre à jour le localStorage pour les autres composants de l'application
            localStorage.setItem('role', currentRole);

            setProfile({
                ...userData,
                nom: nameParts[0] || '',
                prenom: nameParts.slice(1).join(' ') || '',
                identityStatus: idStatus,
                rejectionReason: rejectMsg,
                role: currentRole,
                contact: userData.tel || userData.contact || ''
            });
        } catch (error) {
            console.error("Erreur globale profil:", error);
        } finally {
            fetchPhotoChange();
        }
    };

    // Ajustement de la fin du chargement
    const fetchPhotoChange = () => {
        setLoading(false);
    };

    const handleCniSubmit = async (e) => {
        e.preventDefault();
        if (!cniRecto || !cniVerso) {
            alert("Veuillez fournir les deux fichiers (Recto et Verso).");
            return;
        }

        try {
            setSubmitLoading(true);
            const identityData = new FormData();
            identityData.append('email', profile.email);
            identityData.append('requested_role', profile.role.toLowerCase().replace('pending_', ''));
            if (cniRecto) identityData.append('cni_recto', cniRecto);
            if (cniVerso) identityData.append('cni_verso', cniVerso);

            await IdentityService.registerWithIdentity(identityData);
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

    // Formatage propre du rôle pour l'affichage 
    const formatDisplayRole = (role) => {
        if (!role) return 'Utilisateur';
        const r = role.toUpperCase();
        if (r.startsWith('PENDING_')) {
            return `${r.replace('PENDING_', '')}`;
        }
        return r;
    };

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
                                {formatDisplayRole(profile.role)}
                            </span>
                        </div>

                        {/* GRILLE DE STATUS CONDITIONNELLE HARMONISÉE */}
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">

                            {profile.role?.toLowerCase() === 'client' ? (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white border text-green-700 border-green-200">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    Compte Actif
                                </div>
                            ) : (
                                <>
                                    {/* Compte Actif/Inactif basé sur is_active global ou statut d'identité */}
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white border ${
                                        profile.is_active || profile.identityStatus === 'verified' ? "text-green-700 border-green-200" : "text-red-700 border-red-200"
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${profile.is_active || profile.identityStatus === 'verified' ? "bg-green-500" : "bg-red-500"}`}></div>
                                        {profile.is_active || profile.identityStatus === 'verified' ? "Compte Actif" : "Compte Inactif"}
                                    </div>

                                    {/* Badge Identity lié à l'Identity-Service ou au préfixe PENDING */}
                                    {profile.identityStatus && (
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white border ${
                                            profile.identityStatus === 'verified' ? "text-blue-700 border-blue-200" :
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

                            {/* Bouton d'action de soumission CNI */}
                            {isEligibleForIdentity && (!profile.identityStatus || profile.identityStatus === 'none') && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
                                >
                                    <Upload size={12} /> Soumettre ma CNI
                                </button>
                            )}
                        </div>

                        {/* Bloc Message de Rejet */}
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

                {/* FORM PANEL (AFFICHAGE DIRECT DES INFORMATIONS SANS SÉCURITÉ NI BOUTON) */}
                <div className="pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Nom</label>
                            <input
                                readOnly
                                type="text"
                                value={profile.nom}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium cursor-default text-gray-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Prénom</label>
                            <input
                                readOnly
                                type="text"
                                value={profile.prenom}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium cursor-default text-gray-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Email</label>
                            <div className="relative">
                                <input
                                    readOnly
                                    type="email"
                                    value={profile.email}
                                    className="w-full p-4 bg-gray-50 text-gray-600 border border-gray-100 rounded-2xl cursor-default font-medium"
                                />
                                <Shield size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Téléphone</label>
                            <input
                                readOnly
                                type="tel"
                                value={profile.contact}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium cursor-default text-gray-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Ville</label>
                            <input
                                readOnly
                                type="text"
                                value={profile.ville}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium cursor-default text-gray-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400 ml-2">Région</label>
                            <input
                                readOnly
                                type="text"
                                value={profile.region}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium cursor-default text-gray-600"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE CNI */}
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
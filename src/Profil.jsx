import React, { useState, useRef } from 'react';
import {
    Camera, User, Mail, Phone, Shield,
    ChevronLeft, Check, LogOut
} from 'lucide-react';

const ProfilePage = () => {
    const fileInputRef = useRef(null);


    const [profile, setProfile] = useState({
        nom: "Junior Kieran",
        email: "junior.kieran@example.com",
        telephone: "+237 600 000 000",
        typeCompte: "bailleur",
        photo: null
    });

    const [isSaving, setIsSaving] = useState(false);

    // Gestion du changement de photo
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulation d'enregistrement
        setTimeout(() => {
            setIsSaving(false);
            alert("Profil mis à jour avec succès !");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10 p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <a href="/">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                    </a>

                    <h1 className="text-lg font-bold">Mon Profil</h1>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <LogOut size={22} />
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-8">

                {/* Section Photo de Profil */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                            {profile.photo ? (
                                <img src={profile.photo} alt="Profil" className="w-full h-full object-cover" />
                            ) : (
                                <User size={60} className="text-gray-300" />
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-0 right-0 bg-[#007b83] text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white"
                        >
                            <Camera size={18} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold">{profile.nom}</h2>
                        <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">{profile.typeCompte}</p>
                    </div>
                </div>

                {/* Formulaire */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Nom complet */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                <User size={16} className="text-[#007b83]" /> Nom complet
                            </label>
                            <input
                                type="text"
                                value={profile.nom}
                                onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83] focus:ring-4 focus:ring-teal-50 transition-all"
                            />
                        </div>

                        {/* Type de compte (SELECT) */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                <Shield size={16} className="text-[#ff8800]" /> Type de compte
                            </label>
                            <select
                                value={profile.typeCompte}
                                onChange={(e) => setProfile({ ...profile, typeCompte: e.target.value })}
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83] appearance-none cursor-pointer font-medium"
                            >
                                <option value="client">Client (Cherche un bien)</option>
                                <option value="bailleur">Bailleur (Propriétaire)</option>
                                <option value="agent">Agent Immobilier</option>
                            </select>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                <Mail size={16} className="text-[#007b83]" /> Adresse Email
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83]"
                            />
                        </div>

                        {/* Téléphone */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                <Phone size={16} className="text-[#007b83]" /> Téléphone
                            </label>
                            <input
                                type="tel"
                                value={profile.telephone}
                                onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#007b83]"
                            />
                        </div>

                    </div>

                    {/* Bouton Enregistrer */}
                    <div className="pt-6">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isSaving ? 'bg-gray-400' : 'bg-[#007b83] hover:bg-[#00666d] active:scale-[0.98]'
                                }`}
                        >
                            {isSaving ? (
                                "Enregistrement..."
                            ) : (
                                <>
                                    <Check size={20} /> ENREGISTRER LES MODIFICATIONS
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
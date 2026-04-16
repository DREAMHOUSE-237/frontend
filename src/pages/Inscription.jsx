import React, { useState } from 'react';
import {
    User, Mail, Lock, Phone, MapPin, Building2,
    FileText, Upload, Briefcase, ChevronLeft, X, Eye, EyeOff
} from 'lucide-react';

const Inscription = () => {
    const [accountType, setAccountType] = useState('Propriétaire');
     const [showPassword, setShowPassword] = useState(false);
        const [formData, setFormData] = useState({
            email: '',
            password: ''
        });
    // États pour stocker les fichiers CNI
    const [cniRecto, setCniRecto] = useState(null);
    const [cniVerso, setCniVerso] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

                {/* En-tête */}
                <div className="text-center">
                    <a href="/">
                        <button className="flex items-center text-gray-400 hover:text-[#007b83] transition-colors mb-4 text-sm font-medium">
                            <ChevronLeft size={18} /> Retour
                        </button>
                    </a>

                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-[#007b83] rounded-full flex items-center justify-center text-white text-xs font-bold">D</div>
                        <div className="text-xl font-bold tracking-tight">
                            <span className="text-[#007b83]">Dream</span>
                            <span className="text-[#ff8800] ml-1">House</span>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Bienvenue</h2>
                    <p className="text-sm text-gray-500 mt-1">Créez votre compte et explorez le monde de l'Immobilier</p>
                </div>

                <form className="mt-8 space-y-5">
                    {/* Sélection Type de Compte */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase ml-1">Type de compte</label>
                        <div className="relative">
                            <select
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-[#007b83] outline-none text-sm cursor-pointer pl-10"
                            >
                                <option value="Propriétaire">Propriétaire</option>
                                <option value="Agent Immobilier">Agent Immobilier</option>
                            </select>
                            <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* Champs Dynamiques */}
                    {accountType === 'Propriétaire' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup icon={<User size={18} />} placeholder="Nom" />
                                <InputGroup icon={<User size={18} />} placeholder="Prénom" />
                            </div>
                            <InputGroup icon={<MapPin size={18} />} placeholder="Adresse" />
                        </>
                    ) : (
                        <>
                            <InputGroup icon={<Building2 size={18} />} placeholder="Nom de l'agence" />
                            <InputGroup icon={<MapPin size={18} />} placeholder="Localisation (Douala, Cameroun)" />
                            <InputGroup icon={<FileText size={18} />} placeholder="Numéro d'identification (RC/...)" />
                            <InputGroup icon={<User size={18} />} placeholder="Nom du PDG" />
                        </>
                    )}

                    <InputGroup icon={<User size={18} />} placeholder="Username" />

                    {/* Section CNI avec Importation d'images */}
                    {accountType === 'Propriétaire' && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase ml-1">Documents d'identité (CNI)</label>
                            <div className="grid grid-cols-2 gap-3">
                                <UploadBox 
                                    label="CNI Recto" 
                                    file={cniRecto} 
                                    setFile={setCniRecto} 
                                />
                                <UploadBox 
                                    label="CNI Verso" 
                                    file={cniVerso} 
                                    setFile={setCniVerso} 
                                />
                            </div>
                        </div>
                    )}

                    <InputGroup icon={<Mail size={18} />} type="email" placeholder="votre@email.com" />
                    <InputGroup icon={<Phone size={18} />} type="tel" placeholder="+237 6 XX XX XX XX" />
                     <InputGroup
                        icon={<Lock size={18} />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-[#007b83] transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                    />


                    <button type="submit" className="w-full py-4 bg-[#007b83] text-white rounded-xl font-bold hover:bg-[#00666d] transition-all shadow-lg shadow-blue-200 mt-4">
                        S'inscrire
                    </button>
                </form>
                <a href="/connexion">
                    <p className="text-center text-sm text-gray-400 mt-8 font-medium">
                        Vous avez deja un Compte ? <span className="text-[#007b83] font-bold cursor-pointer hover:underline">Connectez-vous</span>
                    </p>
                </a>
            </div>
        </div>
    );
};

// Sous-composant pour les champs de saisie
const InputGroup = ({ icon, type = "text", placeholder, name, value, onChange, rightElement }) => (
    <div className="relative">
        <div className="absolute left-3 top-3.5 text-gray-400">{icon}</div>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007b83] outline-none text-sm pl-11 transition-all"
        />
        {rightElement && (
            <div className="absolute right-3 top-3.5">
                {rightElement}
            </div>
        )}
    </div>
);

// Sous-composant pour les zones d'upload avec aperçu
const UploadBox = ({ label, file, setFile }) => {
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Créer une URL pour l'aperçu
            setFile(Object.assign(selectedFile, {
                preview: URL.createObjectURL(selectedFile)
            }));
        }
    };

    const removeFile = (e) => {
        e.preventDefault();
        setFile(null);
    };

    return (
        <div className="relative h-28">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id={`upload-${label}`}
            />
            
            {!file ? (
                <label
                    htmlFor={`upload-${label}`}
                    className="h-full border-2 border-dashed border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-[#007b83] hover:bg-teal-50 transition-all bg-gray-50"
                >
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 text-center uppercase leading-tight">
                        {label}
                    </span>
                </label>
            ) : (
                <div className="relative h-full w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                    <img 
                        src={file.preview} 
                        alt="Aperçu" 
                        className="h-full w-full object-cover" 
                    />
                    <button 
                        onClick={removeFile}
                        className="absolute top-1 right-1 bg-[#007b83] text-white rounded-full p-1 hover:bg-[#00666d] transition-colors"
                    >
                        <X size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1">
                        <p className="text-[8px] text-white text-center truncate px-1">{file.name}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inscription;
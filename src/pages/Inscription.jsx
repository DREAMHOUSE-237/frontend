import React, { useState } from 'react';
import { 
    User, Mail, Lock, Phone, MapPin, Building2, 
    FileText, Upload, Briefcase, X, Eye, EyeOff 
} from 'lucide-react';

const Inscription = () => {
    const [accountType, setAccountType] = useState('Propriétaire');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nom: '', prenom: '', adresse: '', nomAgence: '', 
        numIdentification: '', nomPdg: '', username: '', 
        email: '', telephone: '', password: ''
    });

    // États pour les fichiers CNI
    const [cniRecto, setCniRecto] = useState(null);
    const [cniVerso, setCniVerso] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Préparation des données pour le backend (FormData est nécessaire pour les fichiers)
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('accountType', accountType);
        if (cniRecto) data.append('cniRecto', cniRecto);
        if (cniVerso) data.append('cniVerso', cniVerso);

        console.log("Données prêtes pour l'API Backend :", data);
    };

    return (
        <form className="mt-8 space-y-5 animate-in slide-in-from-bottom-4 duration-500" onSubmit={handleRegister}>
            
            {/* Sélection Type de Compte */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase ml-1">Type de compte</label>
                <div className="relative group">
                    <Briefcase className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#007b83] transition-colors" size={18} />
                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl appearance-none focus:ring-2 focus:ring-[#007b83] outline-none text-sm cursor-pointer pl-11 transition-all"
                    >
                        <option value="Propriétaire">Propriétaire</option>
                        <option value="Agent Immobilier">Agent Immobilier</option>
                    </select>
                </div>
            </div>

            {/* Champs Dynamiques selon Type de Compte */}
            {accountType === 'Propriétaire' ? (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup icon={<User size={18} />} placeholder="Nom" name="nom" value={formData.nom} onChange={handleInputChange} />
                        <InputGroup icon={<User size={18} />} placeholder="Prénom" name="prenom" value={formData.prenom} onChange={handleInputChange} />
                    </div>
                    <InputGroup icon={<MapPin size={18} />} placeholder="Adresse" name="adresse" value={formData.adresse} onChange={handleInputChange} />
                    
                    {/* Section CNI */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600 uppercase ml-1">Documents d'identité (CNI)</label>
                        <div className="grid grid-cols-2 gap-3">
                            <UploadBox label="CNI Recto" file={cniRecto} setFile={setCniRecto} />
                            <UploadBox label="CNI Verso" file={cniVerso} setFile={setCniVerso} />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <InputGroup icon={<Building2 size={18} />} placeholder="Nom de l'agence" name="nomAgence" value={formData.nomAgence} onChange={handleInputChange} />
                    <InputGroup icon={<MapPin size={18} />} placeholder="Localisation (Douala, Cameroun)" name="adresse" value={formData.adresse} onChange={handleInputChange} />
                    <InputGroup icon={<FileText size={18} />} placeholder="Numéro d'identification (RC/...)" name="numIdentification" value={formData.numIdentification} onChange={handleInputChange} />
                    <InputGroup icon={<User size={18} />} placeholder="Nom du PDG" name="nomPdg" value={formData.nomPdg} onChange={handleInputChange} />
                </>
            )}

            <InputGroup icon={<User size={18} />} placeholder="Username" name="username" value={formData.username} onChange={handleInputChange} />
            <InputGroup icon={<Mail size={18} />} type="email" placeholder="votre@email.com" name="email" value={formData.email} onChange={handleInputChange} />
            <InputGroup icon={<Phone size={18} />} type="tel" placeholder="+237 6 XX XX XX XX" name="telephone" value={formData.telephone} onChange={handleInputChange} />
            
            <InputGroup
                icon={<Lock size={18} />}
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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

            <button type="submit" className="w-full py-4 bg-[#007b83] text-white rounded-xl font-bold hover:bg-[#00666d] transition-all shadow-lg shadow-teal-100 mt-4 active:scale-[0.98]">
                S'inscrire
            </button>
        </form>
    );
};

// Sous-composants internes (pour la propreté du code)
const InputGroup = ({ icon, type = "text", placeholder, name, value, onChange, rightElement }) => (
    <div className="relative group">
        <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#007b83] transition-colors">{icon}</div>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#007b83] focus:bg-white outline-none text-sm pl-11 transition-all placeholder:text-gray-300"
        />
        {rightElement && <div className="absolute right-3 top-3.5">{rightElement}</div>}
    </div>
);

const UploadBox = ({ label, file, setFile }) => {
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
        }
    };

    return (
        <div className="relative h-28">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={`upload-${label}`} />
            {!file ? (
                <label htmlFor={`upload-${label}`} className="h-full border-2 border-dashed border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-[#007b83] hover:bg-teal-50 transition-all bg-gray-50">
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
                </label>
            ) : (
                <div className="relative h-full w-full rounded-xl overflow-hidden border border-gray-200">
                    <img src={file.preview} alt="Aperçu" className="h-full w-full object-cover" />
                    <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="absolute top-1 right-1 bg-[#007b83] text-white rounded-full p-1 hover:bg-red-500">
                        <X size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Inscription;
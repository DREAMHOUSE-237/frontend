import React, { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Upload, Briefcase, X, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { registerUser, IdentityService } from '../service/auth_service';
import { useNavigate } from 'react-router-dom';

const Inscription = () => {
    const [accountType, setAccountType] = useState('client');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();
   
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        tel: '',
        ville: '',
        region: ''
    });

    const [cniRecto, setCniRecto] = useState(null);
    const [cniVerso, setCniVerso] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError(null);

        // 1. Validation locale pour les rôles nécessitant la CNI
        if ((accountType === "proprietaire" || accountType === "agence") && (!cniRecto || !cniVerso)) {
            setError("Veuillez ajouter les images recto et verso de la CNI.");
            setLoading(false);
            return;
        }

        try {
            // 2. Inscription dans le USER-SERVICE (Données textuelles de profil)
            const userData = {
                role: accountType,
                email: formData.email,
                password: formData.password,
                nom: formData.nom,
                prenom: formData.prenom,
                tel: accountType === 'admin' ? "" : formData.tel,
                ville: accountType === 'admin' ? "" : formData.ville,
                region: accountType === 'admin' ? "" : formData.region
            };

            await registerUser(userData);

            // 3. Liaison avec l'IDENTITY-SERVICE si le rôle est éligible (Structure FormData pour fichiers)
            if (accountType === "proprietaire" || accountType === "agence") {
                const identityData = new FormData();
                identityData.append('email', formData.email);
                identityData.append('password', formData.password);
                identityData.append('requested_role', accountType);
                
                if (cniRecto) identityData.append('cni_recto', cniRecto);
                if (cniVerso) identityData.append('cni_verso', cniVerso);

                // Appel de ton IdentityService d'analyse OCR
                const ocrResult = await IdentityService.registerWithIdentity(identityData);
                
                if (ocrResult.status === 'verified') {
                    console.log("✓ Identité vérifiée instantanément par le module OCR.");
                }
            }

            setSuccess(true); 
            setLoading(false); 

            // Redirection après 3 secondes vers la page de connexion
            setTimeout(() => {
                navigate('/connexion');
            }, 3000);

        } catch (err) {
            console.error("Erreur lors de l'inscription croisée :", err);
            setLoading(false); 
            const backendMessage = err.response?.data?.error || err.message || "Erreur lors de l'inscription";
            setError(backendMessage);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Message d'erreur dynamique */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
                    <AlertCircle className="text-red-500" size={24} />
                    <p className="font-bold text-sm">{error}</p>
                </div>
            )}

            {/* Message de succès */}
            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                    <CheckCircle className="text-emerald-500" size={24} />
                    <p className="font-bold text-sm">
                        Votre compte a été créé, connectez-vous !
                    </p>
                </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleRegister}>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase ml-1">
                        Type de compte
                    </label>

                    <div className="relative group">
                        <Briefcase className="absolute left-3 top-3.5 text-gray-400" size={18} />

                        <select
                            disabled={loading || success}
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm cursor-pointer pl-11 disabled:opacity-50"
                        >
                            <option value="client">Client</option>
                            <option value="proprietaire">Propriétaire</option>
                            <option value="agence">Agence Immobilière</option>
                            <option value="admin">Administrateur</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup
                        disabled={loading || success}
                        icon={<User size={18} />}
                        placeholder="Nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                    />

                    <InputGroup
                        disabled={loading || success}
                        icon={<User size={18} />}
                        placeholder="Prénom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                    />
                </div>

                <InputGroup
                    disabled={loading || success}
                    icon={<Mail size={18} />}
                    type="email"
                    placeholder="votre@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />

                {accountType !== 'admin' && (
                    <>
                        <InputGroup
                            disabled={loading || success}
                            icon={<Phone size={18} />}
                            type="tel"
                            placeholder="+237 6 XX XX XX XX"
                            name="tel"
                            value={formData.tel}
                            onChange={handleInputChange}
                        />

                        <InputGroup
                            disabled={loading || success}
                            icon={<MapPin size={18} />}
                            placeholder="Ville"
                            name="ville"
                            value={formData.ville}
                            onChange={handleInputChange}
                        />

                        <InputGroup
                            disabled={loading || success}
                            icon={<MapPin size={18} />}
                            placeholder="Sélectionnez votre région"
                            name="region"
                            as="select"
                            value={formData.region}
                            onChange={handleInputChange}
                        >
                            <option value="adamaoua">Adamaoua</option>
                            <option value="centre">Centre</option>
                            <option value="est">Est</option>
                            <option value="extreme_nord">Extrême-Nord</option>
                            <option value="littoral">Littoral</option>
                            <option value="nord">Nord</option>
                            <option value="nord_ouest">Nord-Ouest</option>
                            <option value="ouest">Ouest</option>
                            <option value="sud">Sud</option>
                            <option value="sud_ouest">Sud-Ouest</option>
                        </InputGroup>
                    </>
                )}

                <InputGroup
                    disabled={loading || success}
                    icon={<Lock size={18} />}
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe au moins 6 caractere"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                />

                {(accountType === "proprietaire" || accountType === "agence") && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600 uppercase ml-1">
                            Documents d'identité (Obligatoire pour la validation)
                        </label>

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

                <button
                    disabled={loading || success}
                    type="submit"
                    className="w-full py-4 bg-[#007b83] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#00666d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            {accountType === 'proprietaire' || accountType === 'agence' 
                                ? "Vérification OCR et Inscription..." 
                                : "Inscription en cours..."}
                        </>
                    ) : (
                        "S'inscrire"
                    )}
                </button>
            </form>
        </div>
    );
};

const InputGroup = ({
    icon,
    type = "text",
    placeholder,
    name,
    value,
    onChange,
    children,
    as = "input",
    rightElement,
    disabled
}) => (
    <div className="relative group">
        <div className="absolute left-3 top-3.5 text-gray-400">
            {icon}
        </div>

        {as === "select" ? (
            <select
                disabled={disabled}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm pl-11 appearance-none disabled:opacity-50"
            >
                <option value="">{placeholder}</option>
                {children}
            </select>
        ) : (
            <input
                disabled={disabled}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm pl-11 disabled:opacity-50"
            />
        )}

        {rightElement && (
            <div className="absolute right-3 top-3.5">
                {rightElement}
            </div>
        )}
    </div>
);

const UploadBox = ({
    label,
    file,
    setFile
}) => {
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // On sauvegarde directement l'objet File brut requis par FormData
            setFile(selectedFile);
        }
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
                    className="h-full border-2 border-dashed border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer hover:border-[#007b83] hover:bg-teal-50/10 transition-all"
                >
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {label}
                    </span>
                </label>
            ) : (
                <div className="relative h-full w-full rounded-xl overflow-hidden border border-gray-200">
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Aperçu CNI"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 text-[8px] text-white p-1 truncate text-center font-mono">
                        {file.name}
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setFile(null);
                        }}
                        className="absolute top-1 right-1 bg-[#007b83] text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Inscription;
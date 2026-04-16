import React, { useState } from 'react';
import { User, Mail, Lock, ChevronLeft, Eye, EyeOff, Briefcase } from 'lucide-react';

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

const Connexion = () => {
    const [accountType, setAccountType] = useState('Agent Immobilier');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Tentative de connexion :", formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden">
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
                    <p className="text-sm text-gray-500 mt-1">Connectez-vous pour explorer le monde de l'Immobilier</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <InputGroup
                        icon={<Mail size={18} />}
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

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
                        Se Connecter
                    </button>
                </form>
                <a href="/inscription">
                    <p className="text-center text-sm text-gray-400 mt-8 font-medium">
                        Vous n'avez pas de compte ? <span className="text-[#007b83] font-bold cursor-pointer hover:underline">Inscrivez-vous</span>
                    </p>
                </a>

            </div>
        </div>
    );
};

export default Connexion;
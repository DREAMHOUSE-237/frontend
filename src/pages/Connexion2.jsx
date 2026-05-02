import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Appel API Login avec:", credentials);
        // Ton futur code : axios.post(...)
    };

    return (
        <form className="space-y-4 animate-in fade-in duration-300" onSubmit={handleLogin}>
            <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#007b83]" size={18} />
                <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none pl-11 text-sm focus:ring-2 focus:ring-[#007b83]"
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                />
            </div>
            
            <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#007b83]" size={18} />
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Mot de passe"
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none pl-11 text-sm focus:ring-2 focus:ring-[#007b83]"
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
                <button 
                    type="button" 
                    className="absolute right-3 top-3.5 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <button type="submit" className="w-full py-4 bg-[#007b83] text-white rounded-xl font-bold hover:bg-[#00666d] shadow-lg mt-2">
                Se Connecter
            </button>
        </form>
    );
};

export default LoginForm;
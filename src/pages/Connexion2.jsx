import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { login } from '../service/auth_service';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({onLoginSuccess}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false)
        try {
            const data = await login(credentials.email, credentials.password);

            if (data && data.access) {
                setSuccess(true);
                localStorage.setItem('token', data.access);
                
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
                
                    navigate("/accueil2");
                
            }
        } catch (err) {
            console.log("Erreur reçue :", err);

            if (err.status === 401) {
                setError(err.data?.error || "Identifiants incorrects");
            } else {
                setError("Impossible de se connecter. Vérifiez votre connexion.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-4 animate-in fade-in duration-300" onSubmit={handleLogin}>
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 animate-in zoom-in-95 duration-300">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Connexion réussie ! Redirection en cours...
                </div>
            )}
            <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#007b83]" size={18} />
                <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none pl-11 text-sm focus:ring-2 focus:ring-[#007b83]"
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    disabled={loading}
                />
            </div>

            <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#007b83]" size={18} />
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Mot de passe"
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none pl-11 text-sm focus:ring-2 focus:ring-[#007b83]"
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    disabled={loading}
                />
                <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#007b83] text-white rounded-xl font-bold hover:bg-[#00666d] shadow-lg mt-2">
                {loading ? < Loader2 className='animate-spin ml-50' size={20} /> : "Se Connecter"}
            </button>
        </form>
    );
};

export default LoginForm;
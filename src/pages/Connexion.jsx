import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck } from 'lucide-react'; // ShieldCheck pour le style Identity
import { useNavigate } from 'react-router-dom';
import acc3 from '../assets/acc3.jpg';

// Importation des nouveaux sous-composants
import LoginForm from './Connexion2';
import Inscription from './Inscription';
import IdentityVerification from './Indetity';

const AuthPage = () => {
    const navigate = useNavigate();
    // Utilisation d'un état "mode" pour gérer les 3 vues
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'identity'

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans">
            
            {/* --- PARTIE GAUCHE : FORMULAIRES --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 md:p-12 overflow-y-auto max-h-screen bg-gray-50/30">
                
                <div className="max-w-md mx-auto w-full py-8">
                    {/* LOGO CENTRALISÉ */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-[#007b83] rounded-full flex items-center justify-center text-white text-xs font-bold">D</div>
                            <div className="text-xl font-bold tracking-tight">
                                <span className="text-[#007b83]">Dream</span>
                                <span className="text-[#ff8800] ml-1">House</span>
                            </div>
                        </div>
                        
                        {/* Titres dynamiques selon le mode */}
                        <h2 className="text-xl font-bold text-gray-800">
                            {authMode === 'login' && "Bienvenue"}
                            {authMode === 'signup' && "Créer un compte"}
                            {authMode === 'identity' && "Vérification d'identité"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {authMode === 'login' && "Connectez-vous pour explorer le monde"}
                            {authMode === 'signup' && "Rejoignez-nous pour gérer vos biens"}
                            {authMode === 'identity' && "Sécurisez votre profil pour publier des annonces"}
                        </p>
                    </div>

                    {/* Affichage conditionnel des sections */}
                    <div className="transition-all duration-300">
                        {authMode === 'login' && <LoginForm />}
                        {authMode === 'signup' && <Inscription />}
                        {authMode === 'identity' && <IdentityVerification/>}
                    </div>

                    {/* Toggle entre les modes */}
                    <div className="mt-8 space-y-4">
                        <p className="text-center text-sm text-gray-400 font-medium">
                            {authMode === 'login' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"} 
                            <span 
                                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                className="text-[#007b83] font-bold cursor-pointer hover:underline ml-1"
                            >
                                {authMode === 'login' ? "Inscrivez-vous" : "Connectez-vous"}
                            </span>
                        </p>

                        {/* Bouton rapide pour accéder à la vérification (Identity) */}
                        {authMode !== 'identity' ? (
                            <button 
                                onClick={() => setAuthMode('identity')}
                                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-[#ff8800] transition-colors border-t border-gray-100 pt-4"
                            >
                                <ShieldCheck size={16} /> Besoin de vérifier votre identité ?
                            </button>
                        ) : (
                            <button 
                                onClick={() => setAuthMode('login')}
                                className="w-full text-center text-xs font-bold text-[#007b83] hover:underline"
                            >
                                Retour à la connexion
                            </button>
                        )}
                    </div>
                </div>
                
                {/* FOOTER DE GAUCHE */}
                <div className="flex flex-col items-center gap-4 mt-auto pt-8">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-400 hover:text-[#007b83] transition-colors text-sm font-medium"
                    >
                        <ChevronLeft size={18} /> Retour au site
                    </button>
                    <div className="text-[10px] text-gray-300 uppercase font-bold tracking-widest text-center">
                        © 2026 Dreamhouse. Tous droits réservés.
                    </div>
                </div>
            </div>

            {/* --- PARTIE DROITE : IMAGE & SLOGAN --- */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img src={acc3} alt="Dreamhouse" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                <div className="absolute bottom-20 left-16 right-16">
                    <h2 className="text-5xl font-bold text-white leading-tight mb-4">
                        {authMode === 'identity' ? "Sécurisez votre \n futur." : "L'excellence \n n'attend pas."}
                    </h2>
                    <p className="text-white/80 text-lg font-light max-w-md border-l-2 border-[#007b83] pl-4">
                        {authMode === 'identity' 
                            ? "La vérification d'identité renforce la confiance entre propriétaires et locataires."
                            : "Rejoignez la communauté Dreamhouse et faites briller vos annonces immobilières."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
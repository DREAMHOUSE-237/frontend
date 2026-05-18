import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import acc3 from '../assets/acc3.jpg';
import logo from '../assets/logo.jpeg'; 
import LoginForm from './Connexion2';
import Inscription from './Inscription';

const AuthPage = () => {
    const navigate = useNavigate();
    // Gestion propre du mode 'login' ou 'signup'
    const [authMode, setAuthMode] = useState('login'); 

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans">
            
            {/* --- PARTIE GAUCHE : FORMULAIRES --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 md:p-12 overflow-y-auto max-h-screen bg-gray-50/30">
                
                <div className="max-w-md mx-auto w-full py-8">
                    {/* LOGO CENTRALISÉ */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col justify-center items-center gap-3 mb-4 group">
                            <div className="w-14 h-14 overflow-hidden rounded-xl shadow-sm border border-gray-100">
                                <img 
                                  src={logo} 
                                  alt="DreamHouse Logo" 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                />
                            </div>
                            <div className="text-2xl font-black tracking-tight font-sans">
                                <span className="text-[#ff8800]">Dream</span>
                                <span className="text-[#007b83]">House</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {authMode === 'login' ? "Bienvenue" : "Créer un compte"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {authMode === 'login' 
                                ? "Connectez-vous pour explorer le monde" 
                                : "Rejoignez-nous pour gérer vos biens"
                            }
                        </p>
                    </div>

                    {/* Affichage conditionnel des sections */}
                    <div className="transition-all duration-300">
                        {authMode === 'login' ? <LoginForm /> : <Inscription />}
                    </div>

                    {/* Toggle entre Connexion et Inscription */}
                    <div className="mt-8">
                        <p className="text-center text-sm text-gray-400 font-medium">
                            {authMode === 'login' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"} 
                            <span 
                                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                className="text-[#007b83] font-bold cursor-pointer hover:underline ml-1"
                            >
                                {authMode === 'login' ? "Inscrivez-vous" : "Connectez-vous"}
                            </span>
                        </p>
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
                        L'excellence <br /> n'attend pas.
                    </h2>
                    <p className="text-white/80 text-lg font-light max-w-md border-l-2 border-[#007b83] pl-4">
                        Rejoignez la communauté Dreamhouse et faites briller vos annonces immobilières.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
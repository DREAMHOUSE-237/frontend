import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; 
import { User } from 'lucide-react';
import logo from '../assets/logo.jpeg'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Détecter le scroll pour ajouter un effet d'ombre ou de transparence
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkStyles = ({ isActive }) => 
    isActive 
      ? "text-[#007b83] font-bold transition-colors" 
      : "text-gray-700 hover:text-[#007b83] transition-colors";

  return (
    <nav className={`sticky top-0 z-[10001] bg-white transition-all duration-300 font-sans ${scrolled ? 'shadow-md py-1' : 'shadow-sm py-3'}`}>
      <div className="flex items-center justify-between px-6 py-3">
        
        {/* Logo & Titre - À gauche */}
        <NavLink to="/" className="flex items-center space-x-3 cursor-pointer group">
          {/* ✅ Intégration de l'image du logo avec gestion de l'effet scrolled */}
          <div className={`overflow-hidden rounded-xl transition-all duration-300 ${scrolled ? 'w-9 h-9' : 'w-11 h-11'}`}>
            <img 
              src={logo} 
              alt="DreamHouse Logo" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
            />
          </div>
          <div className="text-xl font-black tracking-tight font-sans">
            <span className="text-[#ff8800]">Dream</span>
            <span className="text-[#007b83]">House</span>
          </div>
        </NavLink>

        {/* Liens centraux (Desktop) */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NavLink to="/" className={linkStyles}>
            Accueil
          </NavLink>
          <NavLink to="/catalogue" className={linkStyles}>Catalogue</NavLink>
        </div>

        {/* Côté Droit : Bouton Connexion Unique & Menu Burger */}
        <div className="flex items-center space-x-4">
          
          {/* Zone de connexion Desktop épurée */}
          <div className="hidden md:flex items-center">
            <NavLink to="/connexion">
              <button className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-[#007b83] border border-[#007b83] rounded-md hover:bg-[#f0f9fa] transition-colors">
                <User size={16} /> 
                Se connecter
              </button>
            </NavLink>
          </div>

          {/* Menu Burger Mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4 shadow-lg absolute w-full left-0 z-50 animate-in slide-in-from-top-2">
          {/* Liens de navigation mobiles */}
          <NavLink to="/" className={({ isActive }) => `block font-medium ${isActive ? 'text-[#007b83]' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
            Accueil
          </NavLink>
          
          <NavLink to="/catalogue" className={({ isActive }) => `block font-medium ${isActive ? 'text-[#007b83]' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
            Catalogue
          </NavLink>
         
          <hr className="border-gray-100" />
          
          {/* Action unique mobile */}
          <div className="flex flex-col space-y-3">
            <NavLink to="/connexion" onClick={() => setIsOpen(false)}>
              <button className="w-full flex items-center justify-center gap-2 py-2 text-center font-semibold text-[#007b83] border border-[#007b83] rounded-md">
                <User size={18} />
                Se connecter
              </button>
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
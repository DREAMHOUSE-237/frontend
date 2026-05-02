import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; 
import {
   ChevronDown, User, Building2,
   LogOut, Menu, X
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Simulation des données utilisateur
  const user = {
    prenom: "Kieran",
    avatar: null
  };

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fonction pour styliser les liens actifs
  const linkStyles = ({ isActive }) => 
    isActive 
      ? "text-[#007b83] font-bold transition-colors" 
      : "text-gray-700 hover:text-[#007b83] transition-colors";

  return (
    <nav className="bg-white shadow-sm font-sans relative z-50">
      {/* --- BARRE PRINCIPALE --- */}
      <div className="flex items-center justify-between px-6 py-3">

        {/* Logo Section */}
        <NavLink to="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-[#007b83] rounded-full flex items-center justify-center text-white text-xs font-bold">
            D
          </div>
          <div className="text-xl font-bold tracking-tight">
            <span className="text-[#007b83]">Dream</span>
            <span className="text-[#ff8800] ml-1">House</span>
          </div>
        </NavLink>

        {/* Liens centraux (Desktop) */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NavLink to="/" className={linkStyles}>
            Bien en location <span className="text-gray-300 mx-1">|</span> Vendre
          </NavLink>
          <NavLink to="/conseil" className={linkStyles}>Actus & Conseils</NavLink>
          <NavLink to="/recherche" className={linkStyles}>Recherche</NavLink>
          <NavLink to="/contact" className={linkStyles}>Contact</NavLink>
          <NavLink to="/publication" className={linkStyles}>Publier mon bien</NavLink>
        </div>

        {/* Actions Droite */}
        <div className="flex items-center space-x-4">

          {/* Langue & Aide */}
          <div className="hidden sm:flex items-center text-sm font-medium text-gray-600">
            <button className="font-bold text-gray-900 px-1">FR</button>
            <span className="text-gray-300">/</span>
            <button className="px-1 hover:text-[#007b83]">EN</button>
          </div>

          {/* Avatar / Dropdown (Desktop) */}
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-1 focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center group-hover:border-[#007b83] transition-all">
                {user.avatar ? (
                  <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-gray-400" />
                )}
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu Déroulant */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-5 py-2 border-b border-gray-50">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {user.prenom}
                  </p>
                </div>
                <div className="py-1">
                  <NavLink to="/profile" onClick={() => setIsProfileOpen(false)}>
                    <DropdownItem icon={User} label="Profil" />
                  </NavLink>
                  <NavLink to="/mes-publications" onClick={() => setIsProfileOpen(false)}>
                    <DropdownItem icon={Building2} label="Mes propriétés" />
                  </NavLink>
                </div>
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <DropdownItem icon={LogOut} label="Déconnexion" color="text-red-500" />
                </div>
              </div>
            )}
          </div>

          {/* Menu Burger (Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none p-1"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENU MOBILE --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-6 shadow-xl absolute w-full left-0 z-50 animate-in slide-in-from-right duration-300">
          {/* Navigation standard */}
          <div className="space-y-4 font-semibold text-lg">
            <NavLink to="/" className={({isActive}) => `block ${isActive ? 'text-[#007b83]' : 'text-gray-800'}`} onClick={() => setIsOpen(false)}>
                Bien en location / Vendre
            </NavLink>
            <NavLink to="/conseil" className={({isActive}) => `block ${isActive ? 'text-[#007b83]' : 'text-gray-800'}`} onClick={() => setIsOpen(false)}>
                Actus & Conseils
            </NavLink>
            <NavLink to="/recherche" className={({isActive}) => `block ${isActive ? 'text-[#007b83]' : 'text-gray-800'}`} onClick={() => setIsOpen(false)}>
                Recherche
            </NavLink>
            <NavLink to="/contact" className={({isActive}) => `block ${isActive ? 'text-[#007b83]' : 'text-gray-800'}`} onClick={() => setIsOpen(false)}>
                Contact
            </NavLink>
            <NavLink to="/publication" className={({isActive}) => `block ${isActive ? 'text-[#007b83]' : 'text-gray-800'}`} onClick={() => setIsOpen(false)}>
                Publier mon bien
            </NavLink>
          </div>

          <hr className="border-gray-100" />

          {/* Options de compte (Mobile) */}
          <div className="space-y-4 pb-2">
            <p className="text-xs font-black text-[#ff8800] uppercase tracking-widest">Mon Compte ({user.prenom})</p>
            <div className="grid grid-cols-1 gap-4 font-bold text-gray-700">
              <NavLink to="/profile" onClick={() => setIsOpen(false)}>
                <MobileLink icon={User} label="Profil" />
              </NavLink>
              <NavLink to="/mes-publications" onClick={() => setIsOpen(false)}>
                <MobileLink icon={Building2} label="Mes propriétés" />
              </NavLink>
              <MobileLink icon={LogOut} label="Déconnexion" color="text-red-500" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

/* --- COMPOSANTS INTERNES --- */
const DropdownItem = ({ icon: Icon, label, color = "text-gray-800" }) => (
  <div className={`w-full flex items-center space-x-4 px-5 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer ${color}`}>
    <Icon size={18} className="text-gray-400" />
    <span className="text-sm ">{label}</span>
  </div>
);

const MobileLink = ({ icon: Icon, label, color = "text-gray-800" }) => (
  <div className={`flex items-center space-x-4 py-1.5 cursor-pointer ${color}`}>
    <Icon size={22} className="text-gray-400" />
    <span className="text-base ">{label}</span>
  </div>
);

export default Navbar;
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; 
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkStyles = ({ isActive }) => 
    isActive 
      ? "text-[#007b83] font-bold transition-colors" 
      : "text-gray-700 hover:text-[#007b83] transition-colors"; 

  return (
    <nav className="bg-white shadow-sm font-sans relative">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-[#007b83] rounded-full flex items-center justify-center text-white text-xs font-bold ml-10">
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
            Accueil
          </NavLink>
          <NavLink to="/catalogue" className={linkStyles}>Catalogue</NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center text-sm font-medium text-gray-600">
            <button className="font-bold text-gray-900 px-1">FR</button>
            <span className="text-gray-300">/</span>
            <button className="px-1 hover:text-[#007b83]">EN</button>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <NavLink to="/connexion">
              <button className="px-5 py-2 text-sm font-semibold text-[#007b83] border border-[#007b83] rounded-md hover:bg-[#f0f9fa]">
                Se connecter
              </button>
            </NavLink>
            <NavLink to="/inscription">
              <button className="px-5 py-2 text-sm font-semibold text-white bg-[#007b83] rounded-md hover:bg-[#00666d]">
                S'inscrire
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
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4 shadow-lg absolute w-full left-0 z-50">
          <NavLink to="/" className={({ isActive }) => `block font-medium ${isActive ? 'text-[#007b83]' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
            Bien en location / Vendre
          </NavLink>
          <NavLink to="/conseil" className={({ isActive }) => `block font-medium ${isActive ? 'text-[#007b83]' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
            Actus & Conseils
          </NavLink>
          <NavLink to="/recherche" className={({ isActive }) => `block font-medium ${isActive ? 'text-[#007b83]' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
            Recherche
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `block font-medium ${isActive ? 'text-[#007b83]' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>
            Contact
          </NavLink>
          
          <hr className="border-gray-100" />
          
          <div className="flex flex-col space-y-3">
            <NavLink to="/connexion" onClick={() => setIsOpen(false)}>
              <button className="w-full py-2 text-center font-semibold text-[#007b83] border border-[#007b83] rounded-md">
                Se connecter
              </button>
            </NavLink>
            <NavLink to="/inscription" onClick={() => setIsOpen(false)}>
              <button className="w-full py-2 text-center font-semibold text-white bg-[#007b83] rounded-md">
                S'inscrire
              </button>
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
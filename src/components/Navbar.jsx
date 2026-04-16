import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm font-sans relative">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-[#007b83] rounded-full flex items-center justify-center text-white text-xs font-bold">
            D
          </div>
          <div className="text-xl font-bold tracking-tight">
            <span className="text-[#007b83]">Dream</span>
            <span className="text-[#ff8800] ml-1">House</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <a href="/" className="hover:text-[#007b83] transition-colors">
            Bien en location <span className="text-gray-300 mx-1">|</span> Vendre
          </a>
          <a href="/conseil" className="hover:text-[#007b83] transition-colors">Actus & Conseils</a>
          <a href="/recherche" className="hover:text-[#007b83] transition-colors">Recherche</a>
          <a href="/contact" className="hover:text-[#007b83] transition-colors">Contact</a>
          
        </div>

  
        <div className="flex items-center space-x-4">
          
          <div className="hidden sm:flex items-center text-sm font-medium text-gray-600">
            <button className="font-bold text-gray-900 px-1">FR</button>
            <span className="text-gray-300">/</span>
            <button className="px-1 hover:text-[#007b83]">EN</button>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <a href="/connexion">
               <button className="px-5 py-2 text-sm font-semibold text-[#007b83] border border-[#007b83] rounded-md hover:bg-[#f0f9fa]">
              Se connecter
            </button>
            </a>
           
           <a href="/inscription">
            <button className="px-5 py-2 text-sm font-semibold text-white bg-[#007b83] rounded-md hover:bg-[#00666d]">
              S'inscrire
            </button>
           </a>
            
          </div>

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

  
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4 shadow-lg absolute w-full left-0 z-50">
          <a href="/" className="block text-gray-700 font-medium">Bien en location / Vendre</a>
          <a href="/conseil" className="block text-gray-700 font-medium">Actus & Conseils</a>
          <a href="/recherche" className="hover:text-[#007b83] transition-colors">Recherche</a>
          <a href="/contact" className="block text-gray-700 font-medium">Contact</a>
          <hr className="border-gray-100" />
          
          <div className="flex flex-col space-y-3">
            <a href="/connexion">
              <button className="w-full py-2 text-center font-semibold text-[#007b83] border border-[#007b83] rounded-md">
              Se connecter
            </button>
            </a>
            <a href="/inscription">
              <button className="w-full py-2 text-center font-semibold text-white bg-[#007b83] rounded-md">
              S'inscrire
            </button>
            </a>
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
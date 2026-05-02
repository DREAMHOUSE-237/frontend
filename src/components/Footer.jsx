import React from 'react';
import { Facebook, Instagram, Linkedin, MessageCircle, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#021d33] text-white pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Colonne 1 : À propos */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#007b83] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#007b83]/20">
              D
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-wider">
              <span className="text-white">Dream</span>
              <span className="text-[#ff8800] ml-1">House</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            DreamHouse est une plateforme innovante dédiée à simplifier l'accès au logement au Cameroun.
            Nous facilitons les transactions entre locataires, acheteurs et propriétaires
            avec une transparence totale.
          </p>
        </div>

        {/* Colonne 2 : Liens Rapides */}
        <div className="md:justify-self-center">
          <h3 className="text-[#ff8800] font-bold mb-6 uppercase text-sm tracking-widest">
            Navigation
          </h3>
          <ul className="text-gray-400 text-sm space-y-4">
            <li>
              <Link to="/equipe" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                Qui sommes-nous ?
              </Link>
            </li>
            <li>
              <Link to="/catalogue" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                Catalogue
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                Nous contacter
              </Link>
            </li>
            
          </ul>
        </div>

        {/* Colonne 3 : Réseaux Sociaux */}
        <div className="md:justify-self-end">
          <h3 className="text-[#ff8800] font-bold mb-6 uppercase text-sm tracking-widest text-left">
            Retrouvez-nous
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#ff8800]/20 transition-colors">
                <Facebook size={18} />
              </div>
              <span className="text-sm font-medium">Facebook</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#ff8800]/20 transition-colors">
                <Instagram size={18} />
              </div>
              <span className="text-sm font-medium">Instagram</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#ff8800]/20 transition-colors">
                <Linkedin size={18} />
              </div>
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Barre de copyright basse */}
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:row justify-between items-center gap-6">
        <p className="text-gray-500 text-xs font-medium tracking-wide">
          © {currentYear} <span className="text-gray-400">DREAMHOUSE</span>. TOUS DROITS RÉSERVÉS.
        </p>

        <div className="flex space-x-8 text-gray-500">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <Mail size={16} className="text-[#ff8800]" />
            <span className="text-[11px] group-hover:text-white transition-colors">contact@dreamhouse.com</span>
          </div>
          <div className="flex items-center space-x-2 group cursor-pointer">
            <Phone size={16} className="text-[#007b83]" />
            <span className="text-[11px] group-hover:text-white transition-colors">+237 6XX XXX XXX</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
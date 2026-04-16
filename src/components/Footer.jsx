import React from 'react';
import { Facebook, Instagram, Linkedin, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';
import {Link} from 'react-router-dom';
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#021d33] text-white pt-12 pb-6 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">


        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-[#007b83] rounded-full flex items-center justify-center text-white text-xs font-bold">
              D
            </div>
            <h2 className="text-xl font-bold uppercase tracking-wider">
              <span className="text-white">Dream</span>
              <span className="text-[#ff8800] ml-1">House</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            DreamHouse est une plateforme innovante dédiée à simplifier l'accès au logement.
            Nous facilitons les transactions entre locataires, acheteurs et propriétaires
            avec une transparence totale et un accompagnement sur mesure.
          </p>
        </div>


        {/* Colonne 2 : Nos Villes (10 régions, 2 colonnes de 5) */}
        <div>
          <h3 className="text-[#ff8800] font-bold mb-6 uppercase text-sm tracking-widest">Nos villes</h3>
          <div className="grid grid-cols-2 gap-4">
            <ul className="text-gray-400 text-sm space-y-3">
              <li className="hover:text-white cursor-pointer transition-colors">Yaoundé</li>
              <li className="hover:text-white cursor-pointer transition-colors">Douala</li>
              <li className="hover:text-white cursor-pointer transition-colors">Bafoussam</li>
              <li className="hover:text-white cursor-pointer transition-colors">Garoua</li>
              <li className="hover:text-white cursor-pointer transition-colors">Bamenda</li>
            </ul>
            <ul className="text-gray-400 text-sm space-y-3">
              <li className="hover:text-white cursor-pointer transition-colors">Ngaoundéré</li>
              <li className="hover:text-white cursor-pointer transition-colors">Maroua</li>
              <li className="hover:text-white cursor-pointer transition-colors">Buea</li>
              <li className="hover:text-white cursor-pointer transition-colors">Bertoua</li>
              <li className="hover:text-white cursor-pointer transition-colors">Ebolowa</li>
            </ul>
          </div>
        </div>


        

        <div>
          <h3 className="text-[#ff8800] font-bold mb-6 uppercase text-sm tracking-widest">
            DreamHouse
          </h3>
          <ul className="text-gray-400 text-sm space-y-3 flex flex-col">
            <li>
              <Link
                to="/equipe"
                className="hover:text-white transition-colors duration-200 block"
              >
                Qui sommes-nous ?
              </Link>
            </li>
            <li>
              <Link
                to="/recherche"
                className="hover:text-white transition-colors duration-200 block"
              >
                Recherche
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-white transition-colors duration-200 block"
              >
                Nous contacter
              </Link>
            </li>
            <li>
              <Link
                to="/conseil"
                className="hover:text-white transition-colors duration-200 block"
              >
                Actus & Conseils
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#ff8800] font-bold mb-6 uppercase text-sm tracking-widest">Retrouvez-nous sur</h3>
          <div className="space-y-4">
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
              <Facebook size={18} />
              <span className="text-sm">Facebook</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
              <Instagram size={18} />
              <span className="text-sm">Instagram</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
              <Linkedin size={18} />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
              <MessageCircle size={18} />
              <span className="text-sm">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-xs text-center md:text-left">
          © {currentYear} DreamHouse. Tous droits réservés.
        </p>


        <div className="flex space-x-6 mt-4 md:mt-0 text-gray-500">
          <div className="flex items-center space-x-1">
            <Mail size={14} />
            <span className="text-[10px]">contact@dreamhouse.com</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone size={14} />
            <span className="text-[10px]">+237 6XX XXX XXX</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
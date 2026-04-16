import React from 'react';
import { Phone, MapPin, Mail, MessageCircle, Send, Facebook, Clock, Linkedin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. Header & Infos de Contact */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ml-20">
            
            {/* Téléphone */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-[#007b83] rounded-full flex items-center justify-center text-white shadow-lg">
                <Phone size={24} />
              </div>
              <h3 className="font-bold text-gray-800">Numéro de téléphone</h3>
              <a href="https://wa.me/" className="text-[#007b83] font-medium flex items-center gap-1 hover:underline">
                <MessageCircle size={16} /> 
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center text-center space-y-3 ml-20">
              <div className="w-14 h-14 bg-[#007b83] rounded-full flex items-center justify-center text-white shadow-lg">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-gray-800">Adresse mail</h3>
              <a href="mailto:contact@dreamhouse.com" className="text-[#007b83] font-medium hover:underline">
                contact@dreamhouse.com
              </a>
            </div>

            {/* Réseaux Sociaux */}
            <div className="flex flex-col items-center text-center space-y-3 ml-20">
              <div className="w-14 h-14 bg-[#007b83] rounded-full flex items-center justify-center text-white shadow-lg">
                <Facebook size={24} />
              </div>
              <h3 className="font-bold text-gray-800">Réseaux sociaux</h3>
              <div className="flex space-x-4">
                <Facebook className="text-blue-600 cursor-pointer" />
                <Linkedin className="text-blue-700 cursor-pointer" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Formulaire de Contact & Horaires */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Côté Gauche : Formulaire */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Formulaire de prise de contact</h2>
            <p className="text-gray-500 mb-8">En cas de problèmes, signalez ici. Nous répondrons dans les 24 heures.</p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Nom *" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007b83] transition-all"
                />
                <input 
                  type="email" 
                  placeholder="Adresse mail *" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007b83] transition-all"
                />
              </div>
              <textarea 
                placeholder="Description *" 
                rows="6" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007b83] transition-all"
              ></textarea>
              
              <button className="flex items-center justify-center space-x-2 bg-[#007b83] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#00666d] transition-all shadow-lg shadow-[#007b83]/20">
                <Send size={18} />
                <span>Envoyer</span>
              </button>
            </form>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Contact;
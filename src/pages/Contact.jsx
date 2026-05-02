import React from 'react';
import { Phone, Mail, MessageCircle, Send, Facebook, Linkedin, ShieldAlert } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-[#f8f6f2] min-h-screen pb-20 font-sans">
      {/* 1. Header de support */}
      <div className="bg-[#1a2b3c] py-20 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex p-3 bg-orange-500/10 rounded-2xl mb-6">
            <ShieldAlert className="text-[#f97316]" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">Assistance & Support Technique</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Vous rencontrez une anomalie ou un dysfonctionnement sur la plateforme ? 
            Notre équipe technique est à votre disposition pour garantir votre expérience utilisateur.
          </p>
        </div>
      </div>

      {/* 2. Infos de contact rapides (Responsive Grid) */}
      <div className="max-w-5xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-[#007b83] rounded-2xl flex items-center justify-center mb-4">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Support Client</h3>
            <p className="text-sm text-gray-500 mt-1">+237 6XX XXX XXX</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-orange-50 text-[#f97316] rounded-2xl flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Email Technique</h3>
            <p className="text-sm text-gray-500 mt-1">support@dreamhouse.com</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-gray-800">WhatsApp Direct</h3>
            <p className="text-sm text-gray-500 mt-1">Réponse rapide</p>
          </div>
        </div>
      </div>

      {/* 3. Formulaire Centralisé */}
      <div className="max-w-3xl mx-auto px-6 mt-16">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-50">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-[#1a2b3c] mb-2">Signaler un incident</h2>
            <p className="text-gray-500">
              Veuillez détailler le problème rencontré. Un ticket de support sera ouvert automatiquement.
            </p>
          </div>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Nom complet</label>
                <input 
                  type="text" 
                  placeholder="Jean Dupont" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#007b83] transition-all font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">Adresse email</label>
                <input 
                  type="email" 
                  placeholder="jean@exemple.com" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#007b83] transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Nature du problème</label>
              <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#007b83] transition-all font-semibold text-gray-700 appearance-none">
                <option>Dysfonctionnement technique</option>
                <option>Problème d'affichage</option>
                <option>Erreur lors d'une publication</option>
                <option>Autre demande</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Description détaillée</label>
              <textarea 
                placeholder="Décrivez précisément les étapes qui ont mené à l'erreur..." 
                rows="5" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#007b83] transition-all font-semibold"
              ></textarea>
            </div>
            
            <button className="w-full flex items-center justify-center space-x-3 bg-[#1a2b3c] text-white py-5 rounded-2xl font-black hover:bg-[#007b83] transition-all shadow-lg shadow-gray-200 uppercase tracking-widest text-sm">
              <Send size={18} />
              <span>Soumettre le ticket technique</span>
            </button>
          </form>

          {/* Social Footer */}
          <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col items-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Suivez notre actualité technique</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#007b83] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#007b83] transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
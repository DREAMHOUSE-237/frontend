import React, { useState } from 'react';
import { IdentityService } from '../service/auth_service';
import { Upload, Shield, Mail, Lock, Loader2, Eye, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IdentityVerification = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    requested_role: 'Client'
  });
  const [files, setFiles] = useState({ recto: null, verso: null });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('requested_role', formData.requested_role);
    
    if (files.recto) data.append('cni_recto', files.recto);
    if (files.verso) data.append('cni_verso', files.verso);

    try {
      const result = await IdentityService.registerWithIdentity(data);
      if (result.status === 'verified') {
        alert("Succès ! Votre identité a été vérifiée par OCR.");
      } else {
        alert("Compte créé. Un administrateur doit vérifier votre dossier.");
      }
      navigate('/login');
    } catch (err) {
      alert(err.message || "Erreur lors de la création du compte.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <div className="bg-teal-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="text-[#007b83]" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Créer un compte</h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">Identité et accès sécurisés</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* TYPE DE COMPTE (Image 193db8.png) */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#4b5563] uppercase tracking-wider ml-1">
            Type de compte
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007b83] transition-colors">
              <Briefcase size={20} strokeWidth={1.5} />
            </div>
            <select 
              value={formData.requested_role}
              onChange={(e) => setFormData({...formData, requested_role: e.target.value})}
              className="w-full pl-12 pr-10 py-4 bg-[#f9fafb] border border-gray-100 rounded-2xl text-gray-600 font-medium appearance-none focus:bg-white focus:ring-2 focus:ring-[#007b83]/20 outline-none transition-all cursor-pointer"
            >
              <option value="Client">Client</option>
              <option value="proprietaire">Propriétaire</option>
              <option value="agence_immobiliere">Agence Immobilière</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C2.185 5.355 2.405 5 2.73 5h10.54c.325 0 .545.355.279.658l-4.796 5.482a.5.5 0 0 1-.727 0z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* EMAIL */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007b83] transition-colors">
            <Mail size={20} strokeWidth={1.5} />
          </div>
          <input 
            type="email" required
            placeholder="votre@email.com"
            className="w-full pl-12 pr-4 py-4 bg-[#f9fafb] border border-gray-100 rounded-2xl text-gray-600 placeholder:text-gray-400 font-medium focus:bg-white focus:ring-2 focus:ring-[#007b83]/20 outline-none transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        {/* MOT DE PASSE (Image 193d77.png) */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007b83] transition-colors">
            <Lock size={20} strokeWidth={1.5} />
          </div>
          <input 
            type={showPassword ? "text" : "password"} 
            required
            placeholder="Mot de passe au moins 6 caractere"
            className="w-full pl-12 pr-12 py-4 bg-[#f9fafb] border border-gray-100 rounded-2xl text-gray-600 placeholder:text-gray-400 font-medium focus:bg-white focus:ring-2 focus:ring-[#007b83]/20 outline-none transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Eye size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* SECTION DOCUMENTS (POUR OCR) */}
        <div className="pt-2 space-y-3">
          <label className="text-[11px] font-black text-[#4b5563] uppercase tracking-wider ml-1">
            Documents CNI (Obligatoire pour Propriétaire/Agence)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="relative flex flex-col items-center p-4 border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer hover:border-[#007b83] hover:bg-teal-50/30 transition-all group">
              <input type="file" required className="hidden" onChange={(e) => setFiles({...files, recto: e.target.files[0]})} />
              <Upload className="text-gray-300 group-hover:text-[#007b83] mb-1" size={24} />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Recto</span>
              {files.recto && <span className="text-[8px] text-teal-600 mt-1 truncate w-full text-center">{files.recto.name}</span>}
            </label>
            <label className="relative flex flex-col items-center p-4 border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer hover:border-[#007b83] hover:bg-teal-50/30 transition-all group">
              <input type="file" className="hidden" onChange={(e) => setFiles({...files, verso: e.target.files[0]})} />
              <Upload className="text-gray-300 group-hover:text-[#007b83] mb-1" size={24} />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Verso</span>
              {files.verso && <span className="text-[8px] text-teal-600 mt-1 truncate w-full text-center">{files.verso.name}</span>}
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full py-4 bg-[#007b83] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#00666d] shadow-lg shadow-[#007b83]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Vérification OCR...
            </>
          ) : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
};

export default IdentityVerification;
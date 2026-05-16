import React, { useEffect, useState } from 'react';
import { IdentityAdminService, AdminUserService } from '../service/auth_service';
import { 
    Check, X, Eye, Clock, List, ShieldCheck, AlertCircle, 
    Users, Fingerprint, LogOut, ShieldAlert, UserCheck, UserX 
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('identity'); // 'identity' ou 'users'
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('pending'); 
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeSection, view]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeSection === 'identity') {
                const data = view === 'pending' 
                    ? await IdentityAdminService.getPendingRequests() 
                    : await IdentityAdminService.getAllRequests();
                setRequests(Array.isArray(data) ? data : []);
            } else {
                const data = await AdminUserService.getUsers();
                // On gère la pagination du backend (data.results)
                setUsers(data.results || []);
            }
        } catch (err) {
            console.error("Erreur chargement", err);
        } finally {
            setLoading(false);
        }
    };

    const handleIdentityReview = async (id, action) => {
        let payload = {};
        if (action === 'reject') {
            const reason = prompt("Motif du rejet :");
            if (!reason) return;
            payload = { action: 'reject', rejection_reason: reason };
        } else {
            const nom = prompt("Nom officiel (CNI) :");
            const prenom = prompt("Prénom officiel (CNI) :");
            const cni = prompt("Numéro de CNI :");
            payload = { action: 'approve', nom, prenom, numero_cni: cni };
        }

        try {
            // 1. On met à jour le service Identity
            await IdentityAdminService.reviewRequest(id, payload);
            
            // 2. IMPORTANT : On valide aussi dans le User-Service pour changer le rôle
            const userPayload = { 
                user_id: selectedRequest.user_id || id, // Assure-toi d'envoyer l'ID utilisateur
                action, 
                ...payload 
            };
            await AdminUserService.validateCNI(userPayload);

            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert("Erreur lors de la validation croisée");
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            await AdminUserService.updateUserStatus(userId, !currentStatus);
            fetchData();
        } catch (err) {
            alert("Erreur modification statut");
        }
    };

    const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; 
};

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-black text-blue-400 tracking-tighter">DREAMHOUSE ADMIN</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveSection('identity')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeSection === 'identity' ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'hover:bg-gray-800 text-gray-400'}`}
                    >
                        <Fingerprint size={20} /> <span className="font-bold">Identités</span>
                    </button>

                    <button 
                        onClick={() => setActiveSection('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeSection === 'users' ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'hover:bg-gray-800 text-gray-400'}`}
                    >
                        <Users size={20} /> <span className="font-bold">Utilisateurs</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition font-bold">

                        <LogOut size={20} /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 ml-64 p-10">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase">
                            {activeSection === 'identity' ? 'Vérification Identité' : 'Gestion Utilisateurs'}
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Panneau de contrôle des accès et de la sécurité</p>
                    </div>

                    {activeSection === 'identity' && (
                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
                            <button onClick={() => setView('pending')} className={`px-5 py-2 rounded-xl text-xs font-black transition ${view === 'pending' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>EN ATTENTE</button>
                            <button onClick={() => setView('all')} className={`px-5 py-2 rounded-xl text-xs font-black transition ${view === 'all' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>HISTORIQUE</button>
                        </div>
                    )}
                </header>

                {loading ? (
                    <div className="flex justify-center py-20 text-gray-400 font-bold animate-pulse">CHARGEMENT DES DONNÉES...</div>
                ) : (
                    <div className="space-y-4">
                        {/* Vue Identity */}
                        {activeSection === 'identity' && requests.map((req) => (
                            <div key={req.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl ${req.status === 'verified' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {req.status === 'verified' ? <ShieldCheck /> : <Clock />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900">{req.email}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">{req.requested_role}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${req.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{req.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs hover:bg-blue-600 transition">EXAMINER</button>
                            </div>
                        ))}

                        {/* Vue Utilisateurs */}
                        {activeSection === 'users' && (
                            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-4">Utilisateur</th>
                                            <th className="px-8 py-4">Rôle</th>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50/50 transition">
                                                <td className="px-8 py-5">
                                                    <p className="font-bold text-gray-900">{user.email}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono">ID: {user.id}</p>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-medium text-gray-600 uppercase tracking-tighter">{user.role}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {user.is_active ? 'ACTIF' : 'BANNI'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button 
                                                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                                                        className={`p-2 rounded-xl transition ${user.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                                    >
                                                        {user.is_active ? <UserX size={20} /> : <UserCheck size={20} />}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- MODALE IDENTITY --- */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
                    <div className="bg-white rounded-[40px] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-8 border-b flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-900 uppercase">Dossier #{selectedRequest.id.split('-')[0]}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full"><X/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                                    <p className="text-blue-400 text-[10px] font-black uppercase mb-1">Email demandeur</p>
                                    <p className="text-xl font-bold text-blue-900">{selectedRequest.email}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-black uppercase mb-3">Recto CNI</p>
                                        <img src={selectedRequest.cni_recto} className="w-full rounded-xl border-2 border-white shadow-md cursor-pointer hover:scale-[1.02] transition" onClick={() => window.open(selectedRequest.cni_recto)}/>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-black uppercase mb-3">Verso CNI</p>
                                        <img src={selectedRequest.cni_verso} className="w-full rounded-xl border-2 border-white shadow-md cursor-pointer hover:scale-[1.02] transition" onClick={() => window.open(selectedRequest.cni_verso)}/>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between">
                                <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-200">
                                    <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest">Décision Finale</h4>
                                    <div className="space-y-4">
                                        <button onClick={() => handleIdentityReview(selectedRequest.id, 'approve')} className="w-full py-5 bg-green-600 text-white rounded-3xl font-black shadow-lg shadow-green-200 flex items-center justify-center gap-3 hover:bg-green-700 transition">
                                            <Check /> ACCEPTER L'IDENTITÉ
                                        </button>
                                        <button onClick={() => handleIdentityReview(selectedRequest.id, 'reject')} className="w-full py-5 bg-red-50 text-red-600 border border-red-100 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-red-100 transition">
                                            <X /> REJETER LE DOSSIER
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-300 font-mono text-center">DreamHouse Identity Validation Protocol v1.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
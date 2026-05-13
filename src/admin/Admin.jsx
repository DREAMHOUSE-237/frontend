import React, { useState, useEffect } from 'react';
import { 
    Users, Clock, CheckCircle, XCircle, Trash2, Eye, 
    ShieldCheck, Search, MoreVertical, LayoutDashboard,
    Loader2, RefreshCcw
} from 'lucide-react';
import { adminAPI } from '../service/admin_service'; // Assure-toi du chemin

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all' ou 'pending'
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Chargement des données
    const loadData = async () => {
        setLoading(true);
        try {
            const [usersRes, pendingRes] = await Promise.all([
                adminAPI.getUsers(),
                adminAPI.getPendingUsers()
            ]);
            setUsers(usersRes.data.results || usersRes.data || []);
            setPending(pendingRes.data.results || pendingRes.data || []);
        } catch (error) {
            console.error("Erreur chargement admin:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAction = async (id, action) => {
        if (!window.confirm(`Confirmer l'action : ${action} ?`)) return;
        try {
            if (action === 'delete') await adminAPI.deleteUser(id);
            else await adminAPI.validateCNI({ user_id: id, action });
            loadData(); // Rafraîchir
        } catch (error) {
            alert("Erreur lors de l'opération");
        }
    };

    // Filtrage pour la recherche
    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            {/* SIDEBAR MINI */}
            <div className="w-20 bg-[#1a2b3c] flex flex-col items-center py-8 space-y-8 text-white">
                <div className="w-10 h-10 bg-[#ff8800] rounded-xl flex items-center justify-center font-bold text-xl">D</div>
                <LayoutDashboard size={24} className="text-[#007b83] cursor-pointer" />
                <Users size={24} className="opacity-50 hover:opacity-100 cursor-pointer" />
                <SettingsIcon size={24} className="opacity-50 hover:opacity-100 cursor-pointer" />
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    
                    {/* HEADER */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-[#1a2b3c]">Dashboard Admin</h1>
                            <p className="text-gray-500 font-medium">Gestion des utilisateurs et validations d'identité</p>
                        </div>
                        <button 
                            onClick={loadData}
                            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <StatCard icon={<Users size={24}/>} label="Total Utilisateurs" value={users.length} color="bg-blue-500" />
                        <StatCard icon={<Clock size={24}/>} label="En attente CNI" value={pending.length} color="bg-orange-500" />
                        <StatCard icon={<ShieldCheck size={24}/>} label="Comptes Vérifiés" value={users.filter(u => u.is_verified).length} color="bg-emerald-500" />
                    </div>

                    {/* TABS & SEARCH */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-50 gap-4">
                            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                                <button 
                                    onClick={() => setActiveTab('all')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white text-[#1a2b3c] shadow-sm' : 'text-gray-500'}`}
                                >
                                    Tous les utilisateurs
                                </button>
                                <button 
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-white text-[#1a2b3c] shadow-sm' : 'text-gray-500'}`}
                                >
                                    En attente 
                                    {pending.length > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pending.length}</span>}
                                </button>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher un email..."
                                    className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-[#007b83]"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* TABLE SECTION */}
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex flex-col items-center py-20">
                                    <Loader2 className="animate-spin text-[#007b83] mb-4" size={40} />
                                    <p className="text-gray-500 font-bold">Chargement des données...</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-400 font-black">
                                            <th className="px-8 py-4">Utilisateur</th>
                                            <th className="px-8 py-4">Rôle</th>
                                            <th className="px-8 py-4">Statut</th>
                                            <th className="px-8 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {(activeTab === 'all' ? filteredUsers : pending).map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#1a2b3c] flex items-center justify-center text-white font-bold">
                                                            {user.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-bold text-gray-700">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    {user.is_verified ? (
                                                        <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                                                            <CheckCircle size={14} /> Vérifié
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-orange-500 text-xs font-bold">
                                                            <Clock size={14} /> En attente
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-4 text-right space-x-2">
                                                    {activeTab === 'pending' ? (
                                                        <>
                                                            <button onClick={() => handleAction(user.id, 'approve')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button onClick={() => handleAction(user.id, 'reject')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => setSelectedUser(user)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-[#1a2b3c] hover:text-white transition-all">
                                                                <Eye size={18} />
                                                            </button>
                                                            <button onClick={() => handleAction(user.id, 'delete')} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE DÉTAILS USER */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full">
                            <X size={24} />
                        </button>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center text-3xl font-black text-[#1a2b3c]">
                                {selectedUser.email.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-black text-[#1a2b3c]">{selectedUser.email}</h2>
                            <span className="px-4 py-1.5 bg-[#007b83]/10 text-[#007b83] rounded-full text-xs font-black uppercase tracking-widest italic">
                                {selectedUser.role}
                            </span>
                        </div>

                        <div className="mt-10 space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <DetailRow label="ID Utilisateur" value={selectedUser.id} />
                            <DetailRow label="Statut Vérification" value={selectedUser.is_verified ? "Validé" : "En attente"} />
                            <DetailRow label="Dernière Connexion" value="Aujourd'hui" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* SOUS-COMPOSANTS */
const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
        <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-black text-[#1a2b3c]">{value}</p>
        </div>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400 font-bold">{label}</span>
        <span className="text-[#1a2b3c] font-black">{value}</span>
    </div>
);

const SettingsIcon = ({ size, className }) => <RefreshCcw size={size} className={className} />;

export default AdminDashboard;
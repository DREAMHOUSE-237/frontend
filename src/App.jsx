import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";

// Import des Navbars
import Navbar from './components/Navbar';   
import Navbar2 from './components/Navbar2'; 
import Navbar3 from './components/Navbar3'; 
import Footer from './components/Footer';
import ScrollToTop from "./components/ScrollToTop";

// Import des Pages
import Accueil from './pages/Accueil';
import Recherche from './pages/Recherche';
import Contact from './pages/Contact';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';
import LoginForm from './pages/Connexion2';
import Details from './pages/detail';
import IdentityVerification from './pages/Indetity';
import ProfilePage from './Proprietaire/Profil';

// Pages spécifiques Propriétaires / Agences
import ProprietaireHome from './Proprietaire/Accueil2';
import Publication from './Proprietaire/Publication';
import MyPublications from './Proprietaire/MesPublications';
import ModifierPublication from './Proprietaire/ModificationImo';
import AdminDashboard from './admin/Admin';

import './App.css';

// 1. PROTECTION DES ROUTES PAR RÔLE & ÉLIGIBILITÉ
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/connexion" replace />;

  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    const userRole = payload.role?.toLowerCase();

    // Redirection automatique de l'admin s'il s'égare
    if (userRole === 'admin' && !allowedRoles.includes('admin')) {
      return <Navigate to="/admin" replace />;
    }

    //  Si un client tente d'accéder à une route propriétaire ou admin,on le redirige directement vers l'accueil public au lieu de lui afficher une erreur.
    if (userRole === 'client' && allowedRoles.length > 0 && !allowedRoles.includes('client')) {
      return <Navigate to="/" replace />;
    }

    // Sécurité générique pour les autres rôles non autorisés
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl text-red-600 font-bold">!</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Accès Restreint</h1>
          <p className="text-lg font-bold text-gray-600 mt-2 italic">Vous n'êtes pas éligible pour accéder à cette route.</p>
          <p className="text-sm text-gray-400 mt-2 max-w-md">
            Votre compte avec le rôle <b className="text-[#007b83] uppercase">"{userRole}"</b> ne dispose pas des privilèges nécessaires.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-8 px-10 py-4 bg-[#007b83] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
      );
    }
  } catch (e) {
    return <Navigate to="/connexion" replace />;
  }

  return children;
};


// 2. LAYOUT WRAPPER (NAVBAR & REDIRECTIONS ETANCHES)
const LayoutWrapper = ({ children, setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const getUserRole = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.role?.toLowerCase();
    } catch (e) {
      return null;
    }
  };

  const role = getUserRole();
  const hideLayout = ['/connexion2', '/connexion', '/inscription', '/admin'].includes(location.pathname);

  useEffect(() => {
    // Redirection automatique Admin
    if (role === 'admin' && location.pathname !== '/admin') {
      navigate('/admin', { replace: true });
    }

    //  Si un client tente manuellement d'entrer sur les URLs privées
    const routesPriveesMoinsClient = ['/accueil2', '/publication', '/mes-publications', '/admin'];
    if (role === 'client' && routesPriveesMoinsClient.some(route => location.pathname.startsWith(route))) {
      navigate('/', { replace: true });
    }
  }, [role, location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/');
  };

  const renderNavbar = () => {
    if (!token) return <Navbar />;
    // Le client a strictement la Navbar3, les autres rôles (proprietaire, agence) ont la Navbar2
    return role === 'client' 
      ? <Navbar3 onLogout={handleLogout} /> 
      : <Navbar2 onLogout={handleLogout} />;
  };

  return (
    <>
      {!hideLayout && renderNavbar()}
      <main className="min-h-screen">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
};

// 3. COMPOSANT PRINCIPAL APP
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <LayoutWrapper setIsAuthenticated={setIsAuthenticated}>
        <Routes>
          {/* ROUTES PUBLIQUES */}
          <Route path='/' element={<Accueil />} />
          <Route path='/catalogue' element={<Recherche />} />
          <Route path='/detail/:id' element={<Details />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/inscription' element={<Inscription />} />
          <Route path='/connexion' element={<Connexion />} />
          <Route 
            path='/connexion2' 
            element={<LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />} 
          />

          {/* ROUTES ÉTENDUES ACCESSIBLES AU CLIENT CONNECTÉ */}
          <Route 
            path='/profile' 
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
          />
          <Route 
            path='/identity' 
            element={<ProtectedRoute><IdentityVerification /></ProtectedRoute>} 
          />

          {/* ROUTES RÉSERVÉES PROPRIOS / AGENCES (Interdites au client) */}
          <Route 
            path='/accueil2' 
            element={
              <ProtectedRoute allowedRoles={['proprietaire','pending_proprietaire', 'pending_agence', 'agence']}>
                <ProprietaireHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/publication' 
            element={
              <ProtectedRoute allowedRoles={['proprietaire', 'pending_proprietaire', 'pending_agence', 'agence']}>
                <Publication />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/mes-publications' 
            element={
              <ProtectedRoute allowedRoles={['proprietaire','pending_proprietaire', 'pending_agence', 'agence']}>
                <MyPublications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/modif/:id' 
            element={
              <ProtectedRoute allowedRoles={['proprietaire','pending_proprietaire', 'pending_agence', 'agence']}>
                <ModifierPublication />
              </ProtectedRoute>
            } 
          />

          {/* ROUTE ADMIN UNIQUE */}
          <Route 
            path='/admin' 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
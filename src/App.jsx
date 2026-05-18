import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"

// Import des composants de base
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from "./components/ScrollToTop"
import Equipe from './components/Equipe'
import Navbar2 from './components/Navbar2'
import Navbar3 from './components/Navbar3'

// Import des pages publiques
import Accueil from './pages/Accueil'
import ActusConseils from './pages/Conseil'
import Recherche from './pages/Recherche'
import Contact from './pages/Contact'
import Inscription from './pages/Inscription'
import Connexion from './pages/Connexion'
import LoginForm from './pages/Connexion2'
import Details from './pages/detail'
import IdentityVerification from './pages/Indetity'
// Import des pages protégées
import ProprietaireHome from './Proprietaire/Accueil2'
import Publication from './Proprietaire/Publication'
import ProfilePage from './Proprietaire/Profil'
import MyPublications from './Proprietaire/MesPublications'
import ModifierPublication from './Proprietaire/ModificationImo'
import AdminIdentityDashboard from './admin/Admin'

import './App.css'

// ==========================================================
// 1. COMPOSANT DE PROTECTION DES ROUTES
// ==========================================================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/connexion" replace />;
  return children;
};

// ==========================================================
// 2. WRAPPER POUR LA MISE EN PAGE (NAVBAR/FOOTER)
// ==========================================================
const LayoutWrapper = ({ children, isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  
  // Pages où l'on cache la Navbar et le Footer
  const hideLayout = ['/connexion2', '/connexion','/inscription'].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };
 const token = localStorage.getItem('token');
  return (
    
    <>
      {!hideLayout && (
        token ? 
        <Navbar2 onLogout={handleLogout} /> : 
        <Navbar />
      )}
      <main className="min-h-screen">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
};

// ==========================================================
// 3. COMPOSANT PRINCIPAL APP
// ==========================================================
function App() {
  // Initialisation de l'état basée sur la présence d'un token
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));



  return (
    <BrowserRouter>
      <ScrollToTop />
      <LayoutWrapper isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
        <Routes>
          {/* ================= ROUTES PUBLIQUES ================= */}
          <Route path='/' element={<Accueil />} />
          <Route path='/equipe' element={<Equipe />} />
          <Route path='/conseil' element={<ActusConseils />} />
          <Route path='/catalogue' element={<Recherche />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/inscription' element={<Inscription />} />
          <Route path='/connexion' element={<Connexion />} />
          <Route  path='/identity' element={<IdentityVerification/>}/>
          
          {/* Passage de la fonction de succès au formulaire de connexion */}
          <Route 
            path='/connexion2' 
            element={<LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />} 
          />
          
          <Route path='/detail/:id' element={<Details />} />

          {/* ================= ROUTES PROTÉGÉES ================= */}
          <Route 
            path='/admin' 
            element={<AdminIdentityDashboard />} 
          />
          <Route 
            path='/accueil2' 
            element={<ProtectedRoute><ProprietaireHome /></ProtectedRoute>} 
          />
          <Route 
            path='/publication' 
            element={<ProtectedRoute><Publication /></ProtectedRoute>} 
          />
          <Route 
            path='/profile' 
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
          />
          <Route 
            path='/mes-publications' 
            element={<ProtectedRoute><MyPublications /></ProtectedRoute>} 
          />
          <Route 
            path='/modif/:id' 
            element={<ProtectedRoute><ModifierPublication /></ProtectedRoute>} 
          />

          {/* Redirection automatique pour les routes inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  )
}

export default App;
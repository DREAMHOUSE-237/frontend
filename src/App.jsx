import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar' 
import LoginPage from './profile/LoginPage';
import RegisterPage from './profile/register';
import Discovery from './decouverte/Discovery';
import Home from './components/Home';
import AgentBoard from './tableau/AgentBoard';
import ProprietaireBoard from './tableau/ProprietaireBoard';
import Publication from './publication/Publication';
import MonProfil from './tableau/MonProfil';
import MesPublications from './publication/MesPublications';
import EditProfile from './profile/EditProfile';

// Composant de protection de route
const ProtectedRoute = ({ children }) => {
  // Vérifier si l'utilisateur est connecté
  // Adaptez cette condition selon ce que vous stockez dans LoginPage
  const isAuthenticated = localStorage.getItem('access') || 
                         localStorage.getItem('token') || 
                         sessionStorage.getItem('userToken');
  
  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si non authentifié
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

function App() {
  // 1. Obtenir la route actuelle
  const location = useLocation();
  
  // 2. Définir les chemins où la Navbar générique DOIT être masquée
  const pathsToHideGenericNavbar = ['/Publication', '/AgentBoard', '/Proprio', '/MonProfil', '/MesPublications', '/Edit'];
  
  // 3. Déterminer si la Navbar générique doit être affichée
  // (Elle est affichée si le chemin actuel n'est pas dans la liste des chemins à masquer)
  const showGenericNavbar = !pathsToHideGenericNavbar.includes(location.pathname);
  
  return (
    <>
      {/* Rendu conditionnel de la Navbar générique */}
      {showGenericNavbar && <Navbar />} 
      
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/decouverte" element={<Discovery />} />
        
        {/* Routes protégées */}
        <Route 
          path="/AgentBoard" 
          element={
            <ProtectedRoute>
              <AgentBoard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Proprio" 
          element={
            <ProtectedRoute>
              <ProprietaireBoard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Publication" 
          element={
            <ProtectedRoute>
              <Publication />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/MonProfil" 
          element={
            <ProtectedRoute>
              <MonProfil />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/MesPublications" 
          element={
            <ProtectedRoute>
              <MesPublications />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/modification" 
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Route par défaut - redirection vers la page d'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>  
    </>
  );
}

export default App;
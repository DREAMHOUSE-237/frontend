import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AutoLogout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  // 30 minutes en millisecondes (30 * 60 * 1000)
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; 

  const handleLogout = () => {
    // 1. Vider le stockage d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('userEmail');
    
    // Éviter d'alerter en boucle si on est déjà sur la page de connexion
    if (location.pathname !== '/connexion') {
      alert("Votre session a expiré pour cause d'inactivité. Veuillez vous reconnecter.");
      navigate('/connexion');
    }
  };

  const resetTimer = () => {
    // Si un timer est en cours, on l'annule
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // On ne lance le compte à rebours que si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (token) {
      timerRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    // Liste des événements qui définissent une "activité" de l'utilisateur
    const events = [
      'mousedown', 
      'keydown', 
      'scroll', 
      'touchstart', 
      'click'
    ];

    // On attache les écouteurs d'événements au document global
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialisation du premier timer au montage du composant
    resetTimer();

    // Nettoyage des écouteurs lorsque le composant est démonté
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]); // Se réinitialise intelligemment à chaque changement de page

  return <>{children}</>;
};

export default AutoLogout;
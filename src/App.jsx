import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from './components/Navbar'
import Accueil from './pages/Accueil'
import Footer from './components/Footer'
import Equipe from './components/Equipe'
import ActusConseils from './pages/Conseil'
import Recherche from './pages/Recherche'
import Contact from './pages/Contact'
import Inscription from './pages/Inscription'
import Connexion from './pages/Connexion'
import ScrollToTop from "./components/ScrollToTop";
import Publication from './Proprietaire/Publication'
import ProfilePage from './Proprietaire/Profil'
import MyPublications  from './Proprietaire/MesPublications'
import ModifierPublication from './Proprietaire/ModificationImo'
import LoginForm from './pages/Connexion2'
import Details from './pages/detail'
import './App.css'

// Composant pour gérer l'affichage conditionnel
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Liste des routes où la Navbar et le Footer doivent être CACHÉS
  // J'ai ajouté /inscription car souvent on les cache aussi là-bas
  const hideLayout = ['/connexion', '/inscription'].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <LayoutWrapper>
        <Routes>
           <Route path='/' element={<Accueil />} />
           <Route path='/equipe' element={< Equipe/>}/>
           <Route path='/conseil' element={<ActusConseils/>}/>
           <Route path='/catalogue' element={<Recherche/>}/>
           <Route path='/contact' element={<Contact />} />
           <Route path='/inscription' element={<Inscription/>} />
           <Route path='/connexion2' element={<LoginForm/>}/>
           <Route path='/connexion' element={<Connexion/>}/>
           <Route path='/publication' element={< Publication/>}/>
           <Route path='/profile' element={< ProfilePage /> }/>
           <Route path='/mes-publications' element={<MyPublications/>}/>
           <Route path='/Modif'element={<ModifierPublication/>} />
           <Route path='/detail' element={ <Details />}/>
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  )
}

export default App
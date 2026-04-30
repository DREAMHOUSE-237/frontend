import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from './components/Navbar'
import Accueil from './pages/Accueil'
import Footer from './components/Footer'
import Equipe from './components/Equipe'
import ActusConseils from './pages/Conseil'
import Recherche from './pages/Recherche'
import Contact from './pages/Contact'
import Inscription from './pages/Inscription'
import Connexion from './pages/Connexion'
import Publication from './pages/Publication'
import ProfilePage from './pages/Profil'
import MyPublications  from './pages/MesPublications'
import ModifierPublication from './pages/ModificationImo'
import Details from './pages/detail'
import './App.css'

function App() {
  return (
    <BrowserRouter>

        <Navbar />
      
        <Routes>
           <Route path='/' element={<Accueil />} />
           <Route path='/equipe' element={< Equipe/>}/>
           <Route path='/conseil' element={<ActusConseils/>}/>
           <Route path='/catalogue' element={<Recherche/>}/>
           <Route path='/contact' element={<Contact />} />
           <Route path='/inscription' element={<Inscription/>} />
           <Route path='/connexion' element={<Connexion/>}/>
           <Route path='/publication' element={< Publication/>}/>
           <Route path='/profile' element={< ProfilePage /> }/>
           <Route path='/mes-publications' element={<MyPublications/>}/>
           <Route path='/Modif'element={<ModifierPublication/>} />
           < Route path='/detail' element={ <Details />}/>
        
        </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

export default App
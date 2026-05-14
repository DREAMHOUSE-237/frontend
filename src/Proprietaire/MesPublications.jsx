import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Home,
  Calendar,
  Loader2,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useNavigate , Link} from 'react-router-dom';
import { Mes_Publications, deletePublication } from '../service/auth_service';

const MyPublications = () => {
  const [publications, SetPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, SetError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const API_URL = "/api";
  const fetchData = async () => {

    try {
      setLoading(true);
      const data = await Mes_Publications();
      SetPublications(data);
    } catch (err) {
      SetError("Erreur de chargement des donnees.")
    } finally {
      setLoading(false)
    }

  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
      try {
        await deletePublication(id);
        SetPublications(publications.filter(p => p.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression")
      }
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin text-[~007b83]' size={40} />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* En-tête de la page */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes publications</h1>
            <p className="text-gray-500 text-sm">Gérez vos annonces immobilières</p>
          </div>
          <span className="bg-[#007b83]/10 text-[#007b83] px-4 py-2 rounded-full text-sm font-bold">
            {publications.length} Annonces
          </span>
        </div>

        {error && <div className='p-4 mb-4 text-red-700 bg-red-100 rounded-lg'>{error}</div>}

        {/* Liste des annonces */}
        <div className="space-y-4">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col sm:flex-row group hover:shadow-md transition-shadow"
            >
              {/* Image de l'annonce */}
              <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                <img
                  src={pub.images && pub.images.length > 0 ? `${API_URL}/PUBLICATION-SERVICE/uploads/${pub.images[0]}` : "api/placeholder/400/320"}
                  alt={pub.titreBien}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Détails de l'annonce */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{pub.titreBien}</h3>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-[#007b83]" /> {pub.quartier}, {pub.ville}
                      </span>
                      <span className="flex items-center gap-1">
                        <Home size={14} className="text-[#ff8800]" /> {pub.typeBienImmobilier}
                      </span>
                    </div>
                  </div>

                  {/* Menu d'actions (Trois points) */}
                  <div className="flex gap-2">
                    <Link to={`/modif/${pub.id}`}>
                      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit3 size={18} />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(pub.id)}
                      className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-colors">

                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Prix Mensuel</span>
                    <span className="text-xl font-black text-[#007b83]">{pub.prix?.toLocaleString()} <small className="text-xs">FCFA</small></span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Calendar size={14} />
                    Posté le {new Date(pub.datePublication).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* État vide si aucune publication */}
        {publications.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Aucune publication</h3>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore ajouté d'annonces.</p>
            <button
              onClick={() => navigate('/publication')} // Redirection ici
              className="bg-[#007b83] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Créer ma première annonce
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyPublications;
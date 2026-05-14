import axios from "axios";

const API_URL = "/api";

// connexion service Aut

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/AUTHENTIFICATION/login/`, {
            email,
            password
        });

        if (response.data && response.data.access) {
            const token = response.data.access;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            console.log("📦 Login response:", response.data);

            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));

                console.log("🔍 Token payload:", payload);

                // ✅ SOURCE PROPRE ET UNIQUE
                const realId =
                    response.data.user?.user_service_id ||
                    payload.user_service_id ||
                    payload.user_id;

                if (realId) {
                    localStorage.setItem('userId', realId);
                    console.log("✅ ID utilisateur stocké :", realId);
                }

            } catch (decodeError) {
                console.error("Erreur décodage JWT:", decodeError);
            }

            return response.data;
        }
    } catch (error) {
        throw error.response || new Error("Erreur serveur");
    }
};



// service publication


export const createAnnoce = async (data, images, position, adresse, documents) => {
    try {
        const formData = new FormData();
        const bienDTO = {
            titreBien: data.titreBien,
            superfie: parseFloat(data.superficie),
            nbrePiece: parseInt(data.nbrePiece),
            description: data.description,
            typeBienImmobilier: data.typeBienImmobilier,
            categorie: data.categorie,
            prix: parseFloat(data.prix),
            numeroPaiement: parseInt(data.numeroPaiement),
            typePublication: data.typePublication,
            adresse: {
                region: adresse.region,
                ville: adresse.ville,
                quartier: adresse.quartier,
                longitude: position.lng,
                lattitude: position.lat
            }
        };
        formData.append('bien', new Blob([JSON.stringify(bienDTO)], {
            type: 'application/json'
        }));

        images.forEach((img) => {
            formData.append('images', img);
        });
        if (documents && documents.length > 0) {
            documents.forEach((doc) => {
                formData.append("documents", doc);
            });

        }
        const response = await axios.post(`${API_URL}/PUBLICATION-SERVICE/api/biens`, formData);

        return response.data;
    }
    catch (error) {
        console.error("Erreur service publication:", error);
        throw error.response || new Error("Erreur lors de la publication");
    }

};

export const Mes_Publications = async () =>{
    try {
        const response = await axios.get(`${API_URL}/PUBLICATION-SERVICE/api/biens/mes-publications`);
        return response.data;

    } catch(error){
        console.error("Erreur lors de la recuperation des biens:", error);
        throw error.response?.data || new Error("Impossible de charger vos publications")

    }
};

export const deletePublication = async (id) => {
    await axios.delete(`${API_URL}/PUBLICATION-SERVICE/api/biens/${id}`);
}


export const updateAnnonce = async (id, formData, position) => {
  const data = new FormData();

  // 1. Le DTO (Données textuelles)
  const bienDTO = {
    titreBien: formData.titreBien,
    superfie: parseFloat(formData.superficie) || 0,
    nbrePiece: parseInt(formData.pieces) || 0,
    description: formData.description,
    prix: parseFloat(formData.prix) || 0,
    typePublication: formData.typePublication,
    typeBienImmobilier: formData.typeBienImmobilier,
    categorie: formData.categorie,
    adresse: {
      region: formData.region,
      ville: formData.ville,
      quartier: formData.quartier,
      lattitude: position.lat,
      longitude: position.lng
    }
  };

  // Ajout du JSON
  data.append('bien', new Blob([JSON.stringify(bienDTO)], { type: 'application/json' }));

  // 2. Ajout des nouvelles IMAGES uniquement
  if (formData.images) {
    formData.images.forEach((img) => {
      if (img instanceof File) {
        data.append('images', img);
      }
    });
  }

  // 3. Ajout des nouveaux DOCUMENTS uniquement
  if (formData.documents) {
    formData.documents.forEach((doc) => {
      if (doc instanceof File) {
        data.append('documents', doc); 
      }
    });
  }

  const response = await axios.put(`${API_URL}/PUBLICATION-SERVICE/api/biens/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};


export const getPublicationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/PUBLICATION-SERVICE/api/biens/${id}`);
    
    // Si ton backend renvoie directement l'objet, on le retourne
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du bien :", error);
    throw error;
  }
};


export const BienService = {
  // Récupérer toutes les offres
  getAll: async () => {
    const response = await fetch(`${API_URL}/PUBLICATION-SERVICE/api/biens`);
    if (!response.ok) throw new Error('Erreur lors du chargement');
    return await response.json();
  },

  // Recherche dynamique par critères
  search: async (filters) => {
    let url = `${API_URL}/PUBLICATION-SERVICE/api/biens`;
    
    // Construction de l'URL selon les filtres présents
    if (filters.ville && filters.prixMax) {
      url += `/search/ville-prix?ville=${filters.ville}&prix=${filters.prixMax}`;
    } else if (filters.categorie) {
      url += `/search/categorie?categorie=${filters.categorie}`;
    } else if (filters.ville) {
      url += `/search/ville?ville=${filters.ville}`;
    } else if (filters.prixMax) {
      url += `/search/prix-max?prix=${filters.prixMax}`;
    } else if (filters.quartier) {
      url += `/search/quartier?quartier=${filters.quartier}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erreur de recherche');
    return await response.json();
  },

  // Helper pour l'URL des images
  formatImageUrl: (imageName) => {
    return `${API_URL}/PUBLICATION-SERVICE/upload/${imageName}`;
  }
};
//user service  


export const registerUser = async (userData) => {
    try {
        const response = await axios.post(
            `${API_URL}/USER-SERVICE/users/register/`,
            userData,
            {
                headers: { "Content-Type": "application/json" }
            }
        );
        return response.data;
    } catch (error) {
        // Affiche l'erreur détaillée du backend dans la console
        console.error("Détails erreur Backend:", error.response?.data);
        throw error;
    }
};

export const submitIdentity = async (
    email,
    requested_role,
    cniRecto,
    cniVerso
) => {

    try {

        const formData = new FormData();

        formData.append("email", email);
        formData.append("requested_role", requested_role);

        if (cniRecto) {
            formData.append("cni_recto", cniRecto);
        }

        if (cniVerso) {
            formData.append("cni_verso", cniVerso);
        }

        const response = await axios.post(
            `${API_URL}/IDENTITTY/submit/`,
            formData
        );

        return response.data;

    } catch (error) {

        console.error("Erreur identité :", error);
        throw error.response?.data || error;
    }
};

export const getPendingIdentities = async () => {

    try {

        const response = await axios.get(
            `${API_URL}/IDENTITY/pending/`
        );

        return response.data;

    } catch (error) {

        console.error(error);

        throw error.response?.data || error;
    }
};

export const validateIdentity = async (
    identityId,
    data
) => {

    try {

        const response = await axios.post(

            `${API_URL}/IDENTITY/${identityId}/review/`,
            data

        );

        return response.data;

    } catch (error) {

        console.error(error);

        throw error.response?.data || error;
    }
};
export const getUserProfile = async () => {

    try {

        const token =
            localStorage.getItem("token");
        const userId =
            localStorage.getItem("userId");
        if (!userId || userId === "null") {
            throw new Error("ID utilisateur introuvable. Veuillez vous reconnecter.");
        }
        const response = await axios.get(

            `${API_URL}/USER-SERVICE/users/users/${userId}/profile/`,

            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(error);

        throw error.response?.data || error;
    }
};

// Fonction pour mettre à jour les infos de profil (Nom, Ville, Tel...)
export const updateProfile = async (profileData) => {
    try {
        const token = localStorage.getItem("token"); // Vérifie bien si c'est 'token' ou 'accessToken'
        const userId = localStorage.getItem("userId");

        const response = await axios.patch(
            `${API_URL}/USER-SERVICE/users/profiles/${userId}/`,
            profileData, // On envoie l'objet contenant nom, prenom, ville, etc.
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("TOKEN ENVOYÉ:", localStorage.getItem("token"));
console.log("ID UTILISÉ:", localStorage.getItem("userId"));
        return response.data;
    }catch (error) {
    // Affiche le message de Django (ex: "You do not have permission")
    console.error("Détails de la 403 :", error.response?.data); 
    throw error.response?.data || error;
}
};

// Fonction pour mettre à jour le MOT DE PASSE uniquement
export const updatePassword = async (current_password, new_password) => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const response = await axios.patch(
            `${API_URL}/USER-SERVICE/users/profiles/${userId}/`,
            {
                current_password: current_password,
                new_password: new_password
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response?.data || error;
    }
};
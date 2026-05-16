import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
                const realId = response.data.user?.user_service_id || payload.user_service_id || payload.user_id;

                if (realId) {
                    localStorage.setItem('userId', realId);
                    console.log("✅ ID utilisateur stocké :", realId);
                }
                localStorage.setItem('role', payload.role);
                localStorage.setItem('userServ', payload.user_service_id);
                const uuid = payload.user_id; 
                const emailUser = payload.email;

                if (uuid) {
                    localStorage.setItem('userid', uuid); 
                    localStorage.setItem('userEmail', emailUser);
                    console.log("✅ UUID (Microservices) stocké :", uuid);
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

// Fonction pour mettre à jour les infos de profil
export const updateProfile = async (profileData) => {
    try {
        const token = localStorage.getItem("token"); 
        const userId = localStorage.getItem("userId");

        const response = await axios.patch(
            `${API_URL}/USER-SERVICE/users/user/${userId}/modification/`,
            profileData, 
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
            `${API_URL}/USER-SERVICE/users/user/${userId}/modification/`,
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


// service commentaire 

export const CommentService = {
  getByPublication: async (publicationId) => {
    try {
      const uid = localStorage.getItem('userid');
      const uemail = localStorage.getItem('userEmail');
      if (!uid) return [];

      const response = await fetch(`${API_URL}/COMMENTARY-SERVICE/publications/${publicationId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': uid,
          'X-User-Email': uemail
        }
      });
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      return [];
    }
  },

  create: async (publicationId, content, parentId = null) => {
    const response = await fetch(`${API_URL}/COMMENTARY-SERVICE/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': localStorage.getItem('userid'),
        'X-User-Email': localStorage.getItem('userEmail')
      },
      body: JSON.stringify({ 
        publicationId: String(publicationId), 
        content: content.trim(), 
        parentId // [cite: 34, 35]
      })
    });
    return await response.json();
  },

  toggleLike: async (commentId) => {
    const response = await fetch(`${API_URL}/COMMENTARY-SERVICE/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'X-User-Id': localStorage.getItem('userid'),
        'X-User-Email': localStorage.getItem('userEmail')
      }
    });
    return await response.json(); // Renvoie {liked: boolean, likeCount: number} [cite: 173, 174]
  },

  // DELETE /comments/:id [cite: 145, 146]
  delete: async (commentId) => {
    const response = await fetch(`${API_URL}/COMMENTARY-SERVICE/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'X-User-Id': localStorage.getItem('userid'),
        'X-User-Email': localStorage.getItem('userEmail')
      }
    });
    return await response.json(); // Renvoie le statut 'tombstoned' ou 'deleted' [cite: 158]
  },

  // POST /comments (avec parentId) [cite: 23, 24, 34, 35]
  reply: async (publicationId, content, parentId) => {
    const response = await fetch(`${API_URL}/COMMENTARY-SERVICE/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': localStorage.getItem('userid'),
        'X-User-Email': localStorage.getItem('userEmail')
      },
      body: JSON.stringify({ 
        publicationId: String(publicationId), 
        content, 
        parentId // ID du commentaire auquel on répond [cite: 35]
      })
    });
    return await response.json();
  }
};

// Identity SErvice cote Admin 


export const IdentityAdminService = {
  getAllRequests: async () => {
    const response = await fetch(`${API_URL}/IDENTITY-SERVICE/identity/all/`);
    if (!response.ok) throw new Error("Erreur lors de la récupération");
    return await response.json();
  },

  getPendingRequests: async () => {
    const response = await fetch(`${API_URL}/IDENTITY-SERVICE/identity/pending/`);
    if (!response.ok) throw new Error("Erreur lors de la récupération");
    return await response.json();
  },

  getDetails: async (id) => {
    if (!id) {
    console.error("Erreur : recordId est undefined");
    return;
    }
    const response = await fetch(`${API_URL}/IDENTITY-SERVICE/identity/${id}/`);
    if (!response.ok) throw new Error("Erreur lors du chargement des détails");
    return await response.json();
  },

  reviewRequest: async (id, data) => {
    const response = await fetch(`${API_URL}/IDENTITY-SERVICE/identity/${id}/review/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
};

// Post de la cni pour verifier
export const IdentityService = {
  // Cette fonction gère l'inscription groupée avec les documents CNI
  registerWithIdentity: async (formData) => {
    const response = await fetch(`${API_URL}/IDENTITY-SERVICE/identity/submit/`, {
      method: 'POST',
      body: formData, // Contient email, role, password, cni_recto, cni_verso
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de l'inscription");
    }
    
    return await response.json(); // Retourne le statut : 'verified' (OCR OK) ou 'pending'
  },

  // Récupérer le statut via l'email
  checkMyStatus: async (email) => {
    const response = await fetch(`${API_URL}/IDENTITY-SERVICE/identity/status/?email=${email}`);
    if (!response.ok) throw new Error("Erreur lors de la récupération du statut");
    return await response.json();
  }
};

// admin 
export const AdminUserService = {
    // Liste tous les utilisateurs avec filtres optionnels
    getUsers: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/USER-SERVICE/users/admin/users/?${params}`);
        return await response.json();
    },

    // Changer le statut actif/banni d'un utilisateur
    updateUserStatus: async (userId, isActive) => {
        const response = await fetch(`${API_URL}/USER-SERVICE/users/admin/users/${userId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: isActive })
        });
        return await response.json();
    },

    // Validation finale CNI (Liaison User-Service)
    validateCNI: async (payload) => {
        const response = await fetch(`${API_URL}/USER-SERVICE/users/admin/validate-cni/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    }
};
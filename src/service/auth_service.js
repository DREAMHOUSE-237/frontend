import axios from "axios";

const API_URL = "/api";

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

export const createAnnoce = async (data, images, position, adresse, documents) => {
    try {
        const formData = new FormData();
        const bienDTO = {
            titreBien: data.titreBien,
            superfie: parseFloat(data.superficie),
            nbrePiece: parseInt(data.nbrePiece),
            description: data.description,
            categorie: data.categorie,
            prix: parseFloat(data.prix),
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
                formDataToSend.append("documents", doc);
            });

        }
        const response = await axios.post(`${API_URL}/PUBLICATION/api/biens`, formData);

        return response.data;
    }
    catch (error) {
        console.error("Erreur service publication:", error);
        throw error.response || new Error("Erreur lors de la publication");
    }

};

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
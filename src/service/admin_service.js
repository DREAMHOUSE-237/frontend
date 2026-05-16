import axios from "axios";

// L'URL de base inclut le préfixe configuré dans ton Gateway et ton urls.py
const API_URL = "/api/USER_SERVICE/users";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour ajouter le token à chaque requête admin
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const adminAPI = {
    // 1. Lister tous les utilisateurs
    // GET /api/USER_SERVICE/users/admin/users/
    getUsers: () => apiClient.get("/admin/users/"),

    // 2. Détails d'un utilisateur spécifique
    // GET /api/USER_SERVICE/users/admin/users/{id}/
    getUser: (id) => apiClient.get(`/admin/users/${id}/`),

    // 3. Modifier un utilisateur
    // PUT /api/USER_SERVICE/users/admin/users/{id}/
    updateUser: (id, data) => apiClient.put(`/admin/users/${id}/`, data),

    // 4. Supprimer un utilisateur
    // DELETE /api/USER_SERVICE/users/admin/users/{id}/
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}/`),

    // 5. Liste des utilisateurs en attente de validation CNI
    // GET /api/USER_SERVICE/users/admin/pending/
    getPendingUsers: () => apiClient.get("/admin/pending/"),

    // 6. Approuver ou Rejeter une CNI
    // POST /api/USER_SERVICE/users/admin/validate-cni/
    // Body attendu : { user_id: number, action: "approve" | "reject" }
    validateCNI: (data) => apiClient.post("/admin/validate-cni/", data),
};

export default adminAPI;
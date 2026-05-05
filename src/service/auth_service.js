import axios from "axios";

const API_URL = "/api/AUTHENTIFICATION";

export const login = async (email, password) =>{
    try {
         const response = await axios.post(`${API_URL}/login/`, {
            email: email,
            password : password
         });
         if(response.data.token){
            localStorage.setItem('user_token', response.data.token)
         }
    } catch (error){
        
        throw error.response || new Error ("Erreur serveur");
    }
   
}
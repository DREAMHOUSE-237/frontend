import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) =>{
    try {
         const response = await axios.post(`${API_URL}/AUTHENTIFICATION/login/`, {
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
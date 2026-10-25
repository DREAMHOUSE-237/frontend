import axios from "axios";

// Ajoute le token JWT à tous les appels vers le gateway (axios et fetch),
// y compris ceux qui ne le passaient pas explicitement. Le gateway s'en
// sert pour identifier l'utilisateur. Les appels vers d'autres domaines
// (OpenStreetMap, Cloudinary...) ne reçoivent jamais le token.

const API_URL = import.meta.env.VITE_API_URL;

const isApiCall = (url) =>
    Boolean(API_URL) && typeof url === "string" && url.startsWith(API_URL);

const bearer = () => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
};

axios.interceptors.request.use((config) => {
    const auth = bearer();
    if (auth && isApiCall(config.url) && !config.headers.Authorization) {
        config.headers.Authorization = auth;
    }
    return config;
});

const nativeFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url;
    const auth = bearer();
    if (!auth || !isApiCall(url)) {
        return nativeFetch(input, init);
    }
    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    if (!headers.has("Authorization")) {
        headers.set("Authorization", auth);
    }
    return nativeFetch(input, { ...init, headers });
};

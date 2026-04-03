import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Assurez-vous que le plugin tailwindcss est correctement importé
import tailwindcss from '@tailwindcss/vite' 


// Fonction de réécriture dynamique pour acheminer les requêtes
const createPathRewriter = () => (path) => {
    // 1. Gérer les requêtes d'AUTHENTIFICATION (/api/auth/...)
    if (path.startsWith('/api/auth')) {
        const newPath = path.replace(/^\/api/, '/AUTHENTIFICATION/api');
        console.log(`[PROXY] AUTHENTIFICATION: ${path} -> ${newPath}`);
        return newPath;
    }
    
    // 2. Gérer les requêtes DREAMHOUSE (/api/dreamhouse/...)
    if (path.startsWith('/api/biens')) {
        const newPath = path.replace(/^\/api/, '/DREAMHOUSE/api');
        console.log(`[PROXY] DREAMHOUSE: ${path} -> ${newPath}`);
        return newPath;
    }

    // Avertissement si un chemin /api n'est pas géré
    console.warn(`[PROXY] ATTENTION: Chemin /api non géré pour: ${path}`);
    return path; 
};


// Fonction de configuration des logs de proxy (pour le développement)
const setupProxyLogging = (proxy) => {
    proxy.on('error', (err, req, res) => {
        console.log('❌ Global Proxy error:', err.code, req.url);
    });
    proxy.on('proxyReq', (proxyReq, req, res) => {
        // Log de la requête sortante (utile pour le débogage)
        // Note: proxyReq.path contient le chemin RÉEÉCRIT
        console.log(`📤 Proxying Request: ${req.method} ${req.url} to target path: ${proxyReq.path}`);
    });
    proxy.on('proxyRes', (proxyRes, req, res) => {
        console.log(`📥 Proxy Response: ${proxyRes.statusCode} for URL: ${req.url}`);
    });
};


export default defineConfig(({ mode }) => ({ // Utiliser defineConfig avec un callback
    plugins: [
        react(),
        tailwindcss()
    ],
    server: {
        proxy: {
            // Clé unique '/api' pour intercepter toutes les requêtes d'API
            '/api': {
                target: 'http://192.168.172.81:8079',
                changeOrigin: true, // Nécessaire pour les hôtes virtuels et CORS
                secure: false, // À utiliser si l'API est en HTTP et non HTTPS
                
                // La fonction qui gère le routage dynamique
                rewrite: createPathRewriter(),
                
                // Configure les événements du proxy (pour le débogage en mode 'development')
                configure: (proxy, options) => {
                    // Les logs de proxy ne sont activés qu'en mode 'development' pour éviter la surcharge en production
                    if (mode === 'development') {
                        setupProxyLogging(proxy);
                    }
                },
            },
        }
    }
}));
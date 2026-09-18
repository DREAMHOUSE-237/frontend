# DREAMHOUSE237 — Frontend Web

Application web (React + Vite) de la plateforme immobilière **DREAMHOUSE237** (Cameroun).

## Stack

- React 19 / React Router 7
- Vite 7
- Tailwind CSS 4
- Axios (appels API vers le gateway backend)
- Leaflet / React-Leaflet (carte des biens)
- Lucide (icônes), qrcode.react

## Structure

```
src/
├── pages/          # Pages principales (catalogue, détail, auth, etc.)
├── Proprietaire/    # Espace propriétaire (publication de biens, paiement des frais)
├── admin/           # Espace administrateur
├── components/      # Composants réutilisables (dont Map/ pour la carte Leaflet)
├── service/         # Client Axios / appels API vers le gateway
└── App.jsx
```

## Backend

L'application consomme l'API via le **gateway** (`proxy-service`) de la plateforme, qui route vers chacun des microservices (`AUTHENTIFICATION`, `USER-SERVICE`, `PUBLICATION-SERVICE`, `COMMENTARY-SERVICE`, `PAYMENT-SERVICE`, `IDENTITY-SERVICE`). L'URL du gateway est configurée dans `src/service/`.

## Développement local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Déploiement

Déployé sur **Render** (`dreamhouse237.onrender.com`), indépendamment du pipeline Docker Swarm utilisé pour le backend (voir [`infrastructure`](https://github.com/DREAMHOUSE-237/infrastructure)).

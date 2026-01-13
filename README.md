# Track Front

Application web de suivi GPS en temps réel pour le tracking d'activités sportives, construite avec Vue 3, Vite et WebSocket.

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Structure du projet](#structure-du-projet)
- [Build et déploiement](#build-et-déploiement)

## Aperçu

Track Front est une application de tracking GPS permettant aux utilisateurs d'enregistrer leurs activités sportives en temps réel. L'application utilise une connexion WebSocket pour transmettre les données de position et offre une interface utilisateur moderne et réactive.

## Fonctionnalités

### Authentification
- Inscription et connexion utilisateur
- Gestion de session avec tokens JWT
- Protection des routes privées
- Déconnexion sécurisée

### Tracking GPS en temps réel
- Contrôles Start/Stop/Pause pour les activités
- Chronomètre en temps réel (format HH:MM:SS)
- Calcul de distance parcourue
- Transmission des positions GPS via WebSocket (intervalle de 5 secondes)
- Visualisation sur carte interactive (Mapbox)

### Gestion des activités
- Historique des activités enregistrées
- Visualisation détaillée de chaque activité
- Statistiques et métriques de performance
- Calendrier d'activités
- Tours (laps) et analyses de performance

### Profil utilisateur
- Gestion du profil personnel
- Galerie de photos
- Statistiques hebdomadaires et graphiques
- Communauté et interactions sociales

### Interface utilisateur
- Design moderne et responsive avec Tailwind CSS
- Mode clair/sombre
- Notifications toast pour les retours utilisateur
- Icônes Lucide
- Graphiques interactifs (ApexCharts)

## Technologies

### Framework et build
- **Vue 3** - Framework JavaScript progressif
- **Vite** - Build tool moderne et rapide
- **Vue Router** - Gestion des routes SPA

### UI et styling
- **Tailwind CSS 4** - Framework CSS utility-first
- **Lucide Vue Next** - Bibliothèque d'icônes

### Cartographie
- **Mapbox GL** - Rendu de cartes interactives
- **@mapbox/polyline** - Encodage/décodage de polylines
- **swiss-projection** - Conversion de coordonnées suisses

### Communication
- **wsmini** - Client WebSocket léger

### Visualisation de données
- **ApexCharts** - Graphiques interactifs
- **vue3-apexcharts** - Wrapper Vue pour ApexCharts

### Autres
- **Cloudinary** - Gestion et optimisation d'images
- **UUID** - Génération d'identifiants uniques
- **vite-plugin-pwa** - Support Progressive Web App

## Prérequis

- Node.js (version 18 ou supérieure recommandée)
- npm ou yarn
- Un compte Mapbox (pour la clé API)
- Un compte Cloudinary (pour l'upload d'images)

## Installation

1. Cloner le repository:
```bash
git clone <repository-url>
cd track-front
```

2. Installer les dépendances:
```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet avec les variables suivantes:

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Développement

Lancer le serveur de développement:

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (port par défaut de Vite).

### Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build l'application pour la production
- `npm run preview` - Prévisualise le build de production

## Structure du projet

```
track-front/
├── public/              # Fichiers statiques
├── src/
│   ├── assets/         # Images, styles globaux
│   ├── components/     # Composants Vue réutilisables
│   │   ├── Map.vue
│   │   ├── TheNavBar.vue
│   │   ├── ActivityCalendar.vue
│   │   ├── WeeklyChart.vue
│   │   └── ...
│   ├── views/          # Pages/vues de l'application
│   │   ├── Home.vue
│   │   ├── Tracking.vue
│   │   ├── Profile.vue
│   │   ├── ActivityDetail.vue
│   │   ├── Login.vue
│   │   └── Register.vue
│   ├── router/         # Configuration Vue Router
│   ├── services/       # Services API et WebSocket
│   ├── utils/          # Fonctions utilitaires
│   ├── App.vue         # Composant racine
│   └── main.js         # Point d'entrée de l'application
├── .env                # Variables d'environnement
├── index.html          # Template HTML
├── package.json        # Dépendances et scripts
├── tailwind.config.js  # Configuration Tailwind
└── vite.config.js      # Configuration Vite
```

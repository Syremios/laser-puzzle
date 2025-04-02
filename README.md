# Laser Puzzle Game

Ce projet est un jeu de puzzle de laser interactif composé de deux parties principales :
- Une interface frontend (laser-puzzle)
- Une API backend (api-laser-puzzle)

## Prérequis

- Node.js v18+ 
- npm v9+
- Bun v1.0.0+ (pour l'API)

## Structure du projet

```
laser-puzzle/
├── front/            # Code source du frontend
│   ├── src/          # Code source principal
│   │   ├── scenes/   # Scènes Phaser
│   │   └── class/    # Classes utilitaires
│   ├── static/       # Ressources statiques (images, etc.)
│   ├── index.js      # Point d'entrée du frontend
│   ├── index.html    # Page HTML principale
│   ├── package.json  # Dépendances du frontend
│   └── webpack.config.js # Configuration Webpack
│
└── api/              # Backend API
    ├── prisma/       # Modèles de base de données et scripts de seed
    ├── src/          # Code source de l'API
    │   ├── routes/   # Routes de l'API
    │   └── index.ts  # Point d'entrée de l'API
    └── package.json  # Dépendances de l'API
```

## Installation

### API Backend

1. Naviguez vers le dossier de l'API :
   ```
   cd laser-puzzle/api
   ```

2. Installez les dépendances :
   ```
   bun install
   ```

3. Configurez la base de données :
   ```
   bunx prisma generate
   bunx prisma migrate dev --name init
   ```

4. Remplissez la base de données avec des données initiales :
   ```
   bunx prisma db seed
   ```

### Frontend

1. Naviguez vers le dossier du frontend :
   ```
   cd laser-puzzle/front
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

## Démarrage

### API Backend

1. Naviguez vers le dossier de l'API :
   ```
   cd laser-puzzle/api
   ```

2. Démarrez le serveur de développement :
   ```
   bun run dev
   ```

   L'API sera accessible à l'adresse : http://localhost:3001

   Documentation Swagger disponible à : http://localhost:3001/swagger

### Frontend

1. Naviguez vers le dossier du frontend :
   ```
   cd laser-puzzle/front
   ```

2. Démarrez le serveur de développement :
   ```
   npm start
   ```

   Le jeu sera accessible à l'adresse : http://localhost:8080

## Fonctionnalités

### Frontend

- Sélection de niveaux
- Mode de jeu normal
- Mode créateur pour concevoir vos propres niveaux
- Interface utilisateur intuitive

### API Backend

- Gestion des niveaux
- Gestion des états de jeu
- Gestion des pièces
- Documentation Swagger intégrée

## Développement

### Frontend

Le frontend est construit avec :
- Phaser.js - Framework de jeu HTML5
- Webpack - Bundler
- ES6+ JavaScript

### API Backend

L'API est construite avec :
- Hono.js - Framework API léger
- Prisma - ORM pour la gestion de base de données
- SQLite - Base de données légère

## Licence

Ce projet est sous licence MIT.

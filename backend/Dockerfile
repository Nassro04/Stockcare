# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code source
COPY . .

# Construire l'application
RUN npm run build

# Stage 2: Créer l'image de production
FROM node:20-alpine

WORKDIR /app

# Copier package.json et package-lock.json pour les dépendances de production
COPY package*.json ./
RUN npm install --omit=dev

# Copier l'application construite depuis le stage précédent
COPY --from=builder /app/dist ./dist

# Exposer le port de l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "dist/main"]

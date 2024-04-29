# Verwende das offizielle Node.js 16 Image als Basis
FROM node:16

# Setze das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json (falls vorhanden)
COPY package*.json ./

# Installiere alle Abhängigkeiten
RUN npm install

# Kopiere alle Dateien aus dem Projektverzeichnis in das Arbeitsverzeichnis im Container
COPY . .

# Dein Container soll auf diesem Port lauschen (z.B. Port 3000)
EXPOSE 3000

# Befehl zum Starten der App
CMD ["node", "app.js"]

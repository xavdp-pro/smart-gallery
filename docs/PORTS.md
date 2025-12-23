# 🔌 Configuration des Ports

## Ports Utilisés

L'application utilise des ports non-standards pour éviter les collisions avec d'autres applications.

### Frontend (Vite)
- **Port:** `9999`
- **URL:** http://localhost:9999
- **Service:** Serveur de développement React + Vite
- **Proxy:** Redirige `/api` et `/uploads` vers le backend

### Backend (Express)
- **Port:** `8888`
- **URL:** http://localhost:8888
- **Service:** API REST + Serveur de fichiers
- **Endpoints:**
  - `GET /api/photos` - Liste des photos
  - `POST /api/photos/upload` - Upload photo
  - `GET /api/photos/:id` - Détails d'une photo
  - `GET /api/photos/:id/tags` - Tags d'une photo
  - `POST /api/photos/:id/tags` - Ajouter un tag
  - `DELETE /api/photos/:photoId/tags/:tagId` - Supprimer un tag
  - `GET /uploads/:filename` - Accès aux fichiers uploadés

## Pourquoi ces ports ?

### Ports Évités
- `3000` - Souvent utilisé par React, Next.js, autres apps Node.js
- `3001` - Port alternatif commun
- `5173` - Port par défaut de Vite
- `8080` - Port alternatif HTTP commun
- `8000` - Souvent utilisé par Python/Django

### Ports Choisis
- `9999` - Peu utilisé, facile à retenir
- `8888` - Peu utilisé, facile à retenir, souvent associé aux APIs

## Vérification des Ports

### Vérifier si les ports sont libres
```bash
# Vérifier le port 9999
lsof -i :9999

# Vérifier le port 8888
lsof -i :8888
```

### Libérer un port si nécessaire
```bash
# Tuer le processus sur le port 9999
fuser -k 9999/tcp

# Tuer le processus sur le port 8888
fuser -k 8888/tcp
```

## Changement de Ports

Si vous devez changer les ports, modifiez ces fichiers:

### 1. Backend (`server/index.js`)
```javascript
const PORT = 8888; // Changez ici
```

### 2. Frontend (`vite.config.js`)
```javascript
export default defineConfig({
  server: {
    port: 9999, // Port frontend
    proxy: {
      '/api': {
        target: 'http://localhost:8888', // Port backend
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8888', // Port backend
        changeOrigin: true,
      }
    }
  }
})
```

### 3. Documentation
Mettez à jour les URLs dans:
- `README.md`
- `QUICK_START.md`
- `STATUS.md`
- `TESTING_GUIDE.md`
- `test-app.sh`

## Firewall

Si vous utilisez un firewall, autorisez ces ports:

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 9999/tcp
sudo ufw allow 8888/tcp

# firewalld (CentOS/RHEL)
sudo firewall-cmd --add-port=9999/tcp --permanent
sudo firewall-cmd --add-port=8888/tcp --permanent
sudo firewall-cmd --reload
```

## Accès Réseau

Par défaut, l'application écoute sur `localhost` uniquement.

Pour permettre l'accès depuis d'autres machines:

### Backend (`server/index.js`)
```javascript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
```

### Frontend (`vite.config.js`)
```javascript
server: {
  host: '0.0.0.0',
  port: 9999,
  // ...
}
```

⚠️ **Attention:** N'exposez pas l'application sur Internet sans authentification!

## Résumé

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Frontend | 9999 | http://localhost:9999 | Interface React |
| Backend | 8888 | http://localhost:8888 | API Express |
| Proxy | - | http://localhost:9999/api | Via Vite |
| Uploads | - | http://localhost:9999/uploads | Via Vite |

✅ **Configuration actuelle testée et fonctionnelle!**

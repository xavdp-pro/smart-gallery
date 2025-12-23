# Changelog - Photo Manager

## Version 1.0.1 - 2025-09-30

### 🔌 Changement de Ports

**Modification des ports pour éviter les collisions avec d'autres applications**

#### Avant
- Frontend: `5173` (port par défaut Vite)
- Backend: `3001` (port commun Node.js)

#### Après
- Frontend: `9999` ✅
- Backend: `8888` ✅

#### Raisons du Changement
- Port 3000/3001 souvent utilisé par React, Next.js, autres apps
- Port 5173 est le port par défaut de Vite
- Ports 8888 et 9999 sont moins susceptibles d'être utilisés
- Faciles à retenir

#### Fichiers Modifiés
- ✅ `server/index.js` - Port backend changé à 8888
- ✅ `vite.config.js` - Port frontend changé à 9999, proxy mis à jour
- ✅ `README.md` - URLs mises à jour
- ✅ `QUICK_START.md` - URLs mises à jour
- ✅ `STATUS.md` - URLs mises à jour
- ✅ `TESTING_GUIDE.md` - URLs mises à jour
- ✅ `test-app.sh` - Script de test mis à jour
- ✅ `PORTS.md` - Nouveau fichier de documentation des ports

#### Tests
```bash
✅ Backend API (port 8888) - OK
✅ Frontend Vite (port 9999) - OK
✅ Proxy Vite - OK
✅ Base de données - OK
✅ Uploads directory - OK
✅ OpenAI configuration - OK
```

#### Migration
Aucune action requise pour les utilisateurs. Simplement:
1. Arrêter l'application: `pkill -f "concurrently"`
2. Redémarrer: `npm run dev`
3. Accéder à la nouvelle URL: http://localhost:9999

---

## Version 1.0.0 - 2025-09-30

### 🎉 Release Initiale

#### Fonctionnalités
- ✅ Upload de photos (JPG, PNG, GIF, WebP)
- ✅ Interface web 3 colonnes
- ✅ Liste de photos avec thumbnails
- ✅ Affichage photo en grand format
- ✅ Auto-tagging par IA (OpenAI Vision API)
- ✅ Ajout/suppression de tags manuels
- ✅ Base de données SQLite
- ✅ Design moderne TailwindCSS

#### Stack Technique
- React 18.2.0 + Vite 5.0.8
- Node.js + Express 4.18.2
- SQLite (sql.js 1.10.3)
- OpenAI API 4.20.1
- TailwindCSS 3.4.0
- Lucide React 0.294.0

#### Problèmes Résolus
- ✅ ERR_CONNECTION_REFUSED (URLs relatives)
- ✅ better-sqlite3 compilation (remplacé par sql.js)
- ✅ Port conflicts (nouveaux ports)

---

## Prochaines Versions (Roadmap)

### Version 1.1.0 (Futur)
- [ ] Recherche par tags
- [ ] Filtrage des photos
- [ ] Tri des photos (date, nom, taille)
- [ ] Pagination pour grandes collections
- [ ] Mode grille/liste

### Version 1.2.0 (Futur)
- [ ] Édition de photos (crop, rotate, filters)
- [ ] Albums/Collections
- [ ] Partage de photos
- [ ] Export de photos

### Version 2.0.0 (Futur)
- [ ] Authentification utilisateurs
- [ ] Multi-utilisateurs
- [ ] Permissions et rôles
- [ ] API publique
- [ ] Mode production (build optimisé)

---

**Dernière mise à jour:** 2025-09-30 21:38

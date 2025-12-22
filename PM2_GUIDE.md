# 🚀 Guide PM2 - Photo Manager

## ✅ Application en Production avec PM2

L'application tourne maintenant avec **PM2** (Process Manager 2) pour une gestion robuste et un redémarrage automatique.

### 📊 État Actuel

```bash
pm2 status
```

Résultat:
```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ photo-backend      │ fork     │ 0    │ online    │ 0%       │ 71.1mb   │
│ 1  │ photo-frontend     │ fork     │ 0    │ online    │ 0%       │ 134.4mb  │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

### 🔧 Configuration

**Fichier:** `ecosystem.config.cjs`

- **Backend:** Port 8888 (Express API)
- **Frontend:** Port 9999 (Vite dev server)
- **Mode:** Fork (pas cluster)
- **Auto-restart:** Oui
- **Logs:** `/apps/photo-v1/app/logs/`

### 📝 Commandes PM2

#### Gestion des Processus

```bash
# Voir le statut
pm2 status

# Démarrer l'application
pm2 start ecosystem.config.cjs

# Redémarrer tout
pm2 restart all

# Redémarrer un seul processus
pm2 restart photo-backend
pm2 restart photo-frontend

# Arrêter tout
pm2 stop all

# Arrêter un seul processus
pm2 stop photo-backend
pm2 stop photo-frontend

# Supprimer de PM2
pm2 delete all
pm2 delete photo-backend
```

#### Logs

```bash
# Voir tous les logs en temps réel
pm2 logs

# Logs d'un seul processus
pm2 logs photo-backend
pm2 logs photo-frontend

# Dernières 100 lignes
pm2 logs --lines 100

# Logs sans streaming (snapshot)
pm2 logs --nostream

# Vider les logs
pm2 flush
```

#### Monitoring

```bash
# Dashboard interactif
pm2 monit

# Informations détaillées
pm2 show photo-backend
pm2 show photo-frontend

# Liste des processus
pm2 list
```

### 🔄 Redémarrage Automatique

PM2 est configuré pour démarrer automatiquement au boot du serveur:

```bash
# Sauvegarder la configuration actuelle
pm2 save

# Vérifier le service systemd
systemctl status pm2-root

# Redémarrer le service PM2
systemctl restart pm2-root
```

### 📂 Fichiers de Logs

Les logs sont stockés dans `/apps/photo-v1/app/logs/`:

```
logs/
├── backend-error.log    # Erreurs du backend
├── backend-out.log      # Sortie standard du backend
├── frontend-error.log   # Erreurs du frontend
└── frontend-out.log     # Sortie standard du frontend
```

Consulter les logs:
```bash
# Backend
tail -f /apps/photo-v1/app/logs/backend-out.log
tail -f /apps/photo-v1/app/logs/backend-error.log

# Frontend
tail -f /apps/photo-v1/app/logs/frontend-out.log
tail -f /apps/photo-v1/app/logs/frontend-error.log
```

### 🔧 Mise à Jour de l'Application

Après avoir modifié le code:

```bash
cd /apps/photo-v1/app

# Redémarrer les processus
pm2 restart all

# Ou redémarrer individuellement
pm2 restart photo-backend  # Si changement backend
pm2 restart photo-frontend # Si changement frontend
```

### 🚨 Dépannage

#### Processus en erreur

```bash
# Voir les logs d'erreur
pm2 logs photo-backend --err --lines 50

# Redémarrer le processus
pm2 restart photo-backend

# Si ça ne fonctionne pas, supprimer et relancer
pm2 delete photo-backend
pm2 start ecosystem.config.cjs
```

#### Port déjà utilisé

```bash
# Vérifier les ports
lsof -i :8888
lsof -i :9999

# Tuer les processus sur ces ports
fuser -k 8888/tcp
fuser -k 9999/tcp

# Redémarrer PM2
pm2 restart all
```

#### Mémoire élevée

```bash
# Voir la consommation mémoire
pm2 status

# Redémarrer pour libérer la mémoire
pm2 restart all
```

### 📊 Monitoring Avancé

#### PM2 Plus (optionnel)

Pour un monitoring en ligne:
```bash
pm2 plus
```

#### Métriques

```bash
# CPU et mémoire en temps réel
pm2 monit

# Informations système
pm2 info photo-backend
```

### 🔐 Sécurité

#### Variables d'Environnement

Les variables d'environnement (comme `OPENAI_API_KEY`) sont chargées depuis `.env`:

```bash
# Vérifier les variables
pm2 env 0  # Backend
pm2 env 1  # Frontend
```

#### Permissions

PM2 tourne avec l'utilisateur `root`. En production, il est recommandé d'utiliser un utilisateur dédié.

### 🌐 Accès Public

**URL:** https://photo-v1.c9.ooo.ovh

Architecture:
```
Internet (HTTPS:443)
    ↓
Nginx
    ↓
Vite (localhost:9999) [PM2: photo-frontend]
    ↓ (proxy /api et /uploads)
Express (localhost:8888) [PM2: photo-backend]
```

### ✅ Tests

```bash
# Test local backend
curl http://localhost:8888/api/photos

# Test local frontend
curl http://localhost:9999

# Test public
curl https://photo-v1.c9.ooo.ovh
curl https://photo-v1.c9.ooo.ovh/api/photos
```

### 📋 Checklist de Déploiement

- [x] PM2 installé globalement
- [x] Configuration `ecosystem.config.cjs` créée
- [x] Mode fork configuré (pas cluster)
- [x] Logs configurés
- [x] Processus démarrés
- [x] Auto-restart au boot activé
- [x] Nginx configuré
- [x] Vite `allowedHosts` configuré
- [x] Site accessible publiquement
- [x] Tests réussis

### 🎉 Résumé

✅ **Backend:** Online sur port 8888
✅ **Frontend:** Online sur port 9999
✅ **PM2:** Gestion automatique des processus
✅ **Nginx:** Reverse proxy configuré
✅ **SSL:** Certificat Let's Encrypt actif
✅ **Public:** https://photo-v1.c9.ooo.ovh

**L'application est en production et prête à l'emploi!** 🚀

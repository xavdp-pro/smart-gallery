# 🌐 Configuration Nginx - Photo Manager

## Configuration Actuelle

**Fichier:** `/etc/nginx/sites-enabled/10-photo-v1.conf`

### Domaine
- **URL publique:** https://photo-v1.c9.ooo.ovh
- **SSL:** Certificat Let's Encrypt (géré par Certbot)

### Architecture

```
Internet (HTTPS)
    ↓
Nginx (port 443)
    ↓
Vite Dev Server (localhost:9999)
    ↓ (proxy interne /api et /uploads)
Express Backend (localhost:8888)
```

## Fonctionnalités Configurées

### ✅ Reverse Proxy
- Nginx redirige tout le trafic vers Vite (port 9999)
- Vite gère le proxy interne vers le backend (port 8888)

### ✅ WebSocket Support
- Hot Module Replacement (HMR) de Vite fonctionne
- Headers `Upgrade` et `Connection` configurés

### ✅ Upload de Photos
- Taille max: **20MB** (`client_max_body_size 20M`)
- Suffisant pour des photos haute résolution

### ✅ SSL/HTTPS
- Certificat Let's Encrypt
- Redirection automatique HTTP → HTTPS
- Configuration SSL sécurisée

### ✅ Headers de Sécurité
- `X-Real-IP`: IP réelle du client
- `X-Forwarded-For`: Chaîne de proxies
- `X-Forwarded-Proto`: Protocole (https)
- `Host`: Nom de domaine

### ✅ Timeouts
- Connect: 60 secondes
- Send: 60 secondes
- Read: 60 secondes
- Suffisant pour l'analyse IA des photos

## Configuration Détaillée

```nginx
server {
    server_name photo-v1.c9.ooo.ovh;
    
    # Uploads jusqu'à 20MB
    client_max_body_size 20M;
   
    # Proxy vers Vite
    location / {
        proxy_pass http://localhost:9999;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket pour HMR
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # SSL (Let's Encrypt)
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/photo-v1.c9.ooo.ovh/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/photo-v1.c9.ooo.ovh/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# Redirection HTTP → HTTPS
server {
    if ($host = photo-v1.c9.ooo.ovh) {
        return 301 https://$host$request_uri;
    }
    
    server_name photo-v1.c9.ooo.ovh;
    listen 80;
    return 404;
}
```

## Pourquoi Pas de Location /api ?

Vite gère déjà le proxy interne:
```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8888',
    changeOrigin: true,
  },
  '/uploads': {
    target: 'http://localhost:8888',
    changeOrigin: true,
  }
}
```

Donc:
1. Client → `https://photo-v1.c9.ooo.ovh/api/photos`
2. Nginx → `http://localhost:9999/api/photos`
3. Vite → `http://localhost:8888/api/photos`
4. Express traite la requête

## Commandes Utiles

### Tester la configuration
```bash
nginx -t
```

### Recharger Nginx
```bash
systemctl reload nginx
```

### Redémarrer Nginx
```bash
systemctl restart nginx
```

### Voir les logs
```bash
# Logs d'accès
tail -f /var/log/nginx/access.log

# Logs d'erreur
tail -f /var/log/nginx/error.log
```

### Vérifier le statut
```bash
systemctl status nginx
```

## Tester l'Application

### Depuis l'extérieur
```bash
curl -I https://photo-v1.c9.ooo.ovh
```

### Depuis le serveur
```bash
# Frontend via Nginx
curl -I https://photo-v1.c9.ooo.ovh

# Frontend direct
curl -I http://localhost:9999

# Backend direct
curl http://localhost:8888/api/photos
```

## Renouvellement SSL

Le certificat Let's Encrypt est géré par Certbot et se renouvelle automatiquement.

### Vérifier l'expiration
```bash
certbot certificates
```

### Renouveler manuellement
```bash
certbot renew
systemctl reload nginx
```

## Augmenter la Taille des Uploads

Si vous voulez autoriser des photos plus grandes:

```nginx
# Dans le bloc server
client_max_body_size 50M;  # Par exemple 50MB
```

Puis:
```bash
nginx -t
systemctl reload nginx
```

## Problèmes Courants

### 413 Request Entity Too Large
**Cause:** Photo trop grande
**Solution:** Augmenter `client_max_body_size`

### 502 Bad Gateway
**Cause:** Vite ou Express ne répond pas
**Solution:** 
```bash
# Vérifier que l'app tourne
ps aux | grep node
netstat -tlnp | grep -E "(9999|8888)"

# Redémarrer l'app
cd /apps/photo-v1/app
pkill -f "concurrently"
npm run dev
```

### 504 Gateway Timeout
**Cause:** Requête trop longue (analyse IA)
**Solution:** Augmenter les timeouts dans Nginx

### WebSocket ne fonctionne pas
**Cause:** Headers manquants
**Solution:** Vérifier `Upgrade` et `Connection "upgrade"`

## Sécurité

### Headers de Sécurité Recommandés

Ajouter dans le bloc `server`:
```nginx
# Sécurité
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# CSP (à adapter selon vos besoins)
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

### Rate Limiting

Pour éviter les abus:
```nginx
# Dans http block (/etc/nginx/nginx.conf)
limit_req_zone $binary_remote_addr zone=photolimit:10m rate=10r/s;

# Dans location /api
limit_req zone=photolimit burst=20 nodelay;
```

## Monitoring

### Logs en temps réel
```bash
# Toutes les requêtes
tail -f /var/log/nginx/access.log | grep photo-v1

# Uniquement les erreurs
tail -f /var/log/nginx/error.log | grep photo-v1
```

### Statistiques
```bash
# Nombre de requêtes
grep photo-v1 /var/log/nginx/access.log | wc -l

# Codes de statut
grep photo-v1 /var/log/nginx/access.log | awk '{print $9}' | sort | uniq -c
```

## Résumé

✅ **Configuration Nginx optimale pour:**
- Reverse proxy vers Vite (9999)
- Support WebSocket (HMR)
- Uploads de photos (20MB max)
- SSL/HTTPS sécurisé
- Timeouts adaptés pour l'IA

🌐 **Accès public:** https://photo-v1.c9.ooo.ovh

🔧 **Maintenance:** Configuration testée et rechargée avec succès!

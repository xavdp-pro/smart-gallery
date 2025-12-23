# 🚀 Configuration Rapide - Container c7.ooo.ovh

## 📍 Informations du Container

- **Domaine:** c7.ooo.ovh
- **Container:** c7
- **Account ID Cloudflare:** b2cc670177cfa83dc058e83375a4df49

---

## ⚡ Configuration en 3 Étapes

### 1️⃣ Créer un API Token Cloudflare

1. Va sur https://dash.cloudflare.com/profile/api-tokens
2. Clique **Create Token**
3. Utilise le template **"Edit Cloudflare Zero Trust"**
4. Ou crée un token personnalisé avec ces permissions:
   - **Account** → **Cloudflare Tunnel** → **Edit**
   - **Zone** → **DNS** → **Edit**
5. Copie le token généré

### 2️⃣ Configurer le Script

```bash
cd /apps/photo-v1/app

node cloudflare-tunnel-manager.js configure \
  b2cc670177cfa83dc058e83375a4df49 \
  TON_API_TOKEN_ICI \
  ton-email@example.com
```

**Exemple concret:**
```bash
node cloudflare-tunnel-manager.js configure \
  b2cc670177cfa83dc058e83375a4df49 \
  abc123xyz456token789 \
  admin@c7.ooo.ovh
```

### 3️⃣ Créer ton Premier Tunnel

```bash
# Pour l'application Photo Manager
node cloudflare-tunnel-manager.js create photo-app photo.c7.ooo.ovh 9999

# Pour une API
node cloudflare-tunnel-manager.js create api api.c7.ooo.ovh 8888

# Pour un autre service
node cloudflare-tunnel-manager.js create myapp myapp.c7.ooo.ovh 3000
```

---

## 🎯 Exemples de Tunnels pour c7.ooo.ovh

### Application Photo Manager
```bash
node cloudflare-tunnel-manager.js create photo-manager photo.c7.ooo.ovh 9999
```
**Résultat:** https://photo.c7.ooo.ovh → http://localhost:9999

### API Backend
```bash
node cloudflare-tunnel-manager.js create api-backend api.c7.ooo.ovh 8888
```
**Résultat:** https://api.c7.ooo.ovh → http://localhost:8888

### Admin Panel
```bash
node cloudflare-tunnel-manager.js create admin admin.c7.ooo.ovh 5000
```
**Résultat:** https://admin.c7.ooo.ovh → http://localhost:5000

### Site Principal
```bash
node cloudflare-tunnel-manager.js create main-site c7.ooo.ovh 80
```
**Résultat:** https://c7.ooo.ovh → http://localhost:80

---

## 📋 Commandes Utiles

```bash
# Lister tous les tunnels
node cloudflare-tunnel-manager.js list

# Voir le statut du service
node cloudflare-tunnel-manager.js status

# Voir les logs
node cloudflare-tunnel-manager.js logs

# Supprimer un tunnel
node cloudflare-tunnel-manager.js delete photo-manager
```

---

## 🔧 Vérifications

### Vérifier que cloudflared est installé
```bash
cloudflared --version
```

### Vérifier le service
```bash
sudo systemctl status cloudflared
```

### Tester la connexion locale
```bash
# Vérifier que ton app tourne
curl http://localhost:9999

# Vérifier l'API
curl http://localhost:8888/api/photos
```

### Tester l'accès public
```bash
# Une fois le tunnel créé
curl -I https://photo.c7.ooo.ovh
```

---

## 🎨 Sous-domaines Suggérés pour c7.ooo.ovh

| Sous-domaine | Usage | Port | Commande |
|--------------|-------|------|----------|
| `photo.c7.ooo.ovh` | Photo Manager | 9999 | `create photo-manager photo.c7.ooo.ovh 9999` |
| `api.c7.ooo.ovh` | API Backend | 8888 | `create api-backend api.c7.ooo.ovh 8888` |
| `admin.c7.ooo.ovh` | Admin Panel | 5000 | `create admin admin.c7.ooo.ovh 5000` |
| `app.c7.ooo.ovh` | Application principale | 3000 | `create main-app app.c7.ooo.ovh 3000` |
| `dev.c7.ooo.ovh` | Environnement dev | 4000 | `create dev-env dev.c7.ooo.ovh 4000` |
| `test.c7.ooo.ovh` | Tests | 5173 | `create test-env test.c7.ooo.ovh 5173` |

---

## 🚨 Troubleshooting

### Erreur: "Zone non trouvée"
```bash
# Vérifie que c7.ooo.ovh est bien dans ton compte Cloudflare
# Va sur https://dash.cloudflare.com et vérifie la liste des domaines
```

### Erreur: "Permission denied"
```bash
# Utilise sudo pour les opérations système
sudo node cloudflare-tunnel-manager.js create ...
```

### Le tunnel ne se connecte pas
```bash
# 1. Vérifier les logs
sudo journalctl -u cloudflared -f

# 2. Vérifier que l'app locale tourne
ps aux | grep node
netstat -tlnp | grep 9999

# 3. Redémarrer le service
sudo systemctl restart cloudflared
```

### DNS ne résout pas
```bash
# Attendre 2-5 minutes pour la propagation DNS
dig photo.c7.ooo.ovh

# Vérifier dans le dashboard Cloudflare
# DNS → Records → Chercher le CNAME
```

---

## 🎉 Workflow Complet pour c7.ooo.ovh

```bash
# 1. Configuration initiale (une seule fois)
cd /apps/photo-v1/app
node cloudflare-tunnel-manager.js configure \
  b2cc670177cfa83dc058e83375a4df49 \
  TON_API_TOKEN \
  admin@c7.ooo.ovh

# 2. Créer le tunnel pour Photo Manager
node cloudflare-tunnel-manager.js create photo-manager photo.c7.ooo.ovh 9999

# 3. Vérifier
node cloudflare-tunnel-manager.js status
node cloudflare-tunnel-manager.js logs

# 4. Tester
curl https://photo.c7.ooo.ovh

# 5. Lister tous les tunnels
node cloudflare-tunnel-manager.js list
```

---

## ✅ Checklist

- [ ] cloudflared installé (`cloudflared --version`)
- [ ] API Token Cloudflare créé
- [ ] Script configuré (`configure` command)
- [ ] Tunnel créé (`create` command)
- [ ] DNS CNAME vérifié dans Cloudflare dashboard
- [ ] Service cloudflared actif (`systemctl status cloudflared`)
- [ ] Application locale tourne (`curl localhost:9999`)
- [ ] Accès public fonctionne (`curl https://photo.c7.ooo.ovh`)

---

## 🌐 Résultat Final

Une fois configuré, tu auras:

✅ **Tunnel sécurisé** - Connexion chiffrée vers Cloudflare
✅ **SSL automatique** - Certificat HTTPS géré par Cloudflare
✅ **DNS automatique** - CNAME créé automatiquement
✅ **Pas de ports exposés** - Pas besoin d'ouvrir 80/443
✅ **Protection DDoS** - Incluse avec Cloudflare
✅ **IP cachée** - Le serveur reste invisible

**Ton app sera accessible sur:** https://photo.c7.ooo.ovh 🚀

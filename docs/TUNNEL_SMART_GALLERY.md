# 🎨 Tunnel Smart Gallery - Configuration

## ✅ Tunnel Créé avec Succès !

**Nom:** smart-gallery
**ID:** c78f0adf-48f1-41ca-bada-5d4b591e6ca4
**Hostname:** smart-gallery.xavdp.pro
**Port Local:** 9999

---

## 📋 Fichiers Créés

- ✅ **Credentials:** `/etc/cloudflared/c78f0adf-48f1-41ca-bada-5d4b591e6ca4.json`
- ✅ **Configuration:** `/etc/cloudflared/config.yml`

---

## 🌐 Configuration DNS Manuelle Requise

Le domaine `xavdp.pro` doit être configuré manuellement dans Cloudflare.

### **Option 1 : Via le Dashboard Cloudflare (Recommandé)**

1. Va sur https://dash.cloudflare.com
2. Sélectionne le domaine **xavdp.pro**
3. Va dans **DNS** → **Records**
4. Clique **Add record**
5. Configure :
   - **Type:** CNAME
   - **Name:** smart-gallery
   - **Target:** `c78f0adf-48f1-41ca-bada-5d4b591e6ca4.cfargotunnel.com`
   - **Proxy status:** Proxied (nuage orange activé ☁️)
   - **TTL:** Auto
6. Clique **Save**

### **Option 2 : Via l'API (si tu as accès au domaine)**

```bash
# Récupérer la Zone ID de xavdp.pro
curl -X GET "https://api.cloudflare.com/client/v4/zones?name=xavdp.pro" \
  -H "Authorization: Bearer z15vIgyK_7B2AILgVq0j_NKl2U9TwqLVvZqMHr5U" \
  -H "Content-Type: application/json"

# Créer le CNAME (remplace ZONE_ID par la vraie valeur)
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/dns_records" \
  -H "Authorization: Bearer z15vIgyK_7B2AILgVq0j_NKl2U9TwqLVvZqMHr5U" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CNAME",
    "name": "smart-gallery",
    "content": "c78f0adf-48f1-41ca-bada-5d4b591e6ca4.cfargotunnel.com",
    "ttl": 1,
    "proxied": true
  }'
```

---

## 🔧 Démarrer le Service

### Installer et démarrer cloudflared

```bash
# Installer le service
sudo cloudflared service install

# Démarrer le service
sudo systemctl start cloudflared

# Activer au démarrage
sudo systemctl enable cloudflared

# Vérifier le statut
sudo systemctl status cloudflared
```

### Voir les logs

```bash
# Logs en temps réel
sudo journalctl -u cloudflared -f

# Dernières 50 lignes
sudo journalctl -u cloudflared -n 50
```

---

## ✅ Vérifications

### 1. Vérifier que l'application locale tourne

```bash
# Frontend (Vite)
curl http://localhost:9999

# Backend (Express)
curl http://localhost:8888/api/photos

# Vérifier les processus
pm2 status
```

### 2. Vérifier le service cloudflared

```bash
sudo systemctl status cloudflared
```

Tu devrais voir :
```
● cloudflared.service - cloudflared
   Loaded: loaded
   Active: active (running)
```

### 3. Vérifier les logs

```bash
sudo journalctl -u cloudflared -n 20
```

Tu devrais voir :
```
Connection established
Registered tunnel connection
```

### 4. Tester le DNS (après configuration)

```bash
# Attendre 2-5 minutes pour la propagation
dig smart-gallery.xavdp.pro

# Devrait retourner un CNAME vers *.cfargotunnel.com
```

### 5. Tester l'accès public

```bash
curl -I https://smart-gallery.xavdp.pro
```

---

## 🎯 Configuration Actuelle

### Fichier `/etc/cloudflared/config.yml`

```yaml
tunnel: c78f0adf-48f1-41ca-bada-5d4b591e6ca4
credentials-file: /etc/cloudflared/c78f0adf-48f1-41ca-bada-5d4b591e6ca4.json

ingress:
  - hostname: smart-gallery.xavdp.pro
    service: http://localhost:9999
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

---

## 🔄 Architecture

```
Internet (HTTPS)
    ↓
Cloudflare (smart-gallery.xavdp.pro)
    ↓
Cloudflare Tunnel (c78f0adf-48f1-41ca-bada-5d4b591e6ca4)
    ↓
Vite Dev Server (localhost:9999)
    ↓ (proxy interne /api et /uploads)
Express Backend (localhost:8888)
    ↓
SQLite Database + Uploads
```

---

## 🚨 Troubleshooting

### Le tunnel ne se connecte pas

```bash
# 1. Vérifier les logs
sudo journalctl -u cloudflared -f

# 2. Redémarrer le service
sudo systemctl restart cloudflared

# 3. Vérifier la config
cat /etc/cloudflared/config.yml

# 4. Tester manuellement
sudo cloudflared tunnel --config /etc/cloudflared/config.yml run c78f0adf-48f1-41ca-bada-5d4b591e6ca4
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que l'app tourne
curl http://localhost:9999

# Vérifier PM2
pm2 status
pm2 logs

# Redémarrer l'app si nécessaire
pm2 restart all
```

### DNS ne résout pas

```bash
# Vérifier le CNAME dans Cloudflare Dashboard
# Attendre 5-10 minutes pour la propagation

# Tester
dig smart-gallery.xavdp.pro
nslookup smart-gallery.xavdp.pro
```

---

## 📝 Checklist Finale

- [ ] Tunnel créé : `c78f0adf-48f1-41ca-bada-5d4b591e6ca4` ✅
- [ ] Credentials créés : `/etc/cloudflared/*.json` ✅
- [ ] Configuration créée : `/etc/cloudflared/config.yml` ✅
- [ ] DNS CNAME configuré dans Cloudflare Dashboard
- [ ] Service cloudflared installé
- [ ] Service cloudflared démarré
- [ ] Application locale tourne (PM2)
- [ ] Logs cloudflared OK (Connection established)
- [ ] DNS résout correctement
- [ ] Accès HTTPS fonctionne

---

## 🎉 Résultat Final

Une fois le DNS configuré, ton application sera accessible sur :

**https://smart-gallery.xavdp.pro** 🚀

- ✅ SSL/TLS automatique (Cloudflare)
- ✅ Protection DDoS
- ✅ IP serveur cachée
- ✅ Pas de ports exposés
- ✅ Tunnel sécurisé chiffré

# 🚀 Configuration Cloudflare Tunnel - Guide Rapide

Ce guide explique comment configurer un Cloudflare Tunnel sur une nouvelle instance en utilisant un token.

## 📋 Prérequis

- Une machine Linux (Ubuntu/Debian recommandé)
- Accès root ou sudo
- Connexion internet

---

## 🔧 Installation de cloudflared

### Option 1 : Via le script officiel (recommandé)

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb
```

### Option 2 : Via apt (Debian/Ubuntu)

```bash
# Ajouter le dépôt Cloudflare
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared focal main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

# Installer
sudo apt update
sudo apt install cloudflared
```

---

## 🎫 Token du Tunnel c7 (smart-gallery.xavdp.pro)

```
eyJhIjoiYjJjYzY3MDE3N2NmYTgzZGMwNThlODMzNzVhNGRmNDkiLCJ0IjoiZGI4YzM3MjgtNDA2NS00NzM0LWFiMGQtODdhZjljODQ4NWVhIiwicyI6IllqZ3dORFJrWkdRdE1XRmlZeTAwT0dReUxUZzBNRGt0WkRObVl6Y3dOR1ZsTXpBMiJ9
```

**Informations du tunnel :**
- **Nom** : c7
- **ID** : `db8c3728-4065-4734-ab0d-87af9c8485ea`
- **Hostname** : `smart-gallery.xavdp.pro`
- **Service local** : `http://localhost:9999`

---

## 🚀 Démarrage Rapide (avec token)

### 1. Lancer le tunnel manuellement

```bash
cloudflared tunnel run --token eyJhIjoiYjJjYzY3MDE3N2NmYTgzZGMwNThlODMzNzVhNGRmNDkiLCJ0IjoiZGI4YzM3MjgtNDA2NS00NzM0LWFiMGQtODdhZjljODQ4NWVhIiwicyI6IllqZ3dORFJrWkdRdE1XRmlZeTAwT0dReUxUZzBNRGt0WkRObVl6Y3dOR1ZsTXpBMiJ9
```

### 2. Installer comme service systemd

```bash
sudo cloudflared service install eyJhIjoiYjJjYzY3MDE3N2NmYTgzZGMwNThlODMzNzVhNGRmNDkiLCJ0IjoiZGI4YzM3MjgtNDA2NS00NzM0LWFiMGQtODdhZjljODQ4NWVhIiwicyI6IllqZ3dORFJrWkdRdE1XRmlZeTAwT0dReUxUZzBNRGt0WkRObVl6Y3dOR1ZsTXpBMiJ9
```

### 3. Gérer le service

```bash
# Démarrer
sudo systemctl start cloudflared

# Arrêter
sudo systemctl stop cloudflared

# Redémarrer
sudo systemctl restart cloudflared

# Voir le statut
sudo systemctl status cloudflared

# Voir les logs
sudo journalctl -u cloudflared -f
```

---

## 📝 Configuration Manuelle (alternative)

Si tu préfères utiliser un fichier de configuration au lieu du token :

### 1. Créer le dossier de configuration

```bash
mkdir -p ~/.cloudflared
```

### 2. Créer le fichier de credentials

```bash
cat > ~/.cloudflared/db8c3728-4065-4734-ab0d-87af9c8485ea.json << 'EOF'
{
  "AccountTag": "b2cc670177cfa83dc058e83375a4df49",
  "TunnelSecret": "<SECRET>",
  "TunnelID": "db8c3728-4065-4734-ab0d-87af9c8485ea"
}
EOF
```

### 3. Créer le fichier config.yml

```bash
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: db8c3728-4065-4734-ab0d-87af9c8485ea
credentials-file: /root/.cloudflared/db8c3728-4065-4734-ab0d-87af9c8485ea.json

ingress:
  - hostname: smart-gallery.xavdp.pro
    service: http://localhost:9999
    originRequest:
      noTLSVerify: true
  - service: http_status:404
EOF
```

### 4. Lancer le tunnel

```bash
cloudflared tunnel run c7
```

---

## 🔄 Créer un Nouveau Tunnel

Pour créer un nouveau tunnel sur une autre instance :

### 1. Se connecter à Cloudflare

```bash
cloudflared tunnel login
```

### 2. Créer le tunnel

```bash
cloudflared tunnel create mon-nouveau-tunnel
```

### 3. Configurer le DNS

```bash
cloudflared tunnel route dns mon-nouveau-tunnel mon-app.xavdp.pro
```

### 4. Créer la configuration

```bash
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: mon-app.xavdp.pro
    service: http://localhost:3000
  - service: http_status:404
EOF
```

### 5. Installer comme service

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

---

## 🛠️ Commandes Utiles

```bash
# Lister les tunnels
cloudflared tunnel list

# Voir les infos d'un tunnel
cloudflared tunnel info c7

# Supprimer un tunnel
cloudflared tunnel delete mon-tunnel

# Tester la connexion
curl -I https://smart-gallery.xavdp.pro
```

---

## 🔐 API Token Cloudflare

Pour gérer les tunnels via l'API, utilise ce token :

```
GzRejy4FLxeaaIRcaYIYcANVCxN8U5glc9oug6Aq
```

**Account ID** : `b2cc670177cfa83dc058e83375a4df49`

### Exemple d'appel API

```bash
# Lister les tunnels
curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/b2cc670177cfa83dc058e83375a4df49/cfd_tunnel" \
  -H "Authorization: Bearer GzRejy4FLxeaaIRcaYIYcANVCxN8U5glc9oug6Aq" \
  -H "Content-Type: application/json"

# Obtenir le token d'un tunnel
curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/b2cc670177cfa83dc058e83375a4df49/cfd_tunnel/<TUNNEL_ID>/token" \
  -H "Authorization: Bearer GzRejy4FLxeaaIRcaYIYcANVCxN8U5glc9oug6Aq" \
  -H "Content-Type: application/json"
```

---

## ⚠️ Notes Importantes

1. **Un tunnel = une instance** : Chaque machine doit avoir son propre tunnel
2. **Token sensible** : Ne partage jamais le token publiquement
3. **Service systemd** : Recommandé pour la production (redémarrage auto)
4. **WebSockets** : Cloudflare Tunnel supporte les WebSockets nativement via HTTP

---

## 📞 Dépannage

### Le tunnel ne démarre pas

```bash
# Vérifier les logs
sudo journalctl -u cloudflared -n 50

# Vérifier que le port local est accessible
curl http://localhost:9999
```

### Erreur 502 Bad Gateway

- Vérifier que l'application locale est démarrée
- Vérifier le port dans la configuration

### Erreur 403 Forbidden

- Ajouter le hostname dans `allowedHosts` de Vite (si applicable)

---

*Dernière mise à jour : 22 décembre 2025*

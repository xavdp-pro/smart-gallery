# 🌐 Gestion Automatique des Tunnels Cloudflare

## 🚀 Script de Gestion Automatisé

J'ai créé un script Node.js qui permet de gérer automatiquement les tunnels Cloudflare via l'API.

---

## 📦 Installation

### 1. Rendre le script exécutable

```bash
cd /apps/photo-v1/app
chmod +x cloudflare-tunnel-manager.js
```

### 2. Créer un alias (optionnel)

```bash
# Ajouter à ~/.bashrc ou ~/.zshrc
echo "alias cftunnel='node /apps/photo-v1/app/cloudflare-tunnel-manager.js'" >> ~/.bashrc
source ~/.bashrc

# Maintenant tu peux utiliser:
cftunnel list
```

---

## ⚙️ Configuration Initiale

### 1. Obtenir les credentials Cloudflare

**Account ID:**
1. Va sur https://dash.cloudflare.com
2. Clique sur ton compte
3. Dans l'URL, copie l'ID après `/accounts/`
4. Ou va dans **Workers & Pages** → copie l'Account ID

**API Token:**
1. Va sur https://dash.cloudflare.com/profile/api-tokens
2. Clique **Create Token**
3. Utilise le template **"Edit Cloudflare Zero Trust"**
4. Ou crée un token personnalisé avec:
   - **Account** → **Cloudflare Tunnel** → **Edit**
   - **Zone** → **DNS** → **Edit**
5. Copie le token

### 2. Configurer le script

```bash
node cloudflare-tunnel-manager.js configure \
  <ACCOUNT_ID> \
  <API_TOKEN> \
  <EMAIL>
```

**Exemple:**
```bash
node cloudflare-tunnel-manager.js configure \
  b2cc670177cfa83dc058e83375a4df49 \
  your_api_token_here \
  admin@example.com
```

✅ Cela crée le fichier `.cloudflare-config.json` avec tes credentials.

---

## 🎯 Utilisation

### Créer un Tunnel Automatiquement

```bash
node cloudflare-tunnel-manager.js create <nom> <hostname> [port]
```

**Exemples:**

```bash
# Créer un tunnel pour l'app photo sur port 9999
node cloudflare-tunnel-manager.js create photo-app photo-v1.c9.ooo.ovh 9999

# Créer un tunnel pour une API sur port 8888
node cloudflare-tunnel-manager.js create api-backend api.c9.ooo.ovh 8888

# Créer un tunnel pour un site web sur port 3000
node cloudflare-tunnel-manager.js create my-website site.example.com 3000
```

**Ce que fait le script automatiquement:**
1. ✅ Crée le tunnel via l'API Cloudflare
2. ✅ Génère les credentials (`/etc/cloudflared/<tunnel-id>.json`)
3. ✅ Crée la configuration (`/etc/cloudflared/config.yml`)
4. ✅ Crée l'enregistrement DNS CNAME automatiquement
5. ✅ Installe et démarre le service systemd
6. ✅ Sauvegarde la config localement

**Résultat:**
```
🚀 Création du tunnel "photo-app"...
✅ Tunnel créé: abc123-def456-ghi789
✅ Credentials créés: /etc/cloudflared/abc123-def456-ghi789.json
✅ Configuration créée: /etc/cloudflared/config.yml
📝 Création de l'enregistrement DNS...
✅ DNS configuré: photo-v1.c9.ooo.ovh → abc123-def456-ghi789.cfargotunnel.com
🔧 Installation du service...
✅ Service démarré
✅ Configuration sauvegardée

🎉 Tunnel "photo-app" créé avec succès !
   URL: https://photo-v1.c9.ooo.ovh
   Local: http://localhost:9999
   ID: abc123-def456-ghi789
```

---

### Lister les Tunnels

```bash
node cloudflare-tunnel-manager.js list
```

**Résultat:**
```
📋 Tunnels Cloudflare:

   🔹 photo-app
      ID: abc123-def456-ghi789
      Status: active
      Hostname: photo-v1.c9.ooo.ovh
      Port: 9999

   🔹 api-backend
      ID: xyz789-abc123-def456
      Status: active
      Hostname: api.c9.ooo.ovh
      Port: 8888
```

---

### Supprimer un Tunnel

```bash
node cloudflare-tunnel-manager.js delete <nom|id>
```

**Exemples:**
```bash
# Par nom
node cloudflare-tunnel-manager.js delete photo-app

# Par ID
node cloudflare-tunnel-manager.js delete abc123-def456-ghi789
```

**Ce que fait le script:**
1. ✅ Supprime le tunnel de Cloudflare
2. ✅ Supprime les credentials locaux
3. ✅ Met à jour la config locale

---

### Voir le Statut du Service

```bash
node cloudflare-tunnel-manager.js status
```

---

### Voir les Logs

```bash
node cloudflare-tunnel-manager.js logs
```

---

## 📝 Fichier de Configuration

Le script crée automatiquement `.cloudflare-config.json`:

```json
{
  "accountId": "b2cc670177cfa83dc058e83375a4df49",
  "apiToken": "your_api_token_here",
  "email": "admin@example.com",
  "tunnels": [
    {
      "id": "abc123-def456-ghi789",
      "name": "photo-app",
      "hostname": "photo-v1.c9.ooo.ovh",
      "localPort": 9999,
      "createdAt": "2025-12-21T21:30:00.000Z"
    }
  ]
}
```

⚠️ **Sécurité:** Ce fichier contient ton API token. Ne le partage jamais !

---

## 🎯 Cas d'Usage Complets

### Exemple 1: Créer un tunnel pour l'app Photo Manager

```bash
# 1. Configurer (une seule fois)
node cloudflare-tunnel-manager.js configure \
  b2cc670177cfa83dc058e83375a4df49 \
  ton_api_token \
  admin@example.com

# 2. Créer le tunnel
node cloudflare-tunnel-manager.js create photo-manager photo-v1.c9.ooo.ovh 9999

# 3. Vérifier
node cloudflare-tunnel-manager.js status
node cloudflare-tunnel-manager.js logs

# 4. Tester
curl https://photo-v1.c9.ooo.ovh
```

### Exemple 2: Créer plusieurs tunnels

```bash
# App principale
node cloudflare-tunnel-manager.js create main-app app.example.com 3000

# API
node cloudflare-tunnel-manager.js create api api.example.com 8000

# Admin panel
node cloudflare-tunnel-manager.js create admin admin.example.com 5000

# Lister tous
node cloudflare-tunnel-manager.js list
```

---

## 🔧 Commandes Système Utiles

```bash
# Redémarrer le service
sudo systemctl restart cloudflared

# Voir les logs en temps réel
sudo journalctl -u cloudflared -f

# Arrêter le service
sudo systemctl stop cloudflared

# Démarrer le service
sudo systemctl start cloudflared

# Désactiver le service
sudo systemctl disable cloudflared
```

---

## 🐛 Troubleshooting

### Erreur: "Account ID manquant"
```bash
# Reconfigurer
node cloudflare-tunnel-manager.js configure <account_id> <api_token> <email>
```

### Erreur: "Zone non trouvée"
- Vérifie que le domaine existe dans Cloudflare
- Vérifie que l'API token a les permissions DNS

### Erreur: "Permission denied"
```bash
# Utiliser sudo pour les fichiers /etc/cloudflared/
sudo node cloudflare-tunnel-manager.js create ...
```

### Le tunnel ne se connecte pas
```bash
# Vérifier les logs
node cloudflare-tunnel-manager.js logs

# Vérifier que l'app locale tourne
curl http://localhost:9999

# Redémarrer le service
sudo systemctl restart cloudflared
```

---

## 🚀 Workflow Complet

### Pour toi, quand tu me demandes de créer un tunnel:

**Tu dis:** "Crée-moi un tunnel pour mon app sur le port 3000 avec le hostname myapp.example.com"

**Je fais automatiquement:**
```bash
node cloudflare-tunnel-manager.js create myapp myapp.example.com 3000
```

**Résultat en 30 secondes:**
- ✅ Tunnel créé
- ✅ DNS configuré
- ✅ Service démarré
- ✅ Accessible sur https://myapp.example.com

---

## 📊 Avantages

✅ **Automatisation complète** - Plus besoin de configuration manuelle
✅ **Gestion DNS automatique** - CNAME créé automatiquement
✅ **Multi-tunnels** - Gère plusieurs tunnels facilement
✅ **Historique** - Garde trace de tous les tunnels créés
✅ **Sécurisé** - Utilise l'API officielle Cloudflare
✅ **Rapide** - Création en moins d'une minute

---

## 🎉 Résumé

**Commandes principales:**

```bash
# Configuration (une fois)
node cloudflare-tunnel-manager.js configure <account_id> <api_token> <email>

# Créer un tunnel (à la demande)
node cloudflare-tunnel-manager.js create <nom> <hostname> <port>

# Lister
node cloudflare-tunnel-manager.js list

# Supprimer
node cloudflare-tunnel-manager.js delete <nom>

# Statut
node cloudflare-tunnel-manager.js status

# Logs
node cloudflare-tunnel-manager.js logs
```

**Maintenant, dis-moi juste:**
- Le nom du tunnel
- Le hostname souhaité
- Le port local

**Et je m'occupe du reste automatiquement !** 🚀✨

# 🔧 Configuration DNS pour smart-gallery.xavdp.pro

## 📊 Situation Actuelle

- ✅ Tunnel "c7" actif et connecté (ID: `db8c3728-4065-4734-ab0d-87af9c8485ea`)
- ✅ Service cloudflared en cours d'exécution
- ✅ Application locale sur port 9999 fonctionne
- ❌ DNS pointe vers l'ancien tunnel "smart-gallery" (supprimé)

## 🎯 Solution : Reconfigurer le DNS

### **Option 1 : Via Dashboard Cloudflare (Recommandé)**

1. Va sur https://dash.cloudflare.com
2. Sélectionne le domaine **xavdp.pro**
3. Va dans **DNS** → **Records**
4. Cherche l'enregistrement **smart-gallery**
5. **Supprime** l'ancien enregistrement CNAME
6. **Crée** un nouvel enregistrement :
   - **Type:** CNAME
   - **Name:** smart-gallery
   - **Target:** `db8c3728-4065-4734-ab0d-87af9c8485ea.cfargotunnel.com`
   - **Proxy status:** ☁️ Proxied (orange)
   - **TTL:** Auto
7. Clique **Save**

### **Option 2 : Via Zero Trust Dashboard**

1. Va sur https://one.dash.cloudflare.com
2. Sélectionne ton compte
3. **Networks** → **Tunnels**
4. Clique sur le tunnel **c7**
5. Onglet **Public Hostnames**
6. Clique **Add a public hostname**
7. Configure :
   - **Subdomain:** smart-gallery
   - **Domain:** xavdp.pro
   - **Type:** HTTP
   - **URL:** localhost:9999
8. Clique **Save hostname**

---

## ✅ Après Configuration DNS

Attends 2-5 minutes pour la propagation, puis teste :

```bash
# Vérifier le DNS
dig smart-gallery.xavdp.pro

# Tester l'accès
curl -I https://smart-gallery.xavdp.pro
```

Tu devrais voir un HTTP 200 au lieu de 530.

---

## 🔍 Informations du Tunnel c7

- **ID:** db8c3728-4065-4734-ab0d-87af9c8485ea
- **CNAME Target:** db8c3728-4065-4734-ab0d-87af9c8485ea.cfargotunnel.com
- **Status:** Active (4 connexions)
- **Locations:** ams07, ams15, cdg09

---

## 📝 Commandes Utiles

```bash
# Voir les tunnels
cloudflared tunnel list

# Info tunnel c7
cloudflared tunnel info c7

# Logs du service
journalctl -u cloudflared -f

# Redémarrer le service
systemctl restart cloudflared
```

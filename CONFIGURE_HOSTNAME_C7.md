# 🎯 Configuration Finale - smart-gallery.xavdp.pro

## ✅ Tunnel c7 Actif

- **ID:** db8c3728-4065-4734-ab0d-87af9c8485ea
- **Status:** Active (4 connexions)
- **Service:** cloudflared en cours d'exécution

## 🔧 Configuration du Hostname (2 minutes)

### **Étape 1 : Accéder au Dashboard Zero Trust**

1. Va sur https://one.dash.cloudflare.com
2. Sélectionne ton compte
3. Menu **Networks** → **Tunnels**

### **Étape 2 : Configurer le Tunnel c7**

1. Clique sur le tunnel **c7** dans la liste
2. Va dans l'onglet **Public Hostnames**
3. Clique sur **Add a public hostname**

### **Étape 3 : Ajouter le Hostname**

Configure les champs suivants :

**Public hostname:**
- **Subdomain:** `smart-gallery`
- **Domain:** `xavdp.pro` (sélectionne dans la liste)
- **Path:** (laisse vide)

**Service:**
- **Type:** `HTTP`
- **URL:** `localhost:9999`

**Additional application settings:** (optionnel)
- **No TLS Verify:** ✅ Coché (car localhost)

4. Clique **Save hostname**

---

## ✅ Vérification

Après avoir sauvegardé, attends 30 secondes puis teste :

```bash
# Vérifier le DNS
dig smart-gallery.xavdp.pro

# Tester l'accès
curl -I https://smart-gallery.xavdp.pro
```

Tu devrais voir **HTTP/2 200** au lieu de 530 !

---

## 🌐 Résultat Final

Une fois configuré :

✅ **URL:** https://smart-gallery.xavdp.pro
✅ **SSL:** Automatique (Cloudflare)
✅ **Protection:** DDoS incluse
✅ **IP cachée:** Serveur invisible
✅ **Tunnel:** Connexion chiffrée

---

## 📝 Alternative : Via Configuration Manuelle

Si tu préfères configurer via fichier, édite `/etc/cloudflared/config.yml` :

```yaml
tunnel: db8c3728-4065-4734-ab0d-87af9c8485ea
credentials-file: /root/.cloudflared/db8c3728-4065-4734-ab0d-87af9c8485ea.json

ingress:
  - hostname: smart-gallery.xavdp.pro
    service: http://localhost:9999
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

Puis redémarre :
```bash
systemctl restart cloudflared
```

---

## 🎉 C'est Presque Fini !

Le tunnel c7 est prêt, il ne reste plus qu'à ajouter le hostname dans le dashboard Zero Trust.

**Temps estimé:** 2 minutes ⏱️

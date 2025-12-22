# ✅ FIX APPLIQUÉ - URLs Email

**Problème** : Emails avec liens `http://localhost:9999` ❌  
**Solution** : URLs maintenant `https://photo-v1.c9.ooo.ovh` ✅

---

## Ce qui a été modifié

### `.env`
```bash
APP_URL=https://photo-v1.c9.ooo.ovh  # ← Changé
```

### Backend
```bash
pm2 restart photo-backend --update-env  # ← Redémarré
```

---

## Résultat

### Avant
```
http://localhost:9999/login  ❌
http://localhost:9999/reset-password?token=xxx  ❌
```

### Après
```
https://photo-v1.c9.ooo.ovh/login  ✅
https://photo-v1.c9.ooo.ovh/reset-password?token=xxx  ✅
```

---

## Test

1. Demander reset password
2. Vérifier email reçu
3. L'URL doit pointer vers `https://photo-v1.c9.ooo.ovh`

---

**Status** : ✅ CORRIGÉ  
**Date** : 3 octobre 2025

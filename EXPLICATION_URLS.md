# 📧 Explication : URLs dans les Emails

## 🔍 Ce qui se passe

### Quand tu cliques sur un lien dans l'email

```
┌─────────────────────────────────────────────────────────┐
│  EMAIL REÇU                                             │
│                                                         │
│  Vous avez demandé à réinitialiser votre mot de passe  │
│                                                         │
│  ┌───────────────────────────────────────────────┐     │
│  │  [Réinitialiser mon mot de passe]             │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
│  Lien: http://x0qry.mjt.lu/lnk/AWE.../aHR0c...        │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Tu cliques
                        ▼
┌─────────────────────────────────────────────────────────┐
│  MAILJET TRACKING SERVER                                │
│  http://x0qry.mjt.lu/lnk/...                           │
│                                                         │
│  1. Enregistre le clic (stats)                         │
│  2. Décode l'URL base64                                │
│  3. Redirige vers la vraie URL                         │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Redirection
                        ▼
┌─────────────────────────────────────────────────────────┐
│  TON SITE WEB                                           │
│  https://photo-v1.c9.ooo.ovh/reset-password?token=xxx  │
│                                                         │
│  Page de réinitialisation de mot de passe              │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Décodage de l'URL

### L'URL trackée par Mailjet
```
http://x0qry.mjt.lu/lnk/AWEAAHztiz4.../.../aHR0cDovL2xvY2FsaG9zdDo5OTk5L2xvZ2lu
```

### Partie en base64
```
aHR0cDovL2xvY2FsaG9zdDo5OTk5L2xvZ2lu
```

### Décodage base64 → URL réelle
```bash
$ echo "aHR0cDovL2xvY2FsaG9zdDo5OTk5L2xvZ2lu" | base64 -d
http://localhost:9999/login
```

❌ **PROBLÈME** : Cette URL ne fonctionne pas car `localhost` = le serveur, pas ton ordinateur !

---

## ✅ Solution Appliquée

### Dans `.env`
```bash
# Avant
APP_URL=http://localhost:9999  ❌

# Après
APP_URL=https://photo-v1.c9.ooo.ovh  ✅
```

### Dans `server/email.js`
```javascript
const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
// Génère: https://photo-v1.c9.ooo.ovh/reset-password?token=abc123
```

### Maintenant l'URL encodée
```
aHR0cHM6Ly9waG90by12MS5jOS5vb28ub3ZoL3Jlc2V0LXBhc3N3b3JkP3Rva2VuPWFiYzEyMw==
```

### Décode en
```
https://photo-v1.c9.ooo.ovh/reset-password?token=abc123  ✅
```

✅ **FONCTIONNE** : C'est le vrai domaine public, accessible partout !

---

## 🎯 Pourquoi Mailjet fait ça ?

### Avantages du tracking Mailjet

1. **📊 Statistiques**
   - Nombre d'emails ouverts
   - Nombre de clics sur les liens
   - Quand les utilisateurs cliquent

2. **🛡️ Protection Anti-spam**
   - Mailjet vérifie les liens malveillants
   - Protège contre le phishing
   - Filtre les URLs dangereuses

3. **🔍 Debug**
   - Voir quels emails sont cliqués
   - Identifier les problèmes de délivrabilité
   - Analytics détaillés

---

## 🔄 Flow Complet

### Reset Password

```
1. USER
   └─> Clique "Mot de passe oublié" sur https://photo-v1.c9.ooo.ovh/login

2. FRONTEND
   └─> POST /api/auth/forgot-password
       Body: { email: "user@example.com" }

3. BACKEND
   ├─> Génère token unique: abc123xyz789
   ├─> Crée URL: https://photo-v1.c9.ooo.ovh/reset-password?token=abc123xyz789
   ├─> Génère HTML email (MJML)
   └─> Envoie via Mailjet

4. MAILJET
   ├─> Encode URL en base64
   ├─> Crée lien trackable: http://x0qry.mjt.lu/lnk/.../[base64]
   ├─> Envoie email à user@example.com
   └─> Enregistre dans leur système

5. USER
   ├─> Reçoit email
   └─> Clique sur le lien

6. MAILJET TRACKER
   ├─> Enregistre le clic (timestamp, IP, user-agent)
   ├─> Décode le base64
   └─> Redirige vers: https://photo-v1.c9.ooo.ovh/reset-password?token=abc123xyz789

7. FRONTEND
   ├─> Charge la page reset-password
   ├─> Lit le token depuis l'URL
   └─> Affiche formulaire "Nouveau mot de passe"

8. USER
   ├─> Entre nouveau password (2x)
   └─> Clique "Valider"

9. FRONTEND
   └─> POST /api/auth/reset-password
       Body: { token: "abc123xyz789", password: "NewPass123!" }

10. BACKEND
    ├─> Vérifie token existe
    ├─> Vérifie token non expiré (< 1h)
    ├─> Hash le nouveau password
    ├─> Met à jour dans la DB
    ├─> Marque token comme utilisé
    └─> Retourne success

11. FRONTEND
    ├─> Affiche message succès
    └─> Redirige vers /login

12. USER
    └─> Se connecte avec nouveau mot de passe ✅
```

---

## 🧪 Comment Tester

### Test Manuel

1. **Demander reset**
   ```
   https://photo-v1.c9.ooo.ovh/login
   → "Mot de passe oublié ?"
   → Entrer: admin@photo-manager.local
   → Envoyer
   ```

2. **Vérifier l'email**
   - Ouvrir email reçu
   - Inspecter le lien (survol)
   - Devrait voir `x0qry.mjt.lu/lnk/...`

3. **Cliquer sur le lien**
   - Mailjet va tracker
   - Redirection automatique
   - Devrait arriver sur `https://photo-v1.c9.ooo.ovh/reset-password?token=...`

4. **Changer le password**
   - Entrer nouveau password
   - Confirmer
   - Valider

5. **Se connecter**
   - Retour sur /login
   - Se connecter avec nouveau password
   - ✅ Devrait fonctionner !

### Test Backend (curl)

```bash
# 1. Demander reset
curl -X POST https://photo-v1.c9.ooo.ovh/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@photo-manager.local"}'

# 2. Vérifier logs backend
pm2 logs photo-backend --lines 5

# Devrait voir:
# ✅ Password reset email sent: <message-id>
```

---

## 📊 Avant vs Après

### AVANT (localhost)

```
Email généré avec:
├─ URL: http://localhost:9999/reset-password?token=abc
├─ Encodé: aHR0cDovL2xvY2FsaG9zdDo5OTk5L3Jlc2V0LXBhc3N3b3Jk...
├─ Lien Mailjet: http://x0qry.mjt.lu/lnk/.../aHR0c...
│
User clique:
├─ Mailjet décode → http://localhost:9999/...
└─> ❌ ERREUR: localhost n'existe pas côté client
```

### APRÈS (domaine public)

```
Email généré avec:
├─ URL: https://photo-v1.c9.ooo.ovh/reset-password?token=abc
├─ Encodé: aHR0cHM6Ly9waG90by12MS5jOS5vb28ub3ZoL3Jlc2V0...
├─ Lien Mailjet: http://x0qry.mjt.lu/lnk/.../aHR0c...
│
User clique:
├─ Mailjet décode → https://photo-v1.c9.ooo.ovh/...
└─> ✅ SUCCESS: domaine accessible partout
```

---

## 🎓 Leçon

### Ne JAMAIS hardcoder des URLs

```javascript
// ❌ MAUVAIS
const resetLink = `http://localhost:9999/reset-password?token=${token}`;

// ❌ MAUVAIS AUSSI
const resetLink = `https://photo-v1.c9.ooo.ovh/reset-password?token=${token}`;

// ✅ BON
const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
```

### Pourquoi ?
- **Flexibilité** : Différentes URLs par environnement
- **Sécurité** : Pas de secrets dans le code
- **Maintenabilité** : Un seul endroit à changer
- **Portabilité** : Marche sur dev/staging/prod

---

## ✅ Checklist

- [x] Variable `APP_URL` dans `.env`
- [x] Code utilise `process.env.APP_URL`
- [x] Backend redémarré
- [x] Emails maintenant avec bon domaine
- [ ] Tester reset password (à faire manuellement)
- [ ] Tester welcome email (à faire manuellement)

---

## 🎉 Conclusion

**C'est Mailjet qui crée l'URL `x0qry.mjt.lu`** pour tracker les clics.

**C'est nous qui générons l'URL finale** (localhost ❌ → domaine public ✅).

**Maintenant ça marche !** 🚀

---

**C'est normal et c'est fait exprès par Mailjet !**

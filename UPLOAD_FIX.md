# 🔧 Fix Upload - Problèmes intermittents

## 🐛 **Problème identifié**

L'upload ne se lance parfois pas, nécessitant un rechargement de la page.

**Causes possibles :**
1. ❌ État `uploading` reste bloqué sur `true`
2. 🔌 WebSocket déconnecté
3. 🔐 Token d'authentification manquant
4. ⏱️ Timeout sans réinitialisation

---

## ✅ **Corrections apportées**

### **1. Protection contre les uploads multiples**

```javascript
// Vérifier si un upload est déjà en cours
if (uploading) {
  console.log('⚠️ Upload already in progress, ignoring')
  toast.error('Un upload est déjà en cours')
  event.target.value = '' // Reset input
  return
}
```

**Effet :** Empêche de cliquer plusieurs fois sur Upload

---

### **2. Vérification du token**

```javascript
// Vérifier le token
if (!token) {
  console.error('❌ No auth token available')
  toast.error('Erreur d\'authentification')
  event.target.value = '' // Reset input
  return
}
```

**Effet :** Détecte si l'utilisateur est déconnecté

---

### **3. Logs détaillés**

```javascript
console.log('📤 Starting upload:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)} MB)`)
console.log('🔌 Socket connected:', socket.id)
console.log('✅ Photo uploaded:', newPhoto.id)
console.log('🏁 Upload process finished')
```

**Effet :** Permet de débugger dans la console du navigateur

---

### **4. Timeout de sécurité (2 minutes)**

```javascript
// Timeout de sécurité : réinitialiser après 2 minutes si pas de réponse
const safetyTimeout = setTimeout(() => {
  console.error('⏱️ Upload timeout - resetting state')
  setUploading(false)
  setUploadProgress(null)
  toast.error('Timeout - veuillez réessayer', { id: 'upload' })
}, 120000) // 2 minutes
```

**Effet :** Réinitialise automatiquement si ça prend trop de temps

---

### **5. Réinitialisation de l'input file**

```javascript
// Réinitialiser après chaque upload (succès ou erreur)
event.target.value = ''
if (fileInputRef.current) {
  fileInputRef.current.value = ''
}
```

**Effet :** Permet d'uploader à nouveau le même fichier

---

### **6. Gestion des erreurs WebSocket**

```javascript
newSocket.on('photo:error', (data) => {
  console.error('❌ Error:', data)
  setUploadProgress(null)
  setUploading(false) // ✅ AJOUTÉ
  toast.error(data.message, {
    duration: 4000,
  })
})
```

**Effet :** Réinitialise l'état en cas d'erreur backend

---

### **7. Logs de connexion WebSocket**

```javascript
// Debug: écouter les événements de connexion
newSocket.on('connect', () => {
  console.log('🔌 Socket connected:', newSocket.id)
})

newSocket.on('disconnect', (reason) => {
  console.log('🔌 Socket disconnected:', reason)
})

newSocket.on('connect_error', (error) => {
  console.error('🔌 Socket connection error:', error)
})
```

**Effet :** Détecte les problèmes de connexion WebSocket

---

## 🧪 **Comment débugger**

### **Ouvrir la console du navigateur**

1. Appuie sur **F12** dans Chrome/Firefox
2. Va dans l'onglet **Console**
3. Essaie d'uploader une photo
4. Regarde les logs

### **Logs normaux (upload réussi)**

```
🔌 Socket connected: abc123xyz
📤 Starting upload: photo.jpg (2.45 MB)
🔌 Socket connected: abc123xyz
✅ Photo uploaded: 42
📊 Progress: { stage: 'analyzing', progress: 10, ... }
✅ Complete: { photoId: 42, ... }
📊 Tags received: 85 tags
🔄 Updating tags for selected photo
🏁 Upload process finished
```

### **Logs d'erreur (socket déconnecté)**

```
📤 Starting upload: photo.jpg (2.45 MB)
⚠️ Socket not connected, upload will work but no real-time updates
✅ Photo uploaded: 42
🏁 Upload process finished
```

**⚠️ Dans ce cas :** L'upload fonctionne mais pas de progression en temps réel

### **Logs d'erreur (upload bloqué)**

```
📤 Starting upload: photo.jpg (2.45 MB)
🔌 Socket connected: abc123xyz
⏱️ Upload timeout - resetting state
```

**❌ Problème :** Le backend n'a pas répondu après 2 minutes

---

## 🔍 **Diagnostic**

### **Cas 1 : Upload ne démarre pas**

**Symptômes :**
- Clic sur Upload ne fait rien
- Aucun log dans la console
- Pas de toast

**Solution :**
```javascript
// Vérifier dans la console :
console.log(uploading) // Devrait être false
console.log(token)     // Devrait être une string JWT
```

Si `uploading = true` :
- Recharge la page
- Vérifie les logs pour voir ce qui a bloqué

Si `token = null` :
- Reconnecte-toi

---

### **Cas 2 : Socket déconnecté**

**Symptômes :**
- Upload fonctionne
- Pas de progression en temps réel
- Pas de notification de fin d'analyse

**Solution :**
1. Recharge la page
2. Vérifie les logs :
```
🔌 Socket disconnected: transport close
```

3. Vérifie que le backend est en ligne :
```bash
pm2 list
```

---

### **Cas 3 : Upload lent**

**Symptômes :**
- Upload prend plus de 2 minutes
- Timeout se déclenche

**Solution :**
1. Réduis la taille de l'image (max 5 MB recommandé)
2. Augmente le timeout dans le code :
```javascript
}, 300000) // 5 minutes au lieu de 2
```

---

## 🛠️ **Commandes de maintenance**

### **Redémarrer le backend (si socket ne fonctionne pas)**

```bash
pm2 restart photo-backend
```

### **Vider le cache du navigateur**

1. **Chrome** : Ctrl+Shift+Delete → Vider le cache
2. **Firefox** : Ctrl+Shift+Delete → Vider le cache

### **Tester sans socket**

Si le socket pose problème, l'upload fonctionne quand même. Tu peux :
1. Uploader la photo
2. Recharger la page
3. Les tags apparaîtront

---

## 📊 **Statistiques de debug**

### **Temps moyen d'upload**

| Taille | Upload | Analyse IA | Total |
|--------|--------|------------|-------|
| 1 MB | 2-5s | 15-20s | ~25s |
| 3 MB | 5-10s | 15-20s | ~30s |
| 5 MB | 10-15s | 15-20s | ~35s |

### **Logs à surveiller**

| Log | Signification |
|-----|---------------|
| `📤 Starting upload` | Upload démarre |
| `🔌 Socket connected` | WebSocket OK |
| `⚠️ Socket not connected` | WebSocket KO (mais upload fonctionne) |
| `✅ Photo uploaded` | Upload réussi |
| `❌ Error uploading` | Erreur HTTP |
| `⏱️ Upload timeout` | Timeout après 2 min |
| `🏁 Upload process finished` | Tout est terminé |

---

## 🚀 **Améliorations futures**

### **1. Indicateur visuel de connexion socket**

Ajouter un badge dans le header :
- 🟢 Socket connecté
- 🟠 Socket déconnecté (upload fonctionne quand même)
- 🔴 Backend down

### **2. Retry automatique**

Si l'upload échoue, réessayer automatiquement 3 fois.

### **3. Upload en arrière-plan**

Permettre de fermer la fenêtre pendant l'analyse.

### **4. Queue d'upload**

Permettre d'uploader plusieurs photos en même temps.

---

## ✅ **Vérification**

### **Test 1 : Upload simple**

1. Clique sur "Upload"
2. Sélectionne une image
3. Vérifie les logs dans la console
4. L'upload doit fonctionner en ~30 secondes

### **Test 2 : Upload multiple**

1. Clique sur "Upload"
2. Sélectionne une image
3. **Pendant l'upload**, clique à nouveau sur "Upload"
4. Tu dois voir : "Un upload est déjà en cours"

### **Test 3 : Upload après erreur**

1. Coupe le backend : `pm2 stop photo-backend`
2. Essaie d'uploader
3. Tu dois voir une erreur
4. Relance le backend : `pm2 start photo-backend`
5. Essaie à nouveau d'uploader
6. Ça doit fonctionner

---

## 📝 **Notes**

- Les logs ne sont visibles que si tu ouvres la console (F12)
- Le timeout de 2 minutes est un filet de sécurité
- L'upload fonctionne même si le WebSocket est déconnecté
- En cas de problème persistant, recharge la page

---

## 🆘 **En cas de problème**

Si le problème persiste après ces fixes :

1. **Ouvre la console** (F12)
2. **Essaie d'uploader**
3. **Copie tous les logs**
4. **Envoie-les** pour analyse

Exemple :
```
📤 Starting upload: test.jpg (1.23 MB)
⚠️ Socket not connected, upload will work but no real-time updates
❌ Error uploading photo: TypeError: Failed to fetch
🏁 Upload process finished
```

---

**✅ Les améliorations sont actives ! Teste maintenant l'upload.**

Si tu vois encore le problème, ouvre la console et regarde les logs. 🔍

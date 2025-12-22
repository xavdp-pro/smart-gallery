# 🗑️ Correction Suppression de Photos

**Date:** 2025-09-30 23:42
**Version:** 1.2.3

---

## ❌ Problème Initial

### Question
> Quand on supprime une photo, est-ce que ça supprime bien les tags associés et le fichier?

### Réponse: NON ❌

**Code Original:**
```javascript
export function deletePhoto(id) {
  runQuery('DELETE FROM photos WHERE id = ?', [id]);
}
```

**Problèmes:**
1. ❌ Ne supprime PAS les tags associés (table `photo_tags`)
2. ❌ Ne supprime PAS le fichier physique
3. ❌ Laisse des données orphelines

---

## ✅ Solution Implémentée

### 1. Base de Données (database.js)

**Avant:**
```javascript
export function deletePhoto(id) {
  runQuery('DELETE FROM photos WHERE id = ?', [id]);
}
```

**Après:**
```javascript
export function deletePhoto(id) {
  // Supprimer d'abord les associations de tags
  runQuery('DELETE FROM photo_tags WHERE photo_id = ?', [id]);
  // Puis supprimer la photo
  runQuery('DELETE FROM photos WHERE id = ?', [id]);
}
```

**Avantages:**
- ✅ Supprime les associations dans `photo_tags`
- ✅ Évite les données orphelines
- ✅ Maintient l'intégrité de la base

### 2. API Endpoint (index.js)

**Avant:**
```javascript
app.delete('/api/photos/:id', (req, res) => {
  try {
    deletePhoto(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});
```

**Après:**
```javascript
app.delete('/api/photos/:id', (req, res) => {
  try {
    const photoId = req.params.id;
    
    // Récupérer les infos de la photo avant suppression
    const photo = getPhotoById(photoId);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Supprimer le fichier physique
    const filePath = join(uploadsDir, photo.filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${photo.filename}`);
    }
    
    // Supprimer de la base de données (+ tags associés)
    deletePhoto(photoId);
    
    res.json({ success: true, message: 'Photo and associated tags deleted' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});
```

**Améliorations:**
- ✅ Vérifie si la photo existe (404 si non trouvée)
- ✅ Supprime le fichier physique
- ✅ Supprime de la base (photo + tags)
- ✅ Message de confirmation
- ✅ Logs pour debugging

---

## 🧪 Tests

### Test 1: Script CLI (test-delete.js)

```bash
node test-delete.js
```

**Résultat:**
```
1️⃣ Creating test photo...
   ✅ File created: test-delete-xxx.jpg
   ✅ Photo created with ID: 12

2️⃣ Adding tags...
   ✅ 3 tags added

3️⃣ Before deletion:
   📸 Photo exists in DB: ✅
   📁 File exists: ✅
   🏷️  Tags count: 3

4️⃣ Deleting file...
   ✅ File deleted

5️⃣ Deleting from database...
   ✅ Photo deleted from DB

6️⃣ After deletion:
   📸 Photo exists in DB: ✅ Deleted
   📁 File exists: ✅ Deleted
   🏷️  Tags count: 0 (should be 0)

✅ SUCCESS! Photo, file, and tags all deleted correctly!
```

### Test 2: API REST

**Étapes:**
1. Upload photo → ID: 13
2. Attendre génération tags (5s)
3. Vérifier tags: 24 tags
4. Vérifier fichier: ✅ existe
5. DELETE /api/photos/13
6. Vérifier photo: ❌ n'existe plus
7. Vérifier fichier: ❌ supprimé
8. Vérifier tags: 0 tags

**Résultat:** ✅ Tout supprimé correctement

---

## 📊 Comparaison

### Avant la Correction

| Action | Photo DB | Tags DB | Fichier |
|--------|----------|---------|---------|
| DELETE | ✅ Supprimé | ❌ Reste | ❌ Reste |

**Problèmes:**
- Tags orphelins dans `photo_tags`
- Fichiers orphelins dans `/uploads`
- Gaspillage d'espace disque
- Pollution de la base

### Après la Correction

| Action | Photo DB | Tags DB | Fichier |
|--------|----------|---------|---------|
| DELETE | ✅ Supprimé | ✅ Supprimé | ✅ Supprimé |

**Avantages:**
- Nettoyage complet
- Pas de données orphelines
- Espace disque libéré
- Base de données propre

---

## 🔧 Ordre de Suppression

**Important:** L'ordre est crucial!

```
1. Récupérer info photo (pour le filename)
   ↓
2. Supprimer fichier physique
   ↓
3. Supprimer tags associés (photo_tags)
   ↓
4. Supprimer photo (photos)
```

**Pourquoi cet ordre?**
- On a besoin du `filename` avant de supprimer de la DB
- Les tags doivent être supprimés avant la photo (clé étrangère)
- Le fichier peut être supprimé à tout moment

---

## 📁 Fichiers Modifiés

### server/database.js
**Ligne 116-121:** Fonction `deletePhoto()` mise à jour

**Changements:**
- Ajout suppression des tags associés
- Ordre correct (tags puis photo)

### server/index.js
**Ligne 8:** Import `unlinkSync` ajouté
**Ligne 165-191:** Endpoint DELETE amélioré

**Changements:**
- Vérification existence photo
- Suppression fichier physique
- Message de confirmation
- Logs

---

## 🧪 Scripts de Test Créés

### test-delete.js
**Usage:** `node test-delete.js`

**Fonction:**
- Crée une photo de test
- Ajoute des tags
- Vérifie avant suppression
- Supprime tout
- Vérifie après suppression
- Affiche le résultat

**Résultat:** ✅ SUCCESS!

---

## 🔮 Améliorations Futures

### 1. Soft Delete
Au lieu de supprimer définitivement:
```javascript
export function softDeletePhoto(id) {
  runQuery('UPDATE photos SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
}
```

**Avantages:**
- Récupération possible
- Historique conservé
- Audit trail

### 2. Corbeille
- Déplacer fichiers dans `/trash`
- Purge automatique après X jours
- Restauration possible

### 3. Cascade Delete
Utiliser les contraintes SQL:
```sql
CREATE TABLE photo_tags (
  photo_id INTEGER,
  tag_id INTEGER,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
);
```

**Avantage:** Suppression automatique des tags

---

## ⚠️ Points d'Attention

### 1. Fichiers Manquants
Si le fichier n'existe pas:
```javascript
if (existsSync(filePath)) {
  unlinkSync(filePath);
} else {
  console.warn(`⚠️ File not found: ${photo.filename}`);
}
```

**Solution:** Continue quand même (ne bloque pas)

### 2. Permissions
Si erreur de permission:
```javascript
try {
  unlinkSync(filePath);
} catch (error) {
  console.error(`❌ Cannot delete file: ${error.message}`);
  // Continue quand même avec la DB
}
```

### 3. Concurrence
Si plusieurs requêtes simultanées:
- Utiliser des transactions
- Lock sur la photo
- Vérifier existence avant suppression

---

## ✅ Checklist de Suppression

Quand on supprime une photo, vérifier:

- [x] Photo supprimée de la table `photos`
- [x] Tags supprimés de la table `photo_tags`
- [x] Fichier physique supprimé de `/uploads`
- [x] Réponse API avec confirmation
- [x] Logs de débogage
- [x] Gestion d'erreurs
- [x] Vérification existence
- [x] Message utilisateur

---

## 📊 Impact

### Avant
- ❌ Fichiers orphelins s'accumulent
- ❌ Tags orphelins dans la DB
- ❌ Espace disque gaspillé
- ❌ Base de données polluée

### Après
- ✅ Suppression complète
- ✅ Pas de données orphelines
- ✅ Espace disque libéré
- ✅ Base de données propre

---

## 🎯 Résumé

**Question:** Supprime-t-on bien les tags et le fichier?

**Réponse Avant:** ❌ NON
- Tags: ❌ Restent
- Fichier: ❌ Reste

**Réponse Après:** ✅ OUI
- Tags: ✅ Supprimés
- Fichier: ✅ Supprimé

**Tests:** ✅ Validés
- Test CLI: ✅ SUCCESS
- Test API: ✅ SUCCESS

**Fichiers Modifiés:** 2
- `server/database.js`
- `server/index.js`

**Scripts Créés:** 1
- `test-delete.js`

**Statut:** ✅ Production Ready!

# 🚀 START HERE - Photo Manager

## ✅ Application Prête!

Votre application de gestion de photos avec IA est **100% opérationnelle**.

---

## 🌐 Accès Rapide

### Ouvrir l'Application
**👉 http://localhost:9999**

### API Backend
**👉 http://localhost:8888**

---

## 🎯 Utilisation

### 1️⃣ Upload une Photo
1. Cliquez sur **"Upload Photo"** (bouton bleu en haut à droite)
2. Sélectionnez une image (JPG, PNG, GIF, WebP)
3. Attendez quelques secondes...
4. **Magie!** 🪄 L'IA génère automatiquement des tags!

### 2️⃣ Parcourir les Photos
- **Colonne gauche:** Liste de vos photos avec thumbnails
- **Cliquez** sur une photo pour la voir en grand
- **Centre:** Photo sélectionnée en haute résolution

### 3️⃣ Gérer les Tags
- **Colonne droite:** Tags de la photo sélectionnée
- **Ajouter:** Tapez un tag et appuyez sur Entrée
- **Supprimer:** Survolez un tag et cliquez sur le ❌

---

## 🔌 Ports Utilisés

| Service | Port | URL |
|---------|------|-----|
| **Frontend** | 9999 | http://localhost:9999 |
| **Backend** | 8888 | http://localhost:8888 |

💡 Ces ports ont été choisis pour éviter les conflits avec d'autres applications.

---

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| `README.md` | Documentation complète |
| `QUICK_START.md` | Guide de démarrage rapide |
| `TESTING_GUIDE.md` | Guide de test détaillé |
| `STATUS.md` | État de l'application |
| `PORTS.md` | Configuration des ports |
| `CHANGELOG.md` | Historique des versions |
| `test-app.sh` | Script de test automatique |

---

## 🧪 Tester l'Application

```bash
# Lancer les tests automatiques
./test-app.sh
```

Tous les tests doivent être ✅ verts!

---

## 🛠️ Commandes Utiles

```bash
# Démarrer l'application
npm run dev

# Arrêter l'application
pkill -f "concurrently"

# Tester le backend
curl http://localhost:8888/api/photos

# Tester le frontend
curl http://localhost:9999

# Voir les logs
# Les logs s'affichent dans le terminal où vous avez lancé npm run dev
```

---

## 🤖 Intelligence Artificielle

L'application utilise **OpenAI GPT-4o-mini** avec Vision API pour:
- Analyser automatiquement chaque photo uploadée
- Générer des tags pertinents (objets, couleurs, ambiance, etc.)
- Décrire le contenu de l'image

**Exemples de tags générés:**
- 🐱 Photo de chat → "cat", "animal", "pet", "fur", "cute"
- 🏔️ Paysage → "landscape", "nature", "mountains", "sky", "outdoor"
- 🍕 Nourriture → "food", "pizza", "meal", "delicious", "italian"

---

## 🎨 Interface

- **Design moderne** avec TailwindCSS
- **Icônes élégantes** avec Lucide React
- **Animations fluides**
- **Responsive** (adapté à toutes les tailles d'écran)
- **3 colonnes** pour une navigation optimale

---

## 💾 Stockage

- **Photos:** `/apps/photo-v1/app/uploads/`
- **Base de données:** `/apps/photo-v1/app/database.db` (SQLite)
- **Configuration:** `/apps/photo-v1/app/.env` (clé OpenAI)

---

## ⚠️ Important

### Pas d'Authentification
Cette version est un **proof of concept** sans authentification.
- Toutes les photos sont accessibles
- Pas de gestion d'utilisateurs
- Ne pas exposer sur Internet

### Clé OpenAI
Votre clé API OpenAI est déjà configurée dans `.env`
- Gardez-la **secrète**
- Ne la commitez **jamais** sur Git
- Surveillez votre **usage** sur platform.openai.com

---

## 🐛 Problèmes?

### L'application ne démarre pas
```bash
# Vérifier si les ports sont libres
lsof -i :9999
lsof -i :8888

# Libérer les ports si nécessaire
fuser -k 9999/tcp
fuser -k 8888/tcp

# Redémarrer
npm run dev
```

### Erreur "Failed to fetch"
- Vérifiez que le backend est démarré (port 8888)
- Vérifiez la console pour les erreurs
- Relancez `npm run dev`

### Tags IA ne fonctionnent pas
- Vérifiez votre clé OpenAI dans `.env`
- Vérifiez votre quota OpenAI
- Regardez les logs du serveur

---

## 🎉 C'est Tout!

**Vous êtes prêt à utiliser l'application!**

👉 **Ouvrez http://localhost:9999 et commencez à uploader des photos!**

---

**Besoin d'aide?** Consultez les fichiers de documentation dans le dossier.

**Bon tagging! 📸✨**

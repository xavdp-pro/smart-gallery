# 🔧 Modifications Finales - Guide Pratique

**Temps estimé:** 30 minutes

---

## ✅ Ce qui est déjà fait (100%)

### Backend
- ✅ Tables BDD users + reset_tokens
- ✅ Service email Mailjet + MJML
- ✅ Routes auth (login, forgot, reset)
- ✅ Routes admin (CRUD users)
- ✅ Middlewares JWT
- ✅ Protection routes photos

### Frontend
- ✅ AuthContext
- ✅ Pages Login, ForgotPassword, ResetPassword
- ✅ AdminPanel complet
- ✅ ProtectedRoute
- ✅ AppLayout

---

## 🚀 3 Fichiers à Modifier

### 1️⃣ `src/main.jsx`

**Fichier actuel:**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Remplacer par:**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Changements:**
- Ajout `BrowserRouter` pour React Router
- Ajout `AuthProvider` pour le contexte auth
- Déplacement `Toaster` ici (global)

---

### 2️⃣ `src/App.jsx`

**Sauvegarder d'abord:**
```bash
cp src/App.jsx src/pages/PhotoGallery.jsx
```

**Remplacer tout le contenu de `src/App.jsx` par:**
```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PhotoGallery from './pages/PhotoGallery'
import AdminPanel from './pages/AdminPanel'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <PhotoGallery />
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly>
            <AppLayout>
              <div className="container mx-auto px-6 py-8 max-w-7xl">
                <AdminPanel />
              </div>
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
```

**Explication:**
- App.jsx devient le routeur principal
- Définit les routes publiques (login, forgot, reset)
- Définit les routes protégées (galerie, admin)
- Redirect automatique si déjà connecté
- Loading state pendant vérification token

---

### 3️⃣ `src/pages/PhotoGallery.jsx`

**Changements à faire:**

#### A. Imports (lignes 1-8)
```jsx
// AVANT:
import toast, { Toaster } from 'react-hot-toast'
import UploadProgress from './components/UploadProgress'
import ConfirmModal from './components/ConfirmModal'
import './App.css'

function App() {

// APRÈS:
import toast from 'react-hot-toast'
import UploadProgress from '../components/UploadProgress'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'

export default function PhotoGallery() {
  const { token } = useAuth()
```

#### B. Supprimer Toaster (ligne ~870)
```jsx
// SUPPRIMER CETTE LIGNE (le Toaster est maintenant dans main.jsx):
<Toaster position="bottom-right" />
```

#### C. Supprimer export default (dernière ligne)
```jsx
// SUPPRIMER (déjà dans export default function):
export default App
```

#### D. Ajouter token aux fetch (7 endroits)

**1. fetchPhotos() - ligne ~109**
```javascript
const response = await fetch('/api/photos', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**2. fetchPhotoTags() - ligne ~139**
```javascript
const response = await fetch(`/api/photos/${photoId}/tags`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**3. handleFileUpload() - ligne ~159**
```javascript
const response = await fetch('/api/photos/upload', {
  method: 'POST',
  body: formData,
  headers: socket ? { 
    'X-Socket-Id': socket.id,
    'Authorization': `Bearer ${token}`
  } : {
    'Authorization': `Bearer ${token}`
  }
})
```

**4. handleRenamePhoto() - ligne ~252**
```javascript
const response = await fetch(`/api/photos/${photoId}/rename`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ newName })
})
```

**5. confirmDeletePhoto() - ligne ~315**
```javascript
const response = await fetch(`/api/photos/${photoId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**6. handleAddTag() - ligne ~210**
```javascript
const response = await fetch(`/api/photos/${selectedPhoto.id}/tags`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ tagName })
})
```

**7. handleRemoveTag() - ligne ~285**
```javascript
const response = await fetch(`/api/photos/${selectedPhoto.id}/tags/${tagId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**Astuce:** Chercher tous les `fetch(` dans le fichier et ajouter le header Authorization.

---

## 🎯 Checklist Complète

### Préparation
- [ ] Sauvegarder `src/App.jsx` vers `src/pages/PhotoGallery.jsx`
- [ ] Lire ce guide en entier

### Modifications
- [ ] Modifier `src/main.jsx` (ajouter Router + AuthProvider)
- [ ] Remplacer `src/App.jsx` (nouveau routeur)
- [ ] Modifier `src/pages/PhotoGallery.jsx`:
  - [ ] Changer imports (ligne 1-8)
  - [ ] Ajouter `const { token } = useAuth()`
  - [ ] Supprimer `<Toaster />`
  - [ ] Supprimer `export default App`
  - [ ] Ajouter token à `fetchPhotos()`
  - [ ] Ajouter token à `fetchPhotoTags()`
  - [ ] Ajouter token à `handleFileUpload()`
  - [ ] Ajouter token à `handleRenamePhoto()`
  - [ ] Ajouter token à `confirmDeletePhoto()`
  - [ ] Ajouter token à `handleAddTag()`
  - [ ] Ajouter token à `handleRemoveTag()`

### Premier démarrage
- [ ] Créer admin: `node create-admin.js`
- [ ] Démarrer: `npm run dev`
- [ ] Ouvrir: http://localhost:9999
- [ ] Devrait rediriger vers `/login`
- [ ] Se connecter avec:
  - Email: `admin@photo-manager.local`
  - Password: `Admin123!`

### Tests
- [ ] Login fonctionne
- [ ] Redirection vers galerie après login
- [ ] Galerie photos affiche les photos
- [ ] Upload photo fonctionne
- [ ] Tags fonctionnent
- [ ] Menu utilisateur fonctionne (en haut à droite)
- [ ] Accès à `/admin` fonctionne
- [ ] Créer utilisateur fonctionne
- [ ] Email reçu avec credentials
- [ ] Logout fonctionne
- [ ] Mot de passe oublié fonctionne
- [ ] Email reset password reçu
- [ ] Reset password fonctionne

---

## 🐛 Dépannage Rapide

### Erreur: "Cannot find module './contexts/AuthContext'"
→ Vérifier que le fichier existe: `src/contexts/AuthContext.jsx`

### Erreur: "Toaster is not defined"
→ Vérifier que `Toaster` est bien importé dans `main.jsx`

### Erreur 401 Unauthorized sur les photos
→ Le token n'est pas ajouté aux fetch. Vérifier les 7 fetch dans PhotoGallery.jsx

### Page blanche après login
→ Ouvrir la console browser (F12) et vérifier les erreurs

### "Cannot read property 'token' of null"
→ `useAuth()` n'est pas disponible. Vérifier que `AuthProvider` est bien dans `main.jsx`

### Redirect loop login
→ Vérifier la condition dans App.jsx: `user ? <Navigate to="/" /> : <Login />`

---

## 📝 Commandes Utiles

```bash
# Créer l'admin
node create-admin.js

# Démarrer l'app
npm run dev

# Vérifier les erreurs
# → Console browser (F12)
# → Terminal serveur

# Test API login
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@photo-manager.local","password":"Admin123!"}'

# Reset BDD (si besoin)
rm database.db
npm run server  # Recrée les tables
node create-admin.js  # Recrée l'admin
```

---

## ✅ Une fois terminé

Vous aurez:
- ✅ Page de login professionnelle
- ✅ Système de connexion complet
- ✅ Panel admin pour gérer les utilisateurs
- ✅ Emails automatiques (bienvenue + reset)
- ✅ Routes protégées par authentification
- ✅ JWT tokens sécurisés
- ✅ Mot de passe oublié fonctionnel
- ✅ Interface moderne et responsive

**Durée totale:** 30 minutes maximum

**Prochaine étape:** Tester tout le système ! 🚀

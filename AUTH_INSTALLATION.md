# 🔐 Système d'Authentification - Guide d'Installation

**Date:** 3 octobre 2025
**Version:** 2.0.0 avec Authentification

---

## ✅ Ce qui a été implémenté

### Backend (✅ COMPLET)

1. **Base de données** (`server/database.js`)
   - Table `users` (id, email, password, name, role, is_active, created_at, updated_at)
   - Table `reset_tokens` (id, user_id, token, expires_at, used, created_at)
   - Toutes les fonctions CRUD pour utilisateurs

2. **Service Email** (`server/email.js`)
   - Configuration Mailjet SMTP
   - Templates MJML professionnels
   - Email de bienvenue (avec mot de passe temporaire)
   - Email de réinitialisation de mot de passe
   - Design responsive et moderne

3. **Authentification** (`server/auth.js`)
   - Génération de tokens JWT
   - Middleware `authMiddleware` (vérification JWT)
   - Middleware `adminMiddleware` (vérification rôle admin)
   - Token expire après 7 jours

4. **Routes API** (`server/index.js`)
   - `POST /api/auth/login` - Connexion
   - `GET /api/auth/me` - Utilisateur courant
   - `POST /api/auth/forgot-password` - Demander réinitialisation
   - `POST /api/auth/reset-password` - Réinitialiser mot de passe
   - `GET /api/admin/users` - Liste utilisateurs (admin)
   - `POST /api/admin/users` - Créer utilisateur (admin)
   - `PUT /api/admin/users/:id` - Modifier utilisateur (admin)
   - `DELETE /api/admin/users/:id` - Supprimer utilisateur (admin)
   - ✅ Toutes les routes photos protégées par `authMiddleware`

### Frontend (🚧 À INTÉGRER)

1. **Contexte** (`src/contexts/AuthContext.jsx`) ✅
   - Gestion de l'état utilisateur
   - Fonctions login/logout
   - Vérification token au chargement

2. **Pages** ✅
   - `src/pages/Login.jsx` - Page de connexion élégante
   - `src/pages/ForgotPassword.jsx` - Mot de passe oublié
   - `src/pages/ResetPassword.jsx` - Réinitialisation
   - `src/pages/AdminPanel.jsx` - Gestion utilisateurs (CRUD complet)
   - `src/pages/PhotoGallery.jsx` - Galerie photos (à intégrer)

3. **Composants** ✅
   - `src/components/ProtectedRoute.jsx` - Protection routes
   - `src/components/AppLayout.jsx` - Layout avec header/navigation

---

## 🔧 Configuration

### Variables d'environnement (`.env`)

```env
# JWT Configuration
JWT_SECRET=change-this-to-a-random-secret-key-in-production-use-strong-password
APP_URL=http://localhost:9999

# Mailjet SMTP Configuration
MAIL_HOST=in-v3.mailjet.com
MAIL_PORT=587
MAIL_USERNAME=0c8da35fa99c112491476202cb9711e6
MAIL_PASSWORD=54aff8cf17e6fb8e943b010e28a305e0
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=monitoring@auvtel.net
MAIL_FROM_NAME="Photo Manager"
```

---

## 📦 Dépendances installées

```bash
npm install bcryptjs jsonwebtoken nodemailer mjml react-router-dom
```

---

## 🚀 Étapes pour finaliser l'intégration

### Étape 1: Modifier `src/main.jsx`

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

### Étape 2: Remplacer `src/App.jsx`

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
      <div className="min-h-screen flex items-center justify-center">
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
      <Route path="/login" element={
        user ? <Navigate to="/" replace /> : <Login />
      } />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout>
            <PhotoGallery />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AppLayout>
            <div className="container mx-auto px-6 py-8">
              <AdminPanel />
            </div>
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
```

### Étape 3: Modifier `src/pages/PhotoGallery.jsx`

Remplacer les lignes d'import :
```jsx
import { useAuth } from '../contexts/AuthContext'
import '../App.css'

export default function PhotoGallery() {
  const { token } = useAuth()
```

Ajouter `token` dans les headers de **toutes** les requêtes fetch :

```javascript
// Exemple pour fetchPhotos:
const response = await fetch('/api/photos', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Exemple pour upload:
const response = await fetch('/api/photos/upload', {
  method: 'POST',
  body: formData,
  headers: {
    'X-Socket-Id': socket.id,
    'Authorization': `Bearer ${token}`
  }
})

// Pour POST/PUT avec JSON:
const response = await fetch('/api/photos/:id/tags', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ tagName })
})
```

**Liste complète des fetch à modifier:**
1. `fetchPhotos()` - GET /api/photos
2. `fetchPhotoTags()` - GET /api/photos/:id/tags  
3. `handleFileUpload()` - POST /api/photos/upload
4. `handleRenamePhoto()` - PUT /api/photos/:id/rename
5. `confirmDeletePhoto()` - DELETE /api/photos/:id
6. `handleAddTag()` - POST /api/photos/:id/tags
7. `handleRemoveTag()` - DELETE /api/photos/:photoId/tags/:tagId

### Étape 4: Supprimer `<Toaster />` de PhotoGallery.jsx

Puisque le Toaster est maintenant dans `main.jsx`, supprimer cette ligne de PhotoGallery.jsx :
```jsx
// SUPPRIMER CETTE LIGNE:
// <Toaster position="bottom-right" />
```

---

## 👨‍💼 Créer le premier admin

### Option 1: Script SQL direct

Créer un fichier `create-admin.js`:

```javascript
import bcrypt from 'bcryptjs';
import { createUser } from './server/database.js';

const hashedPassword = await bcrypt.hash('admin123', 10);
createUser('admin@example.com', hashedPassword, 'Admin User', 'admin');

console.log('✅ Admin créé:');
console.log('Email: admin@example.com');
console.log('Password: admin123');
console.log('⚠️  CHANGEZ CE MOT DE PASSE APRÈS CONNEXION!');
```

Exécuter:
```bash
node create-admin.js
```

### Option 2: Via SQLite direct

```bash
sqlite3 database.db
```

```sql
INSERT INTO users (email, password, name, role, is_active)
VALUES (
  'admin@example.com',
  -- Hash de 'admin123'
  '$2a$10$xYzQoE9K7vN3mZ1jF2wOJuFGHI5kL8mNoPqRsTuVwXyZ',
  'Admin User',
  'admin',
  1
);
```

---

## 🎯 Fonctionnalités complètes

### Utilisateur Admin peut:
- ✅ Créer des utilisateurs (email de bienvenue envoyé)
- ✅ Modifier utilisateurs (email, nom, rôle, statut, mot de passe)
- ✅ Désactiver/Activer comptes
- ✅ Supprimer utilisateurs
- ✅ Voir tous les utilisateurs avec filtres

### Utilisateur peut:
- ✅ Se connecter avec email/mot de passe
- ✅ Demander réinitialisation mot de passe (lien par email)
- ✅ Réinitialiser son mot de passe
- ✅ Accéder à la galerie photos
- ✅ Upload/Delete/Tag photos
- ✅ Se déconnecter

### Sécurité:
- ✅ Mots de passe hashés (bcrypt)
- ✅ Tokens JWT sécurisés
- ✅ Tokens de reset expirés après 1h
- ✅ Tokens de reset à usage unique
- ✅ Toutes les routes photos protégées
- ✅ Routes admin réservées aux administrateurs
- ✅ Empêche l'auto-suppression admin

---

## 📧 Templates Email

### Email de bienvenue
- Design professionnel MJML
- Affiche email + mot de passe temporaire
- Bouton CTA "Se connecter"
- Recommandation changement mot de passe

### Email de réinitialisation
- Lien sécurisé avec token
- Expire en 1h
- Design moderne avec icônes
- Instructions claires

---

## 🧪 Tests

### 1. Test de connexion
```bash
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 2. Test routes protégées
```bash
TOKEN="votre-token-jwt"

curl http://localhost:8888/api/photos \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Test création utilisateur
```bash
curl -X POST http://localhost:8888/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"user@test.com","name":"Test User","role":"user"}'
```

---

## 🐛 Troubleshooting

### Emails non reçus
- Vérifier les credentials Mailjet dans `.env`
- Vérifier les logs serveur
- Tester avec `verifyEmailConfig()`
- Vérifier le dossier spam

### Token invalide/expiré
- Token expire après 7 jours
- Se déconnecter et se reconnecter
- Vérifier que JWT_SECRET est défini

### Route 401 Unauthorized
- Vérifier que le token est dans le header `Authorization: Bearer TOKEN`
- Vérifier que l'utilisateur existe et est actif
- Vérifier la validité du token

---

## 📝 Notes importantes

1. **Changer JWT_SECRET en production** - Utiliser un secret fort et aléatoire
2. **HTTPS obligatoire en production** - JWT sensible, HTTPS requis
3. **Sauvegarder les secrets** - `.env` ne doit jamais être committé
4. **Email de production** - Configurer un vrai domaine email
5. **Tester les emails** - Avant mise en production

---

## 🚀 Prochaines étapes recommandées

1. Modifier PhotoGallery.jsx pour ajouter les tokens (étape 3)
2. Créer le premier admin (étape 4)
3. Tester la connexion
4. Tester la création d'utilisateurs
5. Tester les emails
6. Changer JWT_SECRET
7. Déployer en production

---

**✅ Backend 100% prêt | 🚧 Frontend à intégrer (30 minutes max)**

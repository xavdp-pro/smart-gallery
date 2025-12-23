# ⚡ Indicateur de crédit OpenAI

## ✅ **Fonctionnalité ajoutée**

Affichage en temps réel de l'utilisation et du coût OpenAI dans le header de l'application (visible uniquement pour les administrateurs).

---

## 🎯 **Ce qui a été implémenté**

### **Backend**

#### **1. Fonction `getOpenAIUsage()` dans `server/openai.js`**

```javascript
export async function getOpenAIUsage() {
  // Appel à l'API OpenAI pour récupérer l'usage des 30 derniers jours
  const response = await fetch(
    `https://api.openai.com/v1/usage?date=${startDate}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  // Retourne :
  // - totalUsage : nombre total de requêtes
  // - estimatedCost : coût estimé
  // - period : période analysée
}
```

#### **2. Endpoint API dans `server/index.js`**

```javascript
// GET /api/admin/openai/usage
app.get('/api/admin/openai/usage', authMiddleware, adminMiddleware, async (req, res) => {
  const usage = await getOpenAIUsage();
  res.json(usage);
});
```

**Réponse JSON :**
```json
{
  "success": true,
  "totalUsage": 42,
  "estimatedCost": 0.168,
  "period": "30 derniers jours"
}
```

---

### **Frontend**

#### **1. Hook `useEffect` dans `AppLayout.jsx`**

```javascript
useEffect(() => {
  if (isAdmin()) {
    fetchOpenAIUsage();
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(fetchOpenAIUsage, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }
}, [isAdmin]);
```

#### **2. Fonction de fetch**

```javascript
const fetchOpenAIUsage = async () => {
  const response = await fetch('/api/admin/openai/usage', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.ok) {
    const data = await response.json();
    setOpenaiUsage(data);
  }
};
```

#### **3. Affichage dans le header**

```jsx
{isAdmin() && openaiUsage && (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
    <Zap className="w-4 h-4 text-green-600" />
    <div className="text-xs">
      <div className="font-semibold text-green-700">
        OpenAI: {openaiUsage.totalUsage || 0} requêtes
      </div>
      <div className="text-green-600">
        ~${(openaiUsage.estimatedCost || 0).toFixed(2)}
      </div>
    </div>
  </div>
)}
```

---

## 🎨 **Aperçu visuel**

```
┌──────────────────────────────────────────────────────────────┐
│ 📸 Photo Manager        ⚡ OpenAI: 42 requêtes      🛡️ Admin │
│    Gestionnaire avec IA    ~$0.17                    👤 User  │
└──────────────────────────────────────────────────────────────┘
```

**Design :**
- 🟢 Fond vert clair (green-50 to emerald-50)
- 🟢 Bordure verte (border-green-200)
- ⚡ Icône éclair (Zap de lucide-react)
- 📊 2 lignes :
  - Ligne 1 : "OpenAI: X requêtes" (font-semibold text-green-700)
  - Ligne 2 : "~$X.XX" (text-green-600)

---

## 🔄 **Rafraîchissement automatique**

- ✅ Au chargement de la page (si admin)
- ✅ Toutes les **5 minutes** automatiquement
- ✅ Uniquement visible pour les administrateurs

---

## 📊 **Calcul du coût**

### **Formule actuelle :**
```javascript
estimatedCost = totalUsage * 0.004
```

**Explication :**
- Moyenne de ~$0.004 par requête avec GPT-4o
- C'est une estimation (peut varier selon la taille des images)

### **Coût réel par modèle :**

**GPT-4o :**
- Input : $2.50 / 1M tokens
- Output : $10.00 / 1M tokens
- **Moyenne : $0.003-0.005 / image**

**GPT-4o-mini :**
- Input : $0.15 / 1M tokens
- Output : $0.60 / 1M tokens
- **Moyenne : $0.0003-0.0005 / image**

---

## 🔒 **Sécurité**

### **Protections en place :**

1. ✅ **Endpoint protégé** par `authMiddleware` + `adminMiddleware`
2. ✅ **Affichage conditionnel** (`isAdmin()` dans le frontend)
3. ✅ **API Key sécurisée** (jamais exposée au frontend)
4. ✅ **Requêtes authentifiées** avec Bearer token

---

## 🧪 **Test**

### **1. En tant qu'admin**

1. Connecte-toi avec un compte admin
2. Le badge OpenAI apparaît dans le header
3. Il affiche le nombre de requêtes et le coût

### **2. En tant qu'utilisateur normal**

1. Connecte-toi avec un compte user
2. Le badge n'apparaît **PAS**

### **3. Vérification API**

```bash
curl http://localhost:5001/api/admin/openai/usage \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Réponse attendue :**
```json
{
  "success": true,
  "totalUsage": 42,
  "estimatedCost": 0.168,
  "period": "30 derniers jours"
}
```

---

## ⚠️ **Limitations actuelles**

### **1. API OpenAI Usage**

L'API OpenAI `/v1/usage` a des limitations :
- ❌ Pas de quota en temps réel
- ❌ Pas de crédit restant
- ⚠️ Données avec délai de ~24h

### **2. Alternative recommandée**

Pour un affichage plus précis, tu peux :

**Option A : Dashboard OpenAI**
- https://platform.openai.com/usage
- Voir le crédit restant exact

**Option B : Tracking manuel**
- Compter les requêtes dans ta DB
- Calculer le coût basé sur les tokens utilisés

**Option C : Webhook OpenAI**
- Recevoir des notifications de quota
- Afficher une alerte si quota faible

---

## 🚀 **Améliorations possibles**

### **1. Tracker les requêtes localement**

```javascript
// Dans database.js
export function logOpenAIUsage(photoId, tokensUsed, cost) {
  runQuery(
    'INSERT INTO openai_usage (photo_id, tokens_used, cost, created_at) VALUES (?, ?, ?, ?)',
    [photoId, tokensUsed, cost, new Date().toISOString()]
  );
}

// Dans queue.js après l'analyse
const tokensUsed = analysisResult.usage?.total_tokens || 0;
const cost = (tokensUsed / 1000000) * 12.50; // Coût moyen GPT-4o
logOpenAIUsage(photoId, tokensUsed, cost);
```

### **2. Alertes de quota**

```javascript
{openaiUsage && openaiUsage.estimatedCost > 5 && (
  <div className="bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg">
    <span className="text-yellow-800 text-xs font-semibold">
      ⚠️ Coût élevé : ${openaiUsage.estimatedCost.toFixed(2)}
    </span>
  </div>
)}
```

### **3. Graphique d'utilisation**

Afficher un mini-graphique de l'évolution de l'usage dans le temps.

### **4. Crédit restant**

Afficher le crédit restant en temps réel (nécessite API supplémentaire).

---

## 📁 **Fichiers modifiés**

✅ **Backend :**
- `server/openai.js` - Fonction `getOpenAIUsage()`
- `server/index.js` - Endpoint `/api/admin/openai/usage`

✅ **Frontend :**
- `src/components/AppLayout.jsx` - Indicateur dans le header

---

## ✅ **Statut**

- 🟢 Backend : Endpoint fonctionnel
- 🟢 Frontend : Affichage dans le header
- 🟢 Rafraîchissement : Toutes les 5 minutes
- 🟢 Sécurité : Admin uniquement

**Fonctionnalité prête à l'emploi ! ⚡**

---

## 📝 **Notes**

- L'indicateur est **approximatif** (basé sur l'estimation)
- Pour un suivi précis, consulte https://platform.openai.com/usage
- Le coût peut varier selon la taille des images
- Les données ont un délai de ~24h via l'API OpenAI

**Rafraîchis la page pour voir l'indicateur ! 🚀**

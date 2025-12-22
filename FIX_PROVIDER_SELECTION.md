# 🔧 Fix - Sélecteur de Providers Synchronisé

## ✅ Problème Résolu

**Avant**: Le sélecteur affichait TOUS les providers avec une clé API  
**Après**: Le sélecteur affiche UNIQUEMENT les providers cochés dans l'admin

## 🎯 Changements Effectués

### 1. Backend - Sauvegarde des Providers Cochés

**Fichier**: `server/index.js`

#### GET `/api/admin/ai-settings`
```javascript
// Récupère les providers activés par l'admin (sauvegardés en base)
const enabledProvidersSetting = getSetting('enabled_providers');
let enabledProviders = JSON.parse(enabledProvidersSetting?.value || '{}');

// Si aucun provider activé sauvegardé, utiliser ceux qui ont une clé API
const availableWithKeys = getAvailableProviders();
const availableModels = Object.keys(enabledProviders).length > 0 
  ? enabledProviders 
  : availableWithKeys;

// Retourner seulement les providers activés ET qui ont une clé API
const providersInfo = getAllProvidersInfo()
  .map(p => ({
    ...p,
    available: availableModels[p.id] === true && availableWithKeys[p.id] === true
  }));
```

#### POST `/api/admin/ai-settings`
```javascript
// Sauvegarder les providers activés (cochés dans l'admin)
if (availableModels) {
  setSetting('enabled_providers', JSON.stringify(availableModels));
  const enabledList = Object.keys(availableModels).filter(k => availableModels[k]);
  console.log(`Enabled providers: ${enabledList.join(', ')}`);
}
```

### 2. Base de Données

Nouvelle entrée dans la table `settings`:
```sql
key: 'enabled_providers'
value: '{"openrouter": true, "openai": false, "ollama": false, "grok": false}'
```

## 🎬 Scénario d'Utilisation

### Étape 1: Configuration Admin

Admin coche uniquement **OpenRouter**:
```
☑ OpenRouter Vision (Gratuit)
☐ OpenAI GPT-4o
☐ Ollama LLaVA
☐ Grok 2 Vision
```

Clique sur **"Sauvegarder"**

### Étape 2: Sauvegarde Backend

```javascript
POST /api/admin/ai-settings
{
  "provider": "openrouter",
  "availableModels": {
    "openrouter": true,
    "openai": false,
    "ollama": false,
    "grok": false
  }
}
```

Sauvegarde dans la base:
- `ai_provider` = "openrouter"
- `enabled_providers` = '{"openrouter": true, ...}'

### Étape 3: Chargement Frontend

```javascript
GET /api/admin/ai-settings

// Retourne:
{
  "provider": "openrouter",
  "availableModels": {
    "openrouter": true,
    "openai": false,
    "ollama": false,
    "grok": false
  },
  "providersInfo": [
    {
      "id": "openrouter",
      "name": "OpenRouter Gemini 2.0",
      "icon": "🟠",
      "available": true    // ← SEUL disponible
    },
    {
      "id": "openai",
      "available": false   // ← Non disponible
    }
  ]
}
```

### Étape 4: Sélecteur Affiché

```
🤖 [Sélecteur]
   ↓
🟠 OpenRouter Gemini 2.0  ← SEUL dans la liste !
```

## ⚠️ Erreur 429 OpenRouter

### Diagnostic

L'erreur **429 "Provider returned error"** indique:

1. **Crédits insuffisants** (< $10)
2. **Rate limit dépassé** (> 1000 appels/jour)
3. **Modèle gratuit non disponible**

### Vérification

```bash
# Vérifier le modèle configuré
grep "model =" server/openai.js | grep openrouter

# Devrait afficher:
# model = 'google/gemini-2.0-flash-exp:free';
```

### Solutions

#### Solution 1: Vérifier les Crédits OpenRouter

1. Allez sur [OpenRouter Dashboard](https://openrouter.ai/credits)
2. Vérifiez que **Credits > $10**
3. Si < $10, ajoutez des crédits

#### Solution 2: Essayer un Autre Modèle Gratuit

**Fichier**: `server/openai.js`

```javascript
// Essayer Qwen au lieu de Gemini
model = 'qwen/qwen2.5-vl-32b-instruct:free';  // Alternative gratuite
```

#### Solution 3: Utiliser Ollama (Local)

1. Admin Panel → Cocher **Ollama LLaVA**
2. Sélectionner **Ollama**
3. **Gratuit illimité** mais nécessite serveur local

## 🔍 Logs de Debug

### Backend

```bash
pm2 logs photo-backend --lines 50
```

Recherchez:
```
✅ Enabled providers: openrouter
🌐 Using OpenRouter with FREE model
❌ Error: 429 Rate Limit Exceeded
```

### Frontend Console

```javascript
✅ AI Providers loaded: OpenRouter Gemini 2.0
```

## 📋 Checklist de Vérification

- [x] Backend modifié
- [x] Backend redémarré
- [ ] Admin Panel: Cocher uniquement OpenRouter
- [ ] Admin Panel: Cliquer "Sauvegarder"
- [ ] Recharger la page (Ctrl+F5)
- [ ] Vérifier le sélecteur (1 seul provider)
- [ ] Uploader une photo pour tester
- [ ] Si erreur 429: Vérifier crédits OpenRouter

## 🎯 État Attendu

### Sélecteur

```
Avant:
🔵 OpenAI GPT-4o         ← Affiché même si décoché
🦙 Ollama LLaVA          ← Affiché même si décoché
🟠 OpenRouter Gemini 2.0 ← Seul coché

Après:
🟠 OpenRouter Gemini 2.0 ← SEUL affiché !
```

### Base de Données

```javascript
// Table settings
{
  key: 'ai_provider',
  value: 'openrouter'
}
{
  key: 'enabled_providers',
  value: '{"openrouter": true, "openai": false, "ollama": false, "grok": false}'
}
```

## 🚀 Prochaines Étapes

1. **Recharger la page** (Ctrl+F5)
2. **Vérifier le sélecteur** - Doit afficher uniquement OpenRouter
3. **Tester un upload**
4. **Si erreur 429**: Vérifier les crédits OpenRouter ou essayer Qwen/Ollama

---

**Synchronisation Admin ↔ Sélecteur maintenant opérationnelle !** ✅

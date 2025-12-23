# 🆓 OpenRouter - Modèles GRATUITS

## ⚠️ RÈGLE IMPORTANTE

**Vous DEVEZ utiliser UNIQUEMENT des modèles GRATUITS !**

- ✅ 1000 appels gratuits par jour
- ✅ Condition: Crédit OpenRouter > $10
- ✅ Modèles avec `:free` à la fin du nom

## 🎯 Modèles Vision GRATUITS Disponibles

### Recommandé ⭐

```
google/gemini-2.0-flash-exp:free
```
- **Qualité**: ⭐⭐⭐⭐⭐ Excellent
- **Vitesse**: ⚡⚡⚡ Très rapide
- **Vision**: ✅ Oui
- **Prix**: 🆓 100% GRATUIT

### Alternatives Puissantes

| Modèle | Qualité | Taille | Vision |
|--------|---------|--------|--------|
| `qwen/qwen2.5-vl-72b-instruct:free` | ⭐⭐⭐⭐⭐ | 72B | ✅ |
| `qwen/qwen2.5-vl-32b-instruct:free` | ⭐⭐⭐⭐ | 32B | ✅ |
| `meta-llama/llama-4-maverick:free` | ⭐⭐⭐⭐ | - | ✅ |
| `meta-llama/llama-4-scout:free` | ⭐⭐⭐ | - | ✅ |

### Modèles Texte (sans vision)

| Modèle | Qualité | Taille |
|--------|---------|--------|
| `mistralai/mistral-small-3.2-24b-instruct:free` | ⭐⭐⭐⭐ | 24B |
| `google/gemma-3-27b-it:free` | ⭐⭐⭐⭐ | 27B |
| `google/gemma-3-12b-it:free` | ⭐⭐⭐ | 12B |
| `google/gemma-3-4b-it:free` | ⭐⭐ | 4B |

## 🔧 Configuration Actuelle

**Modèle configuré**: `google/gemini-2.0-flash-exp:free`

**Fichier**: `/apps/photo-v1/app/server/openai.js` ligne 278

```javascript
model = 'google/gemini-2.0-flash-exp:free';
```

## 📊 Comparaison avec Autres Providers

| Provider | Coût | Limite | Qualité Vision |
|----------|------|--------|----------------|
| **OpenRouter (Gemini 2.0)** | 🆓 Gratuit | 1000/jour | ⭐⭐⭐⭐⭐ |
| **Ollama (local)** | 🆓 Gratuit | Illimité | ⭐⭐⭐ |
| **OpenAI (GPT-4o)** | 💰 $0.01/img | Illimité | ⭐⭐⭐⭐⭐ |
| **Grok (Vision)** | 💰 Payant | Illimité | ⭐⭐⭐⭐ |

## ✅ Avantages d'OpenRouter Gratuit

1. **Aucun serveur local** (contrairement à Ollama)
2. **Qualité excellente** (Gemini 2.0 = niveau GPT-4)
3. **Rapide** (API cloud optimisée)
4. **1000 images/jour** (largement suffisant)
5. **Pas de coût** (contrairement à OpenAI)

## ⚠️ Points d'Attention

### Condition du Gratuit

```
Crédit OpenRouter >= $10
```

Si votre crédit descend sous $10, les modèles `:free` ne fonctionneront plus.

### Limite Quotidienne

```
1000 appels par jour
```

Au-delà, vous devrez attendre le lendemain ou passer à un modèle payant.

### Vérifier le Format

❌ **INTERDIT** (modèles payants):
```javascript
model = 'google/gemini-2.0-flash'  // Sans :free = PAYANT !
```

✅ **OBLIGATOIRE** (modèles gratuits):
```javascript
model = 'google/gemini-2.0-flash-exp:free'  // Avec :free = GRATUIT !
```

## 🔍 Comment Vérifier

### 1. Vérifier votre crédit OpenRouter

Allez sur [OpenRouter Dashboard](https://openrouter.ai/credits)

### 2. Vérifier l'utilisation

Logs backend:
```bash
pm2 logs photo-backend | grep "OpenRouter"
```

Devrait afficher:
```
🌐 Using OpenRouter with FREE model
```

### 3. Vérifier les erreurs

Si vous voyez:
```
Error: Insufficient credits
```

➡️ Votre crédit est < $10, ajoutez du crédit ou utilisez Ollama.

## 🚀 Utilisation

### Pour uploader 100 photos/jour

- **OpenRouter**: 🆓 Gratuit (< 1000/jour)
- **Ollama**: 🆓 Gratuit (mais serveur local)
- **OpenAI**: 💰 ~$1.00

### Pour uploader 500 photos/jour

- **OpenRouter**: 🆓 Gratuit (< 1000/jour)
- **Ollama**: 🆓 Gratuit
- **OpenAI**: 💰 ~$5.00

### Pour uploader 2000 photos/jour

- **OpenRouter**: ⚠️ Limité à 1000/jour → Utilisez Ollama
- **Ollama**: 🆓 Gratuit illimité
- **OpenAI**: 💰 ~$20.00

## 📝 Liste Complète des Modèles Gratuits

Pour obtenir la liste à jour:

```bash
curl -s 'https://openrouter.ai/api/v1/models' \
  -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
  | jq '.data[] | select(.pricing.prompt == "0") | {id, name}'
```

## 🎯 Recommandations

### Pour la meilleure qualité
```javascript
model = 'google/gemini-2.0-flash-exp:free';  // ⭐ Recommandé
```

### Pour le plus puissant
```javascript
model = 'qwen/qwen2.5-vl-72b-instruct:free';  // 72B paramètres
```

### Pour un bon équilibre
```javascript
model = 'qwen/qwen2.5-vl-32b-instruct:free';  // 32B paramètres
```

## 📚 Documentation

- [OpenRouter Models](https://openrouter.ai/models)
- [OpenRouter Pricing](https://openrouter.ai/docs#models)
- [Free Tier Info](https://openrouter.ai/docs#free-tier)

---

## ✅ Résumé

| Aspect | Valeur |
|--------|--------|
| **Modèle actuel** | `google/gemini-2.0-flash-exp:free` |
| **Coût** | 🆓 100% GRATUIT |
| **Limite** | 1000 appels/jour |
| **Condition** | Crédit OpenRouter > $10 |
| **Qualité** | ⭐⭐⭐⭐⭐ Excellente |
| **Vitesse** | ⚡⚡⚡ Très rapide |

**OpenRouter est configuré avec un modèle 100% GRATUIT !** 🎉

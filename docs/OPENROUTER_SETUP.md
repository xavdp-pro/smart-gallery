# 🌐 Configuration OpenRouter

## Qu'est-ce qu'OpenRouter ?

OpenRouter est un service qui donne accès à plusieurs modèles d'IA via une seule API, incluant des **modèles gratuits** de vision multimodale comme LLaVA.

## Configuration

### 1. Obtenir une Clé API

1. Créez un compte sur [OpenRouter](https://openrouter.ai/)
2. Obtenez votre clé API dans votre tableau de bord
3. Ajoutez-la au fichier `.env`:

```bash
OPENROUTER_API_KEY=sk-or-v1-votre-cle-ici
```

### 2. Modèles Vision GRATUITS Disponibles

OpenRouter propose plusieurs modèles vision **100% GRATUITS** pour l'analyse d'images (1000 appels/jour si crédit > $10):

| Modèle | Description | Prix | Performance |
|--------|-------------|------|-------------|
| **google/gemini-2.0-flash-exp:free** ⭐ | Gemini 2.0 Flash Experimental | 🆓 GRATUIT | ⭐⭐⭐⭐⭐ Excellent |
| **qwen/qwen2.5-vl-72b-instruct:free** | Qwen Vision 72B | 🆓 GRATUIT | ⭐⭐⭐⭐⭐ Très puissant |
| **qwen/qwen2.5-vl-32b-instruct:free** | Qwen Vision 32B | 🆓 GRATUIT | ⭐⭐⭐⭐ Puissant |
| **meta-llama/llama-4-maverick:free** | Llama 4 Maverick | 🆓 GRATUIT | ⭐⭐⭐⭐ Très bon |

> ⭐ **Modèle par défaut**: `google/gemini-2.0-flash-exp:free` - Gratuit et excellent !
> 
> ⚠️ **RÈGLE IMPORTANTE**: Vous avez 1000 appels gratuits par jour si votre crédit reste > $10. Utilisez UNIQUEMENT les modèles avec `:free` à la fin.

### 3. Activation

1. Redémarrez le serveur backend après avoir ajouté la clé
2. Connectez-vous en tant qu'administrateur
3. Allez dans **Paramètres Admin** → **Paramètres IA**
4. Sélectionnez **OpenRouter**
5. Cliquez sur **Enregistrer**

## Fonctionnalités

### ✅ Analyse d'Images
- Description détaillée en français
- Extraction de tags exhaustifs
- Détection des couleurs dominantes
- Évaluation de la qualité

### 💰 Avantages
- **100% GRATUIT** (1000 appels/jour si crédit > $10)
- Pas de serveur local requis
- API compatible OpenAI
- Modèles très performants (Gemini 2.0, Qwen, Llama 4)

## Architecture

```
Photo Manager
    ↓
OpenRouter API
    ↓
[LLaVA 13B] [LLaVA Yi 34B] [FireLLaVA 13B]
```

## Changement de Modèle

⚠️ **IMPORTANT**: Utilisez UNIQUEMENT des modèles avec `:free` à la fin !

Pour utiliser un autre modèle gratuit, modifiez `server/openai.js`:

```javascript
// Dans la section OpenRouter
if (provider === 'openrouter') {
  console.log('🌐 Using OpenRouter with FREE model');
  client = openrouter;
  
  // Choisir un modèle GRATUIT (avec :free à la fin):
  model = 'google/gemini-2.0-flash-exp:free';          // Excellent (défaut) ⭐
  // model = 'qwen/qwen2.5-vl-72b-instruct:free';       // Très puissant
  // model = 'qwen/qwen2.5-vl-32b-instruct:free';       // Puissant
  // model = 'meta-llama/llama-4-maverick:free';        // Très bon
}
```

## Comparaison des Providers

| Provider | Coût | Qualité | Vitesse | Vision |
|----------|------|---------|---------|--------|
| **OpenRouter** (Gemini 2.0) | 🆓 GRATUIT | ⭐⭐⭐⭐⭐ Excellent | ⚡⚡⚡ Rapide | ✅ Oui |
| **Ollama** (LLaVA local) | 🆓 Gratuit | ⭐⭐⭐ Bon | ⚡⚡ Moyen | ✅ Oui |
| **OpenAI** (GPT-4o) | 💰 Payant | ⭐⭐⭐⭐⭐ Excellent | ⚡⚡⚡ Rapide | ✅ Oui |
| **Grok** (Vision) | 💰 Payant | ⭐⭐⭐⭐ Très bon | ⚡⚡⚡ Rapide | ✅ Oui |

## Dépannage

### Erreur d'authentification
```bash
# Vérifiez que la clé est bien configurée
grep OPENROUTER_API_KEY .env

# La clé doit commencer par sk-or-v1-
```

### Le provider n'apparaît pas
```bash
# Redémarrez le serveur backend
pm2 restart photo-v1-backend

# Ou en développement
npm run server
```

### Erreur "Model not found"
Vérifiez que vous utilisez bien un des modèles vision disponibles listés ci-dessus.

## Liens Utiles

- 🌐 [OpenRouter](https://openrouter.ai/)
- 📚 [Documentation OpenRouter](https://openrouter.ai/docs)
- 🤖 [Liste des modèles](https://openrouter.ai/models)
- 💬 [Support OpenRouter](https://openrouter.ai/support)

## Notes Techniques

### Headers Requis
OpenRouter nécessite des headers spécifiques pour la traçabilité:
- `HTTP-Referer`: URL de votre application
- `X-Title`: Nom de votre application

Ces headers sont automatiquement configurés dans le code.

### Format de Réponse
OpenRouter utilise le format OpenAI compatible, donc l'intégration est transparente avec le code existant.

## Résumé

✅ **OpenRouter est maintenant configuré** avec **Gemini 2.0 Flash Experimental (GRATUIT)**

Pour l'utiliser:
1. Assurez-vous que `OPENROUTER_API_KEY` est dans `.env`
2. Redémarrez le serveur
3. Sélectionnez **OpenRouter** dans les paramètres admin
4. Uploadez une photo pour tester !

🎉 **Profitez de l'analyse d'images 100% GRATUITE (1000 appels/jour) !**

⚠️ **RAPPEL**: Gardez votre crédit OpenRouter > $10 pour bénéficier des 1000 appels gratuits quotidiens.

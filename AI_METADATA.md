# 🤖 Métadonnées IA Enrichies

## ✅ **Fonctionnalités implémentées**

### **1. Description détaillée + Ambiance**
L'IA génère maintenant :
- **Description** : 2-3 phrases détaillées sur l'image
- **Atmosphère** : Le mood et l'ambiance de la scène

**Exemple :**
```json
{
  "description": "A black and white cat sits comfortably on a bamboo table, gazing curiously at the camera in a cozy domestic setting",
  "atmosphere": "calm, peaceful, cozy home environment"
}
```

### **2. Couleurs dominantes**
L'IA détecte automatiquement les couleurs principales avec :
- **Code couleur hex** (#RRGGBB)
- **Nom de la couleur**
- **Pourcentage** de présence dans l'image

**Exemple :**
```json
{
  "dominant_colors": [
    {"hex": "#2C5F4D", "name": "dark green", "percentage": 40},
    {"hex": "#F5E6D3", "name": "cream white", "percentage": 30},
    {"hex": "#1A1A1A", "name": "black", "percentage": 20}
  ]
}
```

### **3. Score de qualité**
L'IA évalue la qualité technique de la photo :
- **Score global** : 0-100
- **Netteté** : excellent / good / average / poor
- **Éclairage** : excellent / good / average / poor
- **Composition** : excellent / good / average / poor
- **Note globale** : excellent / good / average / poor

**Exemple :**
```json
{
  "quality": {
    "score": 92,
    "sharpness": "excellent",
    "lighting": "good",
    "composition": "excellent",
    "overall_rating": "excellent"
  }
}
```

---

## 📊 **Structure de données**

### **Base de données**

Nouvelle table `photo_metadata` :
```sql
CREATE TABLE photo_metadata (
  photo_id INTEGER PRIMARY KEY,
  description TEXT,
  atmosphere TEXT,
  dominant_colors TEXT,  -- JSON array
  quality_score INTEGER,
  quality_sharpness TEXT,
  quality_lighting TEXT,
  quality_composition TEXT,
  quality_overall TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
);
```

### **API Response**

Endpoint: `GET /api/photos/:id`

Retourne maintenant :
```json
{
  "id": 1,
  "filename": "cat24.jpg",
  "path": "/uploads/cat24.jpg",
  "created_at": "2025-10-05T20:00:00Z",
  "tags": [
    {"id": 1, "name": "cat"},
    {"id": 2, "name": "animal"}
  ],
  "metadata": {
    "photo_id": 1,
    "description": "A curious black and white cat...",
    "atmosphere": "cozy, calm, peaceful",
    "dominant_colors": [
      {"hex": "#2C5F4D", "name": "green", "percentage": 40}
    ],
    "quality_score": 92,
    "quality_sharpness": "excellent",
    "quality_lighting": "good",
    "quality_composition": "excellent",
    "quality_overall": "excellent"
  }
}
```

---

## 🔧 **Fichiers modifiés**

### **Backend**

1. **`server/openai.js`**
   - Modifié le prompt pour demander un JSON structuré
   - Retourne maintenant : `{ tags, description, atmosphere, colors, quality }`

2. **`server/database.js`**
   - Ajouté la table `photo_metadata`
   - Ajouté les fonctions :
     - `savePhotoMetadata(photoId, metadata)`
     - `getPhotoMetadata(photoId)`

3. **`server/queue.js`**
   - Sauvegarde les métadonnées après l'analyse IA
   - Appelle `savePhotoMetadata()` après avoir sauvegardé les tags

4. **`server/index.js`**
   - Endpoint `GET /api/photos/:id` retourne maintenant les métadonnées
   - Import de `getPhotoMetadata`

---

## 🎨 **Interface utilisateur (À implémenter)**

### **Affichage dans PhotoGallery**

Dans la zone centrale où s'affiche la photo sélectionnée, ajouter :

```jsx
{/* AI Analysis Panel */}
{selectedPhoto?.metadata && (
  <div className="mt-4 p-4 bg-white rounded-lg shadow-sm space-y-4">
    {/* Description */}
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">
        📝 Description
      </h3>
      <p className="text-sm text-gray-600">
        {selectedPhoto.metadata.description}
      </p>
      <p className="text-xs text-gray-500 mt-1 italic">
        {selectedPhoto.metadata.atmosphere}
      </p>
    </div>

    {/* Dominant Colors */}
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">
        🎨 Couleurs dominantes
      </h3>
      <div className="flex gap-2">
        {selectedPhoto.metadata.dominant_colors?.map((color, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <div 
              className="w-8 h-8 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: color.hex }}
              title={`${color.name} (${color.percentage}%)`}
            />
            <span className="text-xs text-gray-600">
              {color.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Quality Score */}
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">
        ⭐ Qualité de l'image
      </h3>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-blue-600">
            {selectedPhoto.metadata.quality_score}/100
          </div>
          <span className="text-xs text-gray-500 uppercase">
            {selectedPhoto.metadata.quality_overall}
          </span>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium">Netteté</div>
            <div className="text-gray-600">
              {selectedPhoto.metadata.quality_sharpness}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium">Éclairage</div>
            <div className="text-gray-600">
              {selectedPhoto.metadata.quality_lighting}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium">Composition</div>
            <div className="text-gray-600">
              {selectedPhoto.metadata.quality_composition}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
```

---

## 🚀 **Test et vérification**

### **1. Redémarrer le backend**
```bash
cd /apps/photo-v1/app
pm2 restart photo-backend
```

### **2. Uploader une nouvelle photo**
- Les métadonnées seront générées automatiquement
- Vérifier dans la console que les métadonnées sont sauvegardées

### **3. Tester l'API**
```bash
curl http://localhost:5001/api/photos/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Devrait retourner un objet avec `metadata`.

### **4. Vérifier la base de données**
```bash
sqlite3 database.db
SELECT * FROM photo_metadata;
```

---

## 📈 **Évolutions futures**

### **Fonctionnalités supplémentaires possibles**

- **Recherche par couleur** : Filtrer les photos par couleur dominante
- **Tri par qualité** : Afficher les meilleures photos en premier
- **Détection de similarité** : Grouper les photos similaires
- **OCR** : Extraire le texte des images
- **Reconnaissance de lieux** : Identifier les endroits

---

## 🎯 **Statut**

✅ **Backend** : Implémenté et fonctionnel
⏳ **Frontend** : À implémenter (code fourni ci-dessus)
⏳ **Tests** : À effectuer après redémarrage

---

**Prochaine étape** : Implémenter l'affichage dans le frontend ! 🎨

import OpenAI from 'openai';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { getSetting } from './database.js';
import { AI_PROVIDERS_CONFIG } from './ai-providers-config.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Client Grok (xAI)
const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

// Client OpenRouter (modèles gratuits LLaVA)
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL || 'https://photo-v1.c9.ooo.ovh',
    'X-Title': 'Photo Manager V1'
  }
});

// Fonction pour récupérer l'usage et les crédits OpenAI
export async function getOpenAIUsage() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    // 1. Récupérer les informations de facturation (crédit restant)
    const billingResponse = await fetch(
      'https://api.openai.com/v1/dashboard/billing/credit_grants',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let totalGranted = 0;
    let totalUsed = 0;
    let totalAvailable = 0;

    if (billingResponse.ok) {
      const billingData = await billingResponse.json();
      totalGranted = billingData.total_granted || 0;
      totalUsed = billingData.total_used || 0;
      totalAvailable = billingData.total_available || 0;
    }

    // 2. Récupérer l'usage du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const usageResponse = await fetch(
      `https://api.openai.com/v1/dashboard/billing/usage?start_date=${startOfMonth.toISOString().split('T')[0]}&end_date=${endOfMonth.toISOString().split('T')[0]}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let monthlyUsageCents = 0;
    if (usageResponse.ok) {
      const usageData = await usageResponse.json();
      monthlyUsageCents = usageData.total_usage || 0;
    }

    return {
      success: true,
      creditRemaining: totalAvailable / 100, // Convertir centimes en dollars
      creditTotal: totalGranted / 100,
      creditUsed: totalUsed / 100,
      monthlyUsage: monthlyUsageCents / 100,
      period: 'Mois en cours'
    };
  } catch (error) {
    console.error('Error fetching OpenAI usage:', error);
    return {
      success: false,
      error: error.message,
      creditRemaining: 0,
      creditTotal: 0,
      creditUsed: 0,
      monthlyUsage: 0
    };
  }
}

export async function analyzeImage(imagePath) {
  try {
    // Récupérer le provider configuré
    const providerSetting = getSetting('ai_provider');
    const provider = providerSetting?.value || 'ollama';

    console.log(`🤖 Using AI provider: ${provider.toUpperCase()}`);

    // Read the image file and convert to base64
    const imageBuffer = readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    // OLLAMA - Utiliser votre instance Ollama locale avec LLaVA
    if (provider === 'ollama') {
      console.log('🦙 Using Ollama with LLaVA');

      const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

      // Appeler Ollama avec LLaVA pour analyse vision
      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llava:7b',
          prompt: `Décris cette image en français de manière détaillée en incluant tous les objets visibles, les couleurs, l'ambiance, le style, la composition et l'éclairage.`,
          images: [base64Image],
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama error response:', errorText);
        throw new Error(`Ollama API error (${response.status}): ${errorText || response.statusText}`);
      }

      const result = await response.json();
      const description = result.response || '';

      console.log('🦙 LLaVA response:', description.substring(0, 200));

      // Extraire des tags intelligemment de la description
      const stopWords = ['cette', 'dans', 'avec', 'pour', 'sont', 'très', 'plus', 'comme', 'peut', 'être', 'fait', 'tous', 'tout'];
      const words = description.toLowerCase()
        .replace(/[.,;:!?()]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && w.length < 25 && !stopWords.includes(w));

      const tags = [...new Set(words)].slice(0, 60);

      // Extraire les couleurs dominantes de l'image avec Sharp
      const sharp = (await import('sharp')).default;
      const stats = await sharp(imageBuffer)
        .resize(150, 150, { fit: 'cover' })
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Fonction pour nommer une couleur de manière précise
      function getColorName(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const lightness = (max + min) / 2;
        const saturation = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));

        // Couleurs achromatiques (noir, blanc, gris)
        if (saturation < 0.15) {
          if (lightness > 220) return 'blanc';
          if (lightness < 40) return 'noir';
          if (lightness > 160) return 'gris clair';
          if (lightness < 90) return 'gris foncé';
          return 'gris';
        }

        // Couleurs chromatiques
        const dominantChannel = Math.max(r, g, b);
        const isRed = r === dominantChannel;
        const isGreen = g === dominantChannel;
        const isBlue = b === dominantChannel;

        // Marron/Beige (rouge+vert, peu de bleu, pas trop lumineux)
        if (r > 80 && g > 60 && b < 140 && r > b && g > b && Math.abs(r - g) < 80) {
          if (lightness < 100) return 'marron';
          if (lightness < 150) return 'beige';
          return 'beige clair';
        }

        // Orange (rouge + vert moyen, peu de bleu)
        if (isRed && r > 180 && g > 80 && g < 180 && b < 100) return 'orange';

        // Jaune (rouge + vert, peu de bleu)
        if (r > 180 && g > 180 && b < 140) return 'jaune';

        // Rose (rouge dominant, bleu moyen, lumineux)
        if (isRed && b > 120 && lightness > 140) return 'rose';

        // Rouge
        if (isRed && r > 140 && g < 100 && b < 100) return 'rouge';

        // Violet/Mauve (rouge + bleu)
        if (r > 100 && b > 100 && Math.abs(r - b) < 60 && g < Math.min(r, b) - 20) {
          return lightness > 140 ? 'mauve' : 'violet';
        }

        // Cyan (vert + bleu, peu de rouge)
        if (g > 120 && b > 120 && r < 100) return 'cyan';

        // Vert
        if (isGreen && g > 100 && r < 120 && b < 120) {
          return lightness > 160 ? 'vert clair' : 'vert';
        }

        // Bleu
        if (isBlue && b > 100 && r < 120 && g < 140) {
          return lightness > 160 ? 'bleu clair' : 'bleu';
        }

        return 'couleur';
      }

      // Calculer les couleurs dominantes avec clustering optimisé
      const colorMap = {};
      const pixels = stats.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Clustering plus large pour regrouper les couleurs similaires
        const rr = Math.round(r / 40) * 40;
        const gg = Math.round(g / 40) * 40;
        const bb = Math.round(b / 40) * 40;
        const key = `${rr},${gg},${bb}`;

        colorMap[key] = (colorMap[key] || 0) + 1;
      }

      // Trier et prendre les 5 couleurs les plus fréquentes
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const totalPixels = pixels.length / 4;
      const colors = sortedColors.map(([color, count]) => {
        const [r, g, b] = color.split(',').map(Number);
        const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        const percentage = Math.round((count / totalPixels) * 100);
        const name = getColorName(r, g, b);

        return { hex, name, percentage };
      }).filter(c => c.percentage > 0);

      return {
        tags: tags.slice(0, 100),
        description: description,
        atmosphere: 'Analysé par Ollama LLaVA',
        colors: colors,
        quality: {
          score: 80,
          sharpness: 'bon',
          lighting: 'bon',
          composition: 'bon',
          overall_rating: 'bon'
        },
        aiModel: 'llava'
      };
    }

    // Choisir le client et le modèle selon le provider
    let client, model;

    if (provider === 'grok') {
      client = grok;
      model = AI_PROVIDERS_CONFIG.grok.model;
    } else if (provider === 'openrouter') {
      console.log('🌐 Using OpenRouter with model:', AI_PROVIDERS_CONFIG.openrouter.model);
      client = openrouter;
      model = AI_PROVIDERS_CONFIG.openrouter.model;
    } else {
      client = openai;
      model = AI_PROVIDERS_CONFIG.openai.model;
    }

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "Tu es un expert en analyse d'images. Tu fournis des analyses complètes et détaillées incluant des tags, descriptions, couleurs et évaluation de qualité. Tu réponds TOUJOURS en français."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyse cette image en détail extrême et fournis une analyse complète au format JSON.

IMPORTANT: 
- TOUS les tags doivent être en FRANÇAIS
- La description doit être en FRANÇAIS
- L'atmosphère doit être en FRANÇAIS
- Les noms de couleurs doivent être en FRANÇAIS

Retourne un objet JSON avec la structure suivante:
{
  "tags": ["tag1", "tag2", ...],
  "description": "Description détaillée de l'image en français (2-3 phrases). COMMENCE TOUJOURS par identifier le TYPE DE LIEU précis (ex: 'Cuisine aménagée moderne...', 'Salon spacieux...', 'Chambre cosy...', 'Bureau professionnel...', 'Jardin paysager...', etc.)",
  "atmosphere": "L'ambiance et le mood de la scène en français",
  "dominant_colors": [
    {"hex": "#RRGGBB", "name": "nom de la couleur en français", "percentage": 40},
    {"hex": "#RRGGBB", "name": "nom de la couleur en français", "percentage": 30},
    {"hex": "#RRGGBB", "name": "nom de la couleur en français", "percentage": 20}
  ],
  "quality": {
    "score": 85,
    "sharpness": "excellent|bon|moyen|faible",
    "lighting": "excellent|bon|moyen|faible",
    "composition": "excellent|bon|moyen|faible",
    "overall_rating": "excellent|bon|moyen|faible"
  }
}

Pour les TAGS (TOUS EN FRANÇAIS), inclus TOUTES ces catégories:
1. TYPE DE LIEU (PRIORITAIRE): Identifie précisément le type de lieu et son aménagement
   - Intérieur: "cuisine aménagée", "cuisine moderne", "cuisine équipée", "salon", "chambre", "salle de bain", "bureau", "salle à manger", "entrée", "couloir", "cave", "grenier", "garage"
   - Commercial: "restaurant", "café", "boutique", "magasin", "hôtel", "bureau professionnel"
   - Extérieur: "jardin", "terrasse", "balcon", "piscine", "parc", "rue", "place", "forêt", "montagne", "plage"
   - État/Style: "aménagé", "équipé", "meublé", "vide", "en travaux", "rénové", "neuf", "ancien"
2. OBJETS: Chaque objet visible, élément (meubles, outils, appareils, électroménager, etc.)
3. SUJETS: Personnes, animaux, sujets principaux (avec détails: âge, genre, pose, expression, vêtements)
4. COULEURS: Couleurs dominantes, palettes de couleurs, tons (chauds/froids), nuances spécifiques
5. ÉCLAIRAGE: Naturel/artificiel, moment de la journée, qualité de la lumière (douce/dure), ombres, luminosité
6. COMPOSITION: Perspective, cadrage, profondeur de champ, règle des tiers, symétrie
7. AMBIANCE/ATMOSPHÈRE: Émotions, sentiments, ambiance (paisible, énergique, mystérieux, etc.)
8. ACTIVITÉS: Actions en cours, activités suggérées
9. STYLE: Style photographique, style artistique, esthétique (moderne, vintage, minimaliste, etc.)
10. TEXTURES: Qualités de surface (lisse, rugueux, doux, métallique, etc.)
11. MOTIFS: Rayures, points, motifs géométriques, motifs organiques
12. MÉTÉO: Si extérieur (ensoleillé, nuageux, pluvieux, brumeux, etc.)
13. SAISON: Indicateurs de printemps, été, automne, hiver
14. TECHNIQUE: Type de photo (portrait, paysage, macro, aérien, etc.)

Génère 50-100+ tags EXHAUSTIFS en FRANÇAIS.

Retourne UNIQUEMENT l'objet JSON, aucun autre texte.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content.trim();

    // Parse JSON response
    let analysisData;
    try {
      // Remove markdown code blocks if present
      const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      analysisData = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.error('Raw content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Clean up tags
    const tags = analysisData.tags
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length < 50);

    return {
      tags,
      description: analysisData.description || '',
      atmosphere: analysisData.atmosphere || '',
      colors: analysisData.dominant_colors || [],
      quality: analysisData.quality || { score: 75, sharpness: 'good', lighting: 'good', composition: 'good', overall_rating: 'good' },
      aiModel: model // Retourner le modèle utilisé
    };
  } catch (error) {
    console.error('Error analyzing image with OpenAI:', error);
    throw error;
  }
}

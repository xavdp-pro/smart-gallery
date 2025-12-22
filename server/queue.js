import Queue from 'bull';
import { analyzeImage } from './openai.js';
import { createTag, getTagByName, addPhotoTag, getPhotoById, getPhotoTags, savePhotoMetadata, getPhotoMetadata } from './database.js';

// Créer une queue en mémoire (pas besoin de Redis pour le MVP)
export const photoQueue = new Queue('photo-processing', {
  redis: {
    port: 6379,
    host: '127.0.0.1',
  },
  settings: {
    maxStalledCount: 3,
    stalledInterval: 30000,
  }
});

// Traiter les jobs de la queue
photoQueue.process(async (job) => {
  const { photoId, imagePath, socketId } = job.data;
  
  try {
    // Étape 1: Début de l'analyse
    job.progress(10);
    if (global.io && socketId) {
      global.io.to(socketId).emit('photo:progress', {
        photoId,
        stage: 'analyzing',
        progress: 10,
        message: 'Analyse de l\'image en cours...'
      });
    }

    // Étape 2: Appel à l'API OpenAI
    job.progress(30);
    if (global.io && socketId) {
      global.io.to(socketId).emit('photo:progress', {
        photoId,
        stage: 'ai-processing',
        progress: 30,
        message: 'Intelligence artificielle en action...'
      });
    }

    const analysisResult = await analyzeImage(imagePath);
    
    // Étape 3: Sauvegarde des tags et métadonnées
    job.progress(70);
    if (global.io && socketId) {
      global.io.to(socketId).emit('photo:progress', {
        photoId,
        stage: 'saving-tags',
        progress: 70,
        message: `${analysisResult.tags.length} tags générés, sauvegarde...`
      });
    }

    // Sauvegarder les tags
    for (const tagName of analysisResult.tags) {
      createTag(tagName);
      const tag = getTagByName(tagName);
      if (tag) {
        addPhotoTag(photoId, tag.id);
      }
    }

    // Sauvegarder les métadonnées (description, ambiance, couleurs, qualité, modèle IA)
    savePhotoMetadata(photoId, {
      description: analysisResult.description,
      atmosphere: analysisResult.atmosphere,
      colors: analysisResult.colors,
      quality: analysisResult.quality,
      aiModel: analysisResult.aiModel
    });

    // Étape 4: Terminé
    job.progress(100);
    const photo = getPhotoById(photoId);
    const photoTags = getPhotoTags(photoId);
    const photoMetadata = getPhotoMetadata(photoId);

    if (global.io && socketId) {
      global.io.to(socketId).emit('photo:complete', {
        photoId,
        photo: { ...photo, tags: photoTags, metadata: photoMetadata },
        message: `Photo analysée avec succès! ${photoTags.length} tags générés.`
      });
    }

    return { success: true, photoId, tagsCount: photoTags.length };
  } catch (error) {
    console.error('Error processing photo:', error);
    
    if (global.io && socketId) {
      global.io.to(socketId).emit('photo:error', {
        photoId,
        error: error.message,
        message: 'Erreur lors de l\'analyse de la photo'
      });
    }
    
    throw error;
  }
});

// Événements de la queue
photoQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

photoQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

photoQueue.on('progress', (job, progress) => {
  console.log(`📊 Job ${job.id} progress: ${progress}%`);
});

export default photoQueue;

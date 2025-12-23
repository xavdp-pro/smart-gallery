import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, Users, Camera, Tag, Shield, Zap, 
  Server, Database, Code, Globe, ChevronDown, ChevronRight,
  Upload, Search, Download, Trash2, Settings, Lock
} from 'lucide-react';

export default function Documentation() {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('user');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const content = {
    fr: {
      title: "Documentation",
      subtitle: "Guide d'utilisation de Smart Gallery",
      poc: {
        title: "🚀 Proof of Concept",
        description: "Smart Gallery est un prototype fonctionnel démontrant les capacités d'une galerie photo intelligente avec tagging IA. Cette application est prête à être étendue pour un usage professionnel.",
        features: [
          "Architecture modulaire et extensible",
          "API RESTful documentée",
          "Support multi-providers IA (OpenAI, Grok, OpenRouter)",
          "Authentification JWT sécurisée",
          "Base de données SQLite (facilement migratable vers PostgreSQL)"
        ]
      },
      userGuide: {
        title: "Guide Utilisateur",
        sections: [
          {
            icon: Upload,
            title: "Télécharger des photos",
            content: "Glissez-déposez vos photos dans la zone de téléchargement ou cliquez pour sélectionner des fichiers. Les formats supportés sont JPG, PNG, GIF et WebP. Taille maximale : 20 Mo par fichier."
          },
          {
            icon: Tag,
            title: "Tags automatiques IA",
            content: "Chaque photo est automatiquement analysée par l'IA qui génère des tags descriptifs. L'analyse inclut : objets, personnes, lieux, couleurs, ambiance, et plus encore."
          },
          {
            icon: Search,
            title: "Rechercher des photos",
            content: "Utilisez la barre de recherche pour trouver des photos par nom ou par tag. La recherche est instantanée et insensible à la casse."
          },
          {
            icon: Download,
            title: "Télécharger des photos",
            content: "Survolez une photo et cliquez sur l'icône de téléchargement pour la sauvegarder sur votre appareil avec son nom original."
          },
          {
            icon: Trash2,
            title: "Supprimer des photos",
            content: "Survolez une photo et cliquez sur l'icône de suppression. Une confirmation vous sera demandée avant la suppression définitive."
          },
          {
            icon: Tag,
            title: "Gérer les tags manuels",
            content: "Cliquez sur une photo pour voir ses détails. Vous pouvez ajouter des tags personnalisés ou supprimer des tags existants."
          }
        ]
      },
      techGuide: {
        title: "Documentation Technique",
        sections: [
          {
            icon: Server,
            title: "Architecture & Stack Technique",
            content: `
**Frontend**
• React 18.3.1 - Framework UI
• Vite 5.4.2 - Build tool
• TailwindCSS 3.4.1 - Styling
• react-i18next 15.1.3 - i18n (FR/EN/ES)
• Lucide React - Icônes
• React Router 6.28.0 - Routing
• React Hot Toast - Notifications

**Backend**
• Node.js 18+ - Runtime
• Express 4.21.1 - Framework web
• SQLite (better-sqlite3 11.7.0) - Base de données
• BullMQ 5.28.2 + Redis - File d'attente async
• Socket.IO 4.8.1 - Temps réel
• Multer 1.4.5 - Upload fichiers
• Sharp 0.33.5 - Traitement images

**Sécurité**
• JWT (jsonwebtoken 9.0.2) - Auth
• bcrypt 5.1.1 - Hash passwords
• CORS 2.8.5 - Protection

**IA**
• OpenAI GPT-4o
• Grok 2 Vision
• OpenRouter (Gemini 2.0 Flash, Qwen, Llama)
• Ollama LLaVA 7B (local)
            `
          },
          {
            icon: Lock,
            title: "Authentification",
            content: `
**JWT (JSON Web Tokens)**
- Tokens signés avec secret configurable
- Expiration configurable (défaut : 7 jours)
- Refresh automatique côté client

**Sécurité**
- Mots de passe hashés avec bcrypt (10 rounds)
- Protection CSRF via tokens
- Headers de sécurité (X-Frame-Options, etc.)
            `
          },
          {
            icon: Zap,
            title: "Providers IA",
            content: `
**OpenAI** (GPT-4o-mini)
- Vision API pour l'analyse d'images
- Génération de tags multilingues

**Grok** (xAI)
- Alternative à OpenAI
- Modèle grok-vision-beta

**OpenRouter**
- Accès à multiples modèles
- Modèles gratuits disponibles
            `
          },
          {
            icon: Globe,
            title: "Déploiement",
            content: `
**Option A : Cloudflare Tunnel**
- Accès sécurisé sans ouvrir de ports
- SSL automatique
- Protection DDoS incluse

**Option B : Nginx**
- Reverse proxy classique
- SSL via Let's Encrypt
- Configuration WebSocket pour Socket.IO
            `
          },
          {
            icon: Database,
            title: "API Endpoints",
            content: `
**Authentification**
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

**Photos**
- GET /api/photos
- POST /api/photos
- DELETE /api/photos/:id
- GET /api/photos/:id/tags
- POST /api/photos/:id/tags

**Admin**
- GET /api/admin/users
- POST /api/admin/users
- PUT /api/admin/users/:id
- DELETE /api/admin/users/:id
            `
          }
        ]
      }
    },
    en: {
      title: "Documentation",
      subtitle: "Smart Gallery User Guide",
      poc: {
        title: "🚀 Proof of Concept",
        description: "Smart Gallery is a functional prototype demonstrating the capabilities of an intelligent photo gallery with AI tagging. This application is ready to be extended for professional use.",
        features: [
          "Modular and extensible architecture",
          "Documented RESTful API",
          "Multi-provider AI support (OpenAI, Grok, OpenRouter)",
          "Secure JWT authentication",
          "SQLite database (easily migratable to PostgreSQL)"
        ]
      },
      userGuide: {
        title: "User Guide",
        sections: [
          {
            icon: Upload,
            title: "Upload photos",
            content: "Drag and drop your photos into the upload area or click to select files. Supported formats are JPG, PNG, GIF and WebP. Maximum size: 20 MB per file."
          },
          {
            icon: Tag,
            title: "Automatic AI tags",
            content: "Each photo is automatically analyzed by AI which generates descriptive tags. Analysis includes: objects, people, places, colors, mood, and more."
          },
          {
            icon: Search,
            title: "Search photos",
            content: "Use the search bar to find photos by name or tag. Search is instant and case-insensitive."
          },
          {
            icon: Download,
            title: "Download photos",
            content: "Hover over a photo and click the download icon to save it to your device with its original name."
          },
          {
            icon: Trash2,
            title: "Delete photos",
            content: "Hover over a photo and click the delete icon. A confirmation will be requested before permanent deletion."
          },
          {
            icon: Tag,
            title: "Manage manual tags",
            content: "Click on a photo to see its details. You can add custom tags or remove existing tags."
          }
        ]
      },
      techGuide: {
        title: "Technical Documentation",
        sections: [
          {
            icon: Server,
            title: "Architecture & Tech Stack",
            content: `
**Frontend**
• React 18.3.1 - UI Framework
• Vite 5.4.2 - Build tool
• TailwindCSS 3.4.1 - Styling
• react-i18next 15.1.3 - i18n (FR/EN/ES)
• Lucide React - Icons
• React Router 6.28.0 - Routing
• React Hot Toast - Notifications

**Backend**
• Node.js 18+ - Runtime
• Express 4.21.1 - Web framework
• SQLite (better-sqlite3 11.7.0) - Database
• BullMQ 5.28.2 + Redis - Async queue
• Socket.IO 4.8.1 - Real-time
• Multer 1.4.5 - File upload
• Sharp 0.33.5 - Image processing

**Security**
• JWT (jsonwebtoken 9.0.2) - Auth
• bcrypt 5.1.1 - Password hashing
• CORS 2.8.5 - Protection

**AI**
• OpenAI GPT-4o
• Grok 2 Vision
• OpenRouter (Gemini 2.0 Flash, Qwen, Llama)
• Ollama LLaVA 7B (local)
            `
          },
          {
            icon: Lock,
            title: "Authentication",
            content: `
**JWT (JSON Web Tokens)**
- Tokens signed with configurable secret
- Configurable expiration (default: 7 days)
- Automatic client-side refresh

**Security**
- Passwords hashed with bcrypt (10 rounds)
- CSRF protection via tokens
- Security headers (X-Frame-Options, etc.)
            `
          },
          {
            icon: Zap,
            title: "AI Providers",
            content: `
**OpenAI** (GPT-4o-mini)
- Vision API for image analysis
- Multilingual tag generation

**Grok** (xAI)
- Alternative to OpenAI
- grok-vision-beta model

**OpenRouter**
- Access to multiple models
- Free models available
            `
          },
          {
            icon: Globe,
            title: "Deployment",
            content: `
**Option A: Cloudflare Tunnel**
- Secure access without opening ports
- Automatic SSL
- DDoS protection included

**Option B: Nginx**
- Classic reverse proxy
- SSL via Let's Encrypt
- WebSocket configuration for Socket.IO
            `
          },
          {
            icon: Database,
            title: "API Endpoints",
            content: `
**Authentication**
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

**Photos**
- GET /api/photos
- POST /api/photos
- DELETE /api/photos/:id
- GET /api/photos/:id/tags
- POST /api/photos/:id/tags

**Admin**
- GET /api/admin/users
- POST /api/admin/users
- PUT /api/admin/users/:id
- DELETE /api/admin/users/:id
            `
          }
        ]
      }
    },
    es: {
      title: "Documentación",
      subtitle: "Guía de uso de Smart Gallery",
      poc: {
        title: "🚀 Prueba de Concepto",
        description: "Smart Gallery es un prototipo funcional que demuestra las capacidades de una galería de fotos inteligente con etiquetado IA. Esta aplicación está lista para ser extendida para uso profesional.",
        features: [
          "Arquitectura modular y extensible",
          "API RESTful documentada",
          "Soporte multi-proveedor IA (OpenAI, Grok, OpenRouter)",
          "Autenticación JWT segura",
          "Base de datos SQLite (fácilmente migrable a PostgreSQL)"
        ]
      },
      userGuide: {
        title: "Guía de Usuario",
        sections: [
          {
            icon: Upload,
            title: "Subir fotos",
            content: "Arrastra y suelta tus fotos en el área de carga o haz clic para seleccionar archivos. Los formatos soportados son JPG, PNG, GIF y WebP. Tamaño máximo: 20 MB por archivo."
          },
          {
            icon: Tag,
            title: "Etiquetas automáticas IA",
            content: "Cada foto es analizada automáticamente por la IA que genera etiquetas descriptivas. El análisis incluye: objetos, personas, lugares, colores, ambiente y más."
          },
          {
            icon: Search,
            title: "Buscar fotos",
            content: "Usa la barra de búsqueda para encontrar fotos por nombre o etiqueta. La búsqueda es instantánea e insensible a mayúsculas."
          },
          {
            icon: Download,
            title: "Descargar fotos",
            content: "Pasa el cursor sobre una foto y haz clic en el icono de descarga para guardarla en tu dispositivo con su nombre original."
          },
          {
            icon: Trash2,
            title: "Eliminar fotos",
            content: "Pasa el cursor sobre una foto y haz clic en el icono de eliminar. Se te pedirá confirmación antes de la eliminación permanente."
          },
          {
            icon: Tag,
            title: "Gestionar etiquetas manuales",
            content: "Haz clic en una foto para ver sus detalles. Puedes añadir etiquetas personalizadas o eliminar etiquetas existentes."
          }
        ]
      },
      techGuide: {
        title: "Documentación Técnica",
        sections: [
          {
            icon: Server,
            title: "Arquitectura & Stack Técnico",
            content: `
**Frontend**
• React 18.3.1 - Framework UI
• Vite 5.4.2 - Build tool
• TailwindCSS 3.4.1 - Estilos
• react-i18next 15.1.3 - i18n (FR/EN/ES)
• Lucide React - Iconos
• React Router 6.28.0 - Enrutamiento
• React Hot Toast - Notificaciones

**Backend**
• Node.js 18+ - Runtime
• Express 4.21.1 - Framework web
• SQLite (better-sqlite3 11.7.0) - Base de datos
• BullMQ 5.28.2 + Redis - Cola async
• Socket.IO 4.8.1 - Tiempo real
• Multer 1.4.5 - Subida archivos
• Sharp 0.33.5 - Procesamiento imágenes

**Seguridad**
• JWT (jsonwebtoken 9.0.2) - Auth
• bcrypt 5.1.1 - Hash contraseñas
• CORS 2.8.5 - Protección

**IA**
• OpenAI GPT-4o
• Grok 2 Vision
• OpenRouter (Gemini 2.0 Flash, Qwen, Llama)
• Ollama LLaVA 7B (local)
            `
          },
          {
            icon: Lock,
            title: "Autenticación",
            content: `
**JWT (JSON Web Tokens)**
- Tokens firmados con secreto configurable
- Expiración configurable (por defecto: 7 días)
- Actualización automática del lado del cliente

**Seguridad**
- Contraseñas hasheadas con bcrypt (10 rondas)
- Protección CSRF mediante tokens
- Cabeceras de seguridad (X-Frame-Options, etc.)
            `
          },
          {
            icon: Zap,
            title: "Proveedores IA",
            content: `
**OpenAI** (GPT-4o-mini)
- API Vision para análisis de imágenes
- Generación de etiquetas multilingüe

**Grok** (xAI)
- Alternativa a OpenAI
- Modelo grok-vision-beta

**OpenRouter**
- Acceso a múltiples modelos
- Modelos gratuitos disponibles
            `
          },
          {
            icon: Globe,
            title: "Despliegue",
            content: `
**Opción A: Cloudflare Tunnel**
- Acceso seguro sin abrir puertos
- SSL automático
- Protección DDoS incluida

**Opción B: Nginx**
- Proxy inverso clásico
- SSL vía Let's Encrypt
- Configuración WebSocket para Socket.IO
            `
          },
          {
            icon: Database,
            title: "Endpoints API",
            content: `
**Autenticación**
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

**Fotos**
- GET /api/photos
- POST /api/photos
- DELETE /api/photos/:id
- GET /api/photos/:id/tags
- POST /api/photos/:id/tags

**Admin**
- GET /api/admin/users
- POST /api/admin/users
- PUT /api/admin/users/:id
- DELETE /api/admin/users/:id
            `
          }
        ]
      }
    }
  };

  const lang = i18n.language?.substring(0, 2) || 'fr';
  const c = content[lang] || content.fr;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {c.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {c.subtitle}
          </p>
        </div>

        {/* POC Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-3">
            {c.poc.title}
          </h2>
          <p className="text-amber-700 dark:text-amber-300 mb-4">
            {c.poc.description}
          </p>
          <ul className="space-y-2">
            {c.poc.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveSection('user')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeSection === 'user'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
            {c.userGuide.title}
          </button>
          <button
            onClick={() => setActiveSection('tech')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeSection === 'tech'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Code className="w-5 h-5" />
            {c.techGuide.title}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeSection === 'user' && c.userGuide.sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(`user-${idx}`)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="flex-1 font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </span>
                  {expandedItems[`user-${idx}`] ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedItems[`user-${idx}`] && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-600 dark:text-gray-300 pl-14">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {activeSection === 'tech' && c.techGuide.sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(`tech-${idx}`)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="flex-1 font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </span>
                  {expandedItems[`tech-${idx}`] ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedItems[`tech-${idx}`] && (
                  <div className="px-5 pb-5 pt-0">
                    <pre className="text-gray-600 dark:text-gray-300 pl-14 whitespace-pre-wrap font-sans text-sm">
                      {section.content}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Smart Gallery v1.0.0 • Made with ❤️ and AI</p>
        </div>
      </div>
    </div>
  );
}

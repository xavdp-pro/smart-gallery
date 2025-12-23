# 📸 Smart Gallery - Photo Manager with AI Tagging

A modern photo management application with AI-powered auto-tagging.

![Smart Gallery](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 📸 **Photo Upload & Management** - Drag & drop or click to upload
- 🏷️ **AI Auto-Tagging** - Automatic tagging using OpenAI, Grok, OpenRouter (Gemini, Qwen, Llama), or Ollama LLaVA
- 🤖 **Multi-Provider AI** - Switch between AI providers dynamically from the UI
- 🔄 **Re-analysis** - Re-analyze photos with different AI models
- 🎨 **AI Image Analysis** - Detailed descriptions, dominant colors, quality assessment
- 🌍 **Multilingual** - Full support for French, English, and Spanish
- 🔐 **User Authentication** - JWT-based auth with admin panel
- 👥 **User Management** - Create, edit, delete users from admin panel
- 🔍 **Search** - Search by photo name or tags
- 📥 **Download** - Download photos with original names
- ✏️ **Rename Photos** - Edit photo names directly in the gallery
- 🌐 **Real-time Updates** - Socket.IO for live progress (Cloudflare Tunnel compatible)
- 🎨 **Modern UI** - Beautiful dark/light theme with TailwindCSS
- 📱 **Mobile Warning** - Landscape mode recommendation for optimal experience

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Usage |
|------------|---------|-------|
| **React** | 18.3.1 | UI Framework |
| **Vite** | 5.4.2 | Build tool & dev server |
| **TailwindCSS** | 3.4.1 | Utility-first CSS |
| **react-i18next** | 15.1.3 | Internationalization (FR/EN/ES) |
| **Lucide React** | 0.index447.0 | Icon library |
| **React Hot Toast** | 2.4.1 | Notifications |
| **React Router** | 6.28.0 | Client-side routing |

### Backend
| Technology | Version | Usage |
|------------|---------|-------|
| **Node.js** | 18+ | Runtime environment |
| **Express** | 4.21.1 | Web framework |
| **SQLite** | better-sqlite3 11.7.0 | Database |
| **BullMQ** | 5.28.2 | Job queue for async processing |
| **Redis** | - | Queue backend |
| **Socket.IO** | 4.8.1 | Real-time communication |
| **Multer** | 1.4.5-lts.1 | File upload handling |
| **Sharp** | 0.33.5 | Image processing |

### Authentication & Security
| Technology | Version | Usage |
|------------|---------|-------|
| **JWT** | jsonwebtoken 9.0.2 | Token-based auth |
| **bcrypt** | 5.1.1 | Password hashing |
| **cors** | 2.8.5 | CORS middleware |

### AI Providers
| Provider | Model | Usage |
|----------|-------|-------|
| **OpenAI** | GPT-4o | Vision analysis & tagging |
| **Grok** | Grok 2 Vision | Alternative vision model |
| **OpenRouter** | Gemini 2.0 Flash | Cost-effective vision (recommended) |
| **OpenRouter** | Qwen 2.5 VL | Free/paid vision model |
| **OpenRouter** | Llama 4 Vision | Open-source vision model |
| **Ollama** | LLaVA 7B | Local free vision model |

### Deployment & DevOps
| Technology | Usage |
|------------|-------|
| **PM2** | Process manager |
| **Cloudflare Tunnel** | Secure external access |
| **Nginx** | Alternative reverse proxy |
| **Let's Encrypt** | SSL certificates |

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/xavdp-pro/smart-gallery.git
cd smart-gallery
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file:

```env
# Required
JWT_SECRET=your_super_secret_key_here

# AI Providers (at least one required)
OPENAI_API_KEY=sk-...                    # OpenAI GPT-4o Vision
GROK_API_KEY=xai-...                     # Grok 2 Vision
OPENROUTER_API_KEY=sk-or-...             # OpenRouter (Gemini, Qwen, Llama)
OLLAMA_URL=http://localhost:11434       # Ollama (local, free)

# Email (optional - for password reset)
MAILJET_API_KEY=your_mailjet_key
MAILJET_SECRET_KEY=your_mailjet_secret
EMAIL_FROM=noreply@yourdomain.com

# App URL
APP_URL=http://localhost:9999
```

### 4. Create admin user

```bash
node create-admin.js
```

Default credentials: `admin@admin.com` / `admin123`

### 5. Run the application

```bash
# Development (with hot reload)
npm run dev

# Production (with PM2)
npm run pm2:start
```

**Access the app:**
- 🌐 Frontend: http://localhost:9999
- 🔌 Backend API: http://localhost:8888

---

## 🌍 Production Deployment

### Option A: Cloudflare Tunnel (Recommended)

Cloudflare Tunnel provides secure access without opening ports.

#### 1. Install cloudflared

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

#### 2. Create tunnel

```bash
cloudflared tunnel login
cloudflared tunnel create smart-gallery
cloudflared tunnel route dns smart-gallery your-domain.com
```

#### 3. Configure tunnel

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: your-domain.com
    service: http://localhost:9999
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

#### 4. Run as service

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

#### 5. Update Vite config

Add your domain to `vite.config.js`:

```javascript
server: {
  allowedHosts: [
    'localhost',
    'your-domain.com'
  ]
}
```

---

### Option B: Nginx Reverse Proxy

#### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

#### 2. Create Nginx config

Create `/etc/nginx/sites-available/smart-gallery`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL certificates (managed by certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size (for photos)
    client_max_body_size 20M;

    # Frontend (Vite)
    location / {
        proxy_pass http://127.0.0.1:9999;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8888;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout for AI analysis
        proxy_read_timeout 120s;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://127.0.0.1:8888;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Uploaded photos
    location /uploads {
        proxy_pass http://127.0.0.1:8888;
    }
}
```

#### 3. Enable site and get SSL

```bash
sudo ln -s /etc/nginx/sites-available/smart-gallery /etc/nginx/sites-enabled/
sudo nginx -t
sudo certbot --nginx -d your-domain.com
sudo systemctl reload nginx
```

---

## 🌍 Internationalization (i18n)

Smart Gallery supports **3 languages**: French (🇫🇷), English (🇬🇧), and Spanish (🇪🇸).

### Features
- **UI Translation**: All interface elements are translated
- **AI Language Adaptation**: AI-generated tags, descriptions, and metadata are generated in the selected language
- **Dynamic Quality Translation**: Quality ratings (Excellent/Good/Average/Poor) are translated on-the-fly
- **Language Selector**: Switch languages from the header dropdown

### Supported Languages

| Language | Code | Status |
|----------|------|--------|
| 🇫🇷 Français | `fr` | ✅ Complete |
| 🇬🇧 English | `en` | ✅ Complete |
| 🇪🇸 Español | `es` | ✅ Complete |

### How It Works

1. **Frontend**: Uses `react-i18next` for UI translations
2. **Backend**: Receives language parameter during upload/reanalysis
3. **AI Prompts**: Dynamically adapted based on selected language
4. **Storage**: Tags and metadata are stored in the language they were generated

---

## 🤖 AI Providers

Smart Gallery supports multiple AI providers for image analysis:

### Available Providers

| Provider | Model | Cost | Vision | Quality |
|----------|-------|------|--------|----------|
| **OpenAI** | GPT-4o | Paid | ✅ | Excellent |
| **Grok** | Grok 2 Vision | Paid | ✅ | Excellent |
| **OpenRouter** | Gemini 2.0 Flash | Economical | ✅ | Excellent |
| **OpenRouter** | Qwen 2.5 VL | Free/Paid | ✅ | Good |
| **OpenRouter** | Llama 4 Vision | Free/Paid | ✅ | Good |
| **Ollama** | LLaVA 7B | Free (Local) | ✅ | Good |

### Switching Providers

1. Click the AI provider selector in the header
2. Choose your preferred provider
3. New uploads and re-analyses will use the selected provider

### AI Analysis Features

- **50-100+ Tags**: Exhaustive tagging covering objects, colors, composition, mood, etc.
- **Detailed Description**: 2-3 sentence description identifying the scene type
- **Dominant Colors**: Top 5 colors with percentages and names
- **Quality Assessment**: Sharpness, lighting, composition ratings (0-100 score)
- **Atmosphere**: Mood and ambiance description

---

## 📁 Project Structure

```
smart-gallery/
├── server/                 # Backend
│   ├── index.js           # Express server & API routes
│   ├── database.js        # SQLite operations
│   ├── auth.js            # JWT middleware
│   ├── openai.js          # AI providers integration
│   ├── ai-providers-config.js  # AI models configuration
│   ├── queue.js           # BullMQ async processing
│   └── email.js           # Email service (Mailjet)
├── src/                    # Frontend
│   ├── pages/
│   │   ├── PhotoGallery.jsx   # Main gallery
│   │   ├── AdminPanel.jsx     # User management
│   │   ├── Login.jsx          # Authentication
│   │   └── ...
│   ├── components/
│   │   ├── AppLayout.jsx      # Layout wrapper
│   │   ├── ProtectedRoute.jsx # Auth guard
│   │   ├── ConfirmModal.jsx   # Confirmation dialogs
│   │   ├── MobileWarningModal.jsx  # Mobile landscape warning
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.jsx    # Auth state
│   └── i18n/              # Internationalization
│       ├── locales/
│       │   ├── fr.json    # French translations
│       │   ├── en.json    # English translations
│       │   └── es.json    # Spanish translations
│       └── index.js       # i18n configuration
├── uploads/                # Uploaded photos (gitignored)
├── database.db            # SQLite database (gitignored)
├── .env                   # Environment variables (gitignored)
├── ecosystem.config.cjs   # PM2 configuration
├── vite.config.js         # Vite configuration
└── public/
    └── favicon.svg        # App favicon
```

---

## 🔧 PM2 Commands

```bash
# Start all services
npm run pm2:start

# Stop all services
npm run pm2:stop

# Restart all services
npm run pm2:restart

# View logs
pm2 logs

# Monitor
pm2 monit
```

---

## 🔐 Default Credentials

After running `node create-admin.js`:

- **Email**: `admin@admin.com`
- **Password**: `admin123`

⚠️ **Change these immediately in production!**

---

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |

### Photos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/photos` | List all photos |
| POST | `/api/photos/upload` | Upload photo (with AI analysis) |
| DELETE | `/api/photos/:id` | Delete photo |
| PUT | `/api/photos/:id/rename` | Rename photo |
| POST | `/api/photos/:id/reanalyze` | Re-analyze photo with AI |
| GET | `/api/photos/:id/metadata` | Get photo metadata |

### Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/photos/:id/tags` | Get photo tags |
| POST | `/api/photos/:id/tags` | Add tag to photo |
| DELETE | `/api/photos/:id/tags/:tagId` | Remove tag from photo |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List users (admin) |
| POST | `/api/admin/users` | Create user (admin) |
| PUT | `/api/admin/users/:id` | Update user (admin) |
| DELETE | `/api/admin/users/:id` | Delete user (admin) |
| GET | `/api/admin/settings` | Get app settings (admin) |
| PUT | `/api/admin/settings` | Update app settings (admin) |

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

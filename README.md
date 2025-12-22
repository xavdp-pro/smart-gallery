# 📸 Smart Gallery - Photo Manager with AI Tagging

A modern photo management application with AI-powered auto-tagging.

![Smart Gallery](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 📸 **Photo Upload & Management** - Drag & drop or click to upload
- 🏷️ **AI Auto-Tagging** - Automatic tagging using OpenAI, Grok, or OpenRouter
- 🔐 **User Authentication** - JWT-based auth with admin panel
- 👥 **User Management** - Create, edit, delete users from admin panel
- 🔍 **Search** - Search by photo name or tags
- 📥 **Download** - Download photos with original names
- 🌐 **Real-time Updates** - Socket.IO for live progress
- 🎨 **Modern UI** - Beautiful interface with TailwindCSS

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | SQLite |
| Auth | JWT + bcrypt |
| AI | OpenAI Vision API, Grok, OpenRouter |
| Real-time | Socket.IO |

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
OPENAI_API_KEY=sk-...
GROK_API_KEY=xai-...
OPENROUTER_API_KEY=sk-or-...

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

## 📁 Project Structure

```
smart-gallery/
├── server/                 # Backend
│   ├── index.js           # Express server & API routes
│   ├── database.js        # SQLite operations
│   ├── auth.js            # JWT middleware
│   ├── openai.js          # AI providers integration
│   ├── queue.js           # Async processing queue
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
│   │   └── ...
│   └── contexts/
│       └── AuthContext.jsx    # Auth state
├── uploads/                # Uploaded photos (gitignored)
├── database.db            # SQLite database (gitignored)
├── .env                   # Environment variables (gitignored)
├── ecosystem.config.cjs   # PM2 configuration
└── vite.config.js         # Vite configuration
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

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/photos` | List all photos |
| POST | `/api/photos` | Upload photo |
| DELETE | `/api/photos/:id` | Delete photo |
| GET | `/api/photos/:id/tags` | Get photo tags |
| POST | `/api/photos/:id/tags` | Add tag |
| DELETE | `/api/photos/:id/tags/:tagId` | Remove tag |
| GET | `/api/admin/users` | List users (admin) |
| POST | `/api/admin/users` | Create user (admin) |
| PUT | `/api/admin/users/:id` | Update user (admin) |
| DELETE | `/api/admin/users/:id` | Delete user (admin) |

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

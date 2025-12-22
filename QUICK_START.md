# Quick Start Guide

## ✅ Application is Running!

Your photo management application with AI-powered tagging is now live and ready to use.

### 🌐 Access URLs

- **Frontend**: http://localhost:9999
- **Backend API**: http://localhost:8888

### 🎯 Features

1. **Upload Photos**: Click the "Upload Photo" button in the header
2. **View Thumbnails**: See all your photos in the left sidebar
3. **Select Photos**: Click any thumbnail to view it in full size
4. **AI Auto-Tagging**: Photos are automatically tagged using OpenAI Vision API
5. **Manual Tags**: Add custom tags in the right sidebar
6. **Remove Tags**: Hover over tags and click the X to remove them

### 🗂️ Database Structure

The app uses SQLite with three tables:
- `photos`: Stores photo metadata
- `tags`: Stores unique tag names
- `photo_tags`: Links photos to their tags (many-to-many)

### 📁 File Storage

Uploaded photos are stored in `/apps/photo-v1/app/uploads/`

### 🔑 OpenAI API

Your OpenAI API key is configured in `.env` and used for automatic image analysis and tagging.

### 🛠️ Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: SQLite (sql.js)
- **AI**: OpenAI Vision API (gpt-4o-mini)
- **Icons**: Lucide React

### 📝 Notes

- No authentication (proof of concept)
- Photos are analyzed immediately upon upload
- Tags are automatically generated based on image content
- You can add additional tags manually

Enjoy your new photo manager! 📸

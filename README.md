# Photo Manager with AI Tagging

A modern photo management application with AI-powered auto-tagging using OpenAI Vision API.

## Features

- 📸 Upload and manage photos
- 🏷️ AI-powered automatic tagging using OpenAI Vision API
- 🖼️ Thumbnail view with full-size preview
- 🎨 Beautiful UI with TailwindCSS
- 💾 SQLite database for storage

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Node.js + Express
- **Database**: SQLite
- **AI**: OpenAI Vision API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure your `.env` file contains your OpenAI API key:
```
OPENAI_API_KEY=your_key_here
```

3. Run the application:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:9999
- Backend: http://localhost:8888

## Project Structure

```
app/
├── server/          # Express backend
├── src/             # React frontend
├── public/          # Static files
├── uploads/         # Uploaded photos
└── database.db      # SQLite database
```

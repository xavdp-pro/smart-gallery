#!/bin/bash

echo "🧪 Testing Photo Manager Application"
echo "===================================="
echo ""

# Test 1: Check if backend is running
echo "✓ Test 1: Backend API (GET /api/photos)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/api/photos)
if [ "$RESPONSE" = "200" ]; then
    echo "  ✅ Backend is running on port 8888 (HTTP $RESPONSE)"
    PHOTO_COUNT=$(curl -s http://localhost:8888/api/photos | grep -o '\[' | wc -l)
    if [ "$PHOTO_COUNT" -gt 0 ]; then
        echo "  📊 Database is accessible"
    fi
else
    echo "  ❌ Backend is NOT running (HTTP $RESPONSE)"
fi
echo ""

# Test 2: Check if frontend is running
echo "✓ Test 2: Frontend (Vite dev server)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9999)
if [ "$RESPONSE" = "200" ]; then
    echo "  ✅ Frontend is running on port 9999 (HTTP $RESPONSE)"
else
    echo "  ❌ Frontend is NOT running (HTTP $RESPONSE)"
fi
echo ""

# Test 3: Check Vite proxy
echo "✓ Test 3: Vite Proxy (/api/photos via proxy)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9999/api/photos)
if [ "$RESPONSE" = "200" ]; then
    echo "  ✅ Proxy is working (HTTP $RESPONSE)"
else
    echo "  ❌ Proxy is NOT working (HTTP $RESPONSE)"
fi
echo ""

# Test 4: Check database file
echo "✓ Test 4: Database"
if [ -f "database.db" ]; then
    echo "  ✅ Database file exists"
    echo "  📁 Size: $(du -h database.db | cut -f1)"
else
    echo "  ❌ Database file NOT found"
fi
echo ""

# Test 5: Check uploads directory
echo "✓ Test 5: Uploads Directory"
if [ -d "uploads" ]; then
    PHOTO_COUNT=$(ls -1 uploads 2>/dev/null | wc -l)
    echo "  ✅ Uploads directory exists"
    echo "  📸 Files: $PHOTO_COUNT photos uploaded"
else
    echo "  ❌ Uploads directory NOT found"
fi
echo ""

# Test 6: Check OpenAI API Key
echo "✓ Test 6: OpenAI Configuration"
if [ -f ".env" ] && grep -q "OPENAI_API_KEY" .env; then
    echo "  ✅ OpenAI API key is configured in .env"
else
    echo "  ❌ OpenAI API key NOT found in .env"
fi
echo ""

echo "===================================="
echo "🎉 Testing Complete!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:9999"
echo "   Backend:  http://localhost:8888"
echo ""
echo "🔌 Ports utilisés:"
echo "   - 9999 (Frontend Vite)"
echo "   - 8888 (Backend API)"
echo ""

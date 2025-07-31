#!/bin/bash

echo "🔍 Checking deployment status..."

# Check if build is successful
echo "1. Testing local build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful"
else
    echo "❌ Local build failed"
    exit 1
fi

# Check environment variables
echo "2. Checking environment variables..."
if [ -z "$GOOGLE_GENERATIVE_AI_API_KEY" ]; then
    echo "❌ GOOGLE_GENERATIVE_AI_API_KEY is not set"
else
    echo "✅ API key is set"
fi

# Test API endpoints locally
echo "3. Testing API endpoints..."
npm run dev &
DEV_PID=$!
sleep 5

# Test the test endpoint
curl -s http://localhost:3000/api/test | grep -q "success" && echo "✅ Test API working" || echo "❌ Test API failed"

# Kill dev server
kill $DEV_PID

echo "🚀 Ready for deployment!"

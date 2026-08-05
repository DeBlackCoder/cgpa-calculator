const https = require('https');

// Read API key directly from .env file
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse XAI_API_KEY from .env
const apiKeyMatch = envContent.match(/XAI_API_KEY="?([^"\n]+)"?/);
const apiKey = apiKeyMatch ? apiKeyMatch[1] : null;

console.log('🤖 Testing Grok API Connection...\n');

if (!apiKey) {
  console.error('❌ Error: XAI_API_KEY not found in .env file');
  process.exit(1);
}

console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
console.log('📍 API Endpoint: https://api.x.ai/v1\n');

const data = JSON.stringify({
  model: 'grok-2-1212',
  messages: [
    {
      role: 'system',
      content: 'You are a helpful AI assistant. Respond briefly.'
    },
    {
      role: 'user',
      content: 'Say "Hello! I am Grok and I am working!" in a friendly way.'
    }
  ],
  max_tokens: 100,
  temperature: 0.7
});

const options = {
  hostname: 'api.x.ai',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Length': data.length
  }
};

console.log('📤 Sending test message to Grok...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const response = JSON.parse(responseData);
        
        console.log('📥 Response received!\n');
        console.log('─────────────────────────────────────');
        console.log('Grok says:', response.choices[0].message.content);
        console.log('─────────────────────────────────────\n');
        
        console.log('✅ SUCCESS! Grok API is working correctly!');
        console.log('🎉 Your AI Academic Advisor feature will work!\n');
        
        console.log('📊 API Response Details:');
        console.log('  Model:', response.model || 'grok-beta');
        console.log('  Tokens Used:', response.usage?.total_tokens || 'N/A');
        console.log('  Finish Reason:', response.choices[0].finish_reason);
        console.log();
        
      } catch (error) {
        console.error('❌ Error parsing response:', error.message);
        console.error('Raw response:', responseData);
      }
    } else if (res.statusCode === 401) {
      console.error('❌ Authentication Error: Invalid API Key');
      console.error('   Status Code:', res.statusCode);
      console.error('   → Check your XAI_API_KEY in .env file');
      console.error('   → Get a new key from: https://console.x.ai/\n');
      console.error('Response:', responseData);
    } else if (res.statusCode === 429) {
      console.error('❌ Rate Limit Error: Too many requests');
      console.error('   Status Code:', res.statusCode);
      console.error('   → Wait a moment and try again');
      console.error('   → Check your usage at: https://console.x.ai/\n');
      console.error('Response:', responseData);
    } else {
      console.error('❌ Error: Unexpected status code', res.statusCode);
      console.error('Response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network Error:', error.message);
  console.error('   → Check your internet connection');
  console.error('   → Verify firewall settings');
});

req.write(data);
req.end();

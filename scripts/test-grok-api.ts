import OpenAI from 'openai'

async function testGrokAPI() {
  console.log('🤖 Testing Grok API Connection...\n')

  const apiKey = process.env.XAI_API_KEY

  if (!apiKey) {
    console.error('❌ Error: XAI_API_KEY not found in .env file')
    process.exit(1)
  }

  console.log('✅ API Key found:', apiKey.substring(0, 15) + '...')
  console.log('📍 API Endpoint: https://api.x.ai/v1\n')

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.x.ai/v1"
    })

    console.log('📤 Sending test message to Grok...')
    
    const completion = await openai.chat.completions.create({
      model: 'grok-beta',
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
    })

    console.log('📥 Response received!\n')
    console.log('─────────────────────────────────────')
    console.log('Grok says:', completion.choices[0].message.content)
    console.log('─────────────────────────────────────\n')
    
    console.log('✅ SUCCESS! Grok API is working correctly!')
    console.log('🎉 Your AI Academic Advisor feature will work!\n')
    
    console.log('📊 API Response Details:')
    console.log('  Model:', completion.model)
    console.log('  Tokens Used:', completion.usage?.total_tokens || 'N/A')
    console.log('  Finish Reason:', completion.choices[0].finish_reason)
    
  } catch (error: any) {
    console.error('❌ Error testing Grok API:\n')
    
    if (error.status === 401) {
      console.error('🔑 Authentication Error: Invalid API Key')
      console.error('   → Check your XAI_API_KEY in .env file')
      console.error('   → Get a new key from: https://console.x.ai/')
    } else if (error.status === 429) {
      console.error('⏱️  Rate Limit Error: Too many requests')
      console.error('   → Wait a moment and try again')
      console.error('   → Check your usage at: https://console.x.ai/')
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('🌐 Network Error: Cannot reach Grok API')
      console.error('   → Check your internet connection')
      console.error('   → Verify firewall settings')
    } else {
      console.error('Error Details:', error.message)
      if (error.response) {
        console.error('Status:', error.response.status)
        console.error('Data:', error.response.data)
      }
    }
    
    process.exit(1)
  }
}

// Run the test
testGrokAPI()

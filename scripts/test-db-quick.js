const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const urlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
const url = urlMatch ? urlMatch[1] : null;

if (!url) {
  console.error('❌ DATABASE_URL not found in .env');
  process.exit(1);
}

console.log('🔍 Testing MongoDB Connection...\n');
console.log('📍 URL:', url.replace(/:[^:@]*@/, ':****@'), '\n');

const client = new MongoClient(url);

async function test() {
  try {
    console.log('⏳ Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    const db = client.db();
    console.log('📊 Database:', db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.length);
    
    if (collections.length > 0) {
      console.log('\nCollections found:');
      collections.forEach((col, i) => {
        console.log(`  ${i + 1}. ${col.name}`);
      });
    }
    
    console.log('\n✅ Database connection is working!');
    console.log('🎉 Your signup should work now!\n');
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error:', error.message, '\n');
    
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('🔐 Authentication Error');
      console.error('──────────────────────────────────────');
      console.error('The username or password is incorrect.\n');
      console.error('💡 Solutions:');
      console.error('   1. Check username and password in .env DATABASE_URL');
      console.error('   2. Reset password in MongoDB Atlas:');
      console.error('      → Go to: https://cloud.mongodb.com/');
      console.error('      → Database Access → Edit User → Reset Password');
      console.error('   3. Make sure password is URL-encoded if it has special chars\n');
      console.error('📖 See FIX_DATABASE_AUTH_ERROR.md for detailed guide');
      
    } else if (error.message.includes('IP') || error.message.includes('not authorized')) {
      console.error('🌐 IP Whitelist Error');
      console.error('──────────────────────────────────────');
      console.error('Your IP address is not whitelisted.\n');
      console.error('💡 Solutions:');
      console.error('   1. Go to: https://cloud.mongodb.com/');
      console.error('   2. Click "Network Access"');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.error('   5. Click "Confirm"\n');
      
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 Network Error');
      console.error('──────────────────────────────────────');
      console.error('Cannot reach MongoDB server.\n');
      console.error('💡 Solutions:');
      console.error('   1. Check your internet connection');
      console.error('   2. Check if MongoDB Atlas is down: https://status.mongodb.com/');
      console.error('   3. Try a different network\n');
      
    } else {
      console.error('💡 General troubleshooting:');
      console.error('   → Check FIX_DATABASE_AUTH_ERROR.md for solutions');
      console.error('   → Verify DATABASE_URL format in .env');
      console.error('   → Try creating a new MongoDB Atlas cluster\n');
    }
    
    process.exit(1);
  }
}

test();

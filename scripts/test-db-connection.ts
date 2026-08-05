import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...\n')

  try {
    // Try to connect
    await prisma.$connect()
    console.log('✅ Successfully connected to MongoDB!')

    // Try a simple query
    const count = await prisma.user.count()
    console.log(`✅ Database query successful!`)
    console.log(`📊 Current user count: ${count}\n`)

    // Show connection details (without sensitive info)
    const dbUrl = process.env.DATABASE_URL || ''
    const dbName = dbUrl.match(/\/([^/?]+)(\?|$)/)?.[1] || 'unknown'
    console.log(`📁 Database name: ${dbName}`)
    console.log(`🌐 Connection type: MongoDB Atlas\n`)

    console.log('🎉 Database is ready to use!')
  } catch (error: any) {
    console.error('❌ Database connection failed!\n')
    console.error('Error details:', error.message)
    console.error('\n📋 Troubleshooting steps:')
    console.error('1. Check your DATABASE_URL in .env file')
    console.error('2. Replace <db_username> with your actual MongoDB username')
    console.error('3. Verify your password is correct')
    console.error('4. Check if your IP is whitelisted in MongoDB Atlas')
    console.error('5. Ensure database name is included in the URL')
    console.error('\n💡 Your connection string should look like:')
    console.error('mongodb+srv://username:password@cluster.mongodb.net/cgpa-ai?...')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

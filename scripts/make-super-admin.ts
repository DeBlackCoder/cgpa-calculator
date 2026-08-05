import 'dotenv/config'
import connectDB from '../lib/mongodb'
import User from '../models/User'
import Admin from '../models/Admin'

async function makeSuperAdmin() {
  try {
    console.log('🔐 Making user super admin...\n')

    await connectDB()

    const email = 'hillaryprosperwahua@gmail.com'

    // Find the user
    const user = await User.findOne({ email }).lean()

    if (!user) {
      console.error('❌ User not found with email:', email)
      console.log('\nMake sure the user has signed up first!')
      process.exit(1)
    }

    console.log('✅ User found:', user.name)
    console.log('   Email:', user.email)
    console.log('   Current role:', user.role)

    // Check if user is already an admin
    if (user.role !== 'ADMIN') {
      // Update user role to ADMIN
      await User.findByIdAndUpdate(user._id, { role: 'ADMIN' })
      console.log('✅ Updated user role to ADMIN')
    }

    // Check if admin record exists
    let admin = await Admin.findOne({ userId: user._id.toString() })

    if (admin) {
      // Update existing admin to super admin
      if (admin.isSuperAdmin) {
        console.log('ℹ️  User is already a super admin!')
      } else {
        await Admin.findByIdAndUpdate(admin._id, { isSuperAdmin: true })
        console.log('✅ Updated existing admin to super admin')
      }
    } else {
      // Create new admin record with super admin flag
      await Admin.create({
        userId: user._id.toString(),
        isSuperAdmin: true
      })
      console.log('✅ Created new super admin record')
    }

    console.log('\n🎉 Success! User is now a SUPER ADMIN')
    console.log('\n📋 Account Details:')
    console.log('   Email:', email)
    console.log('   Role: ADMIN')
    console.log('   Super Admin: YES')
    console.log('\n🚀 You can now sign in and access all admin features!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

makeSuperAdmin()

# 🔐 Admin Roles System Guide

## Overview

The system now has a **three-tier admin hierarchy**:

1. **Super Admin** - Full system control + can promote/demote admins
2. **Senior Admin** - Can modify academic data (faculties, departments, programmes, courses)
3. **Regular Admin** - View-only access to admin panels

---

## 🎯 Role Permissions

| Permission | Super Admin | Senior Admin | Regular Admin |
|-----------|-------------|--------------|---------------|
| **Promote/Demote Admins** | ✅ | ❌ | ❌ |
| **Create/Edit Faculties** | ✅ | ✅ | ❌ |
| **Create/Edit Departments** | ✅ | ✅ | ❌ |
| **Create/Edit Programmes** | ✅ | ✅ | ❌ |
| **Create/Edit Courses** | ✅ | ✅ | ❌ |
| **View Students** | ✅ | ✅ | ✅ |
| **View Analytics** | ✅ | ✅ | ✅ |
| **View Reports** | ✅ | ✅ | ✅ |

---

## 📋 User Model Changes

### New Field: `adminRole`

```typescript
interface IUser {
  // ... existing fields
  adminRole?: 'SUPER_ADMIN' | 'SENIOR_ADMIN' | 'REGULAR_ADMIN'
}
```

- **Optional field** - Only populated for users with `role: 'ADMIN'`
- **Defaults to `REGULAR_ADMIN`** if not set
- **Cannot be changed by the user themselves**

---

## 🔧 API Changes

### New Endpoint: `/api/admin/roles`

**GET** - List all admins with their roles (Super Admin only)
```typescript
{
  admins: [
    {
      _id: string
      name: string
      email: string
      adminRole: 'SUPER_ADMIN' | 'SENIOR_ADMIN' | 'REGULAR_ADMIN'
      createdAt: string
    }
  ]
}
```

**PUT** - Update admin role (Super Admin only)
```typescript
{
  userId: string
  adminRole: 'SUPER_ADMIN' | 'SENIOR_ADMIN' | 'REGULAR_ADMIN'
}
```

### Updated Permission Checks

All academic data modification endpoints now use:
- ❌ Old: `isSuperAdmin()` - Only super admins could modify
- ✅ New: `canModifyAcademicData()` - Senior admins AND super admins can modify

**Affected Endpoints:**
- `/api/faculties` (POST)
- `/api/faculties/[id]` (PUT, DELETE)
- `/api/departments` (POST)
- `/api/departments/[id]` (PUT, DELETE)
- `/api/programmes` (POST)
- `/api/programmes/[id]` (PUT, DELETE)
- `/api/courses` (POST)
- `/api/courses/[id]` (PUT, DELETE)

---

## 🎨 UI Changes

### New Admin Page: Admin Roles Management

**URL:** `/admin/admin-roles`

**Access:** Super Admin only

**Features:**
- View all admins with their current roles
- Change admin roles via dropdown
- See permission matrix
- Role indicators with icons:
  - 👑 Super Admin (Yellow)
  - 🛡️ Senior Admin (Blue)
  - 🔒 Regular Admin (Gray)

### Updated Sidebar Navigation

**Super Admin sees:**
- Dashboard
- Students
- User Management
- **Admin Roles** ⭐ NEW
- Faculties
- Departments
- Programmes
- Courses
- Analytics
- Settings

**Senior Admin sees:**
- Dashboard
- Students
- Faculties
- Departments
- Programmes
- Courses
- Analytics
- Settings

**Regular Admin sees:**
- Dashboard
- Students
- Analytics

---

## 🚀 How to Use

### For Super Admins

#### 1. Access Admin Roles Page
```
http://localhost:3000/admin/admin-roles
```

#### 2. Promote an Admin to Senior Admin
1. Find the admin in the list
2. Click the dropdown next to their name
3. Select "Senior Admin"
4. Confirm the change

#### 3. Promote an Admin to Super Admin
1. Find the admin in the list
2. Click the dropdown
3. Select "Super Admin"
4. Confirm the change

**⚠️ Note:** You cannot demote yourself from Super Admin

---

## 🔐 Security Features

### Protection Against Self-Demotion
- Super admins cannot change their own role
- Prevents accidental lockout

### Role-Based API Authorization
All endpoints check permissions before allowing actions:

```typescript
// Example: Creating a faculty
const canModify = await canModifyAcademicData()
if (!canModify) {
  return NextResponse.json(
    { error: "Only senior admins and super admins can create faculties" },
    { status: 403 }
  )
}
```

### Hierarchical Access
- Super Admin > Senior Admin > Regular Admin
- Higher roles inherit lower role permissions

---

## 📝 Helper Functions

### New Auth Helpers

```typescript
// Check if super admin
await isSuperAdmin(): Promise<boolean>

// Check if senior admin or above
await isSeniorAdminOrAbove(): Promise<boolean>

// Check if can modify academic data (senior admin or above)
await canModifyAcademicData(): Promise<boolean>

// Check if can manage other admins (super admin only)
await canManageAdmins(): Promise<boolean>

// Get full admin status
await getAdminStatus(): Promise<{
  isAdmin: boolean
  isSuperAdmin: boolean
  isSeniorAdmin: boolean
  isRegularAdmin: boolean
  adminRole: string | null
}>
```

---

## 🎯 Common Scenarios

### Scenario 1: Making Your First Senior Admin

1. Login as Super Admin (`admin@university.edu`)
2. Go to `/admin/admin-roles`
3. Find the admin user you want to promote
4. Change their role to "Senior Admin"
5. They can now manage courses, departments, etc.

### Scenario 2: Delegating Course Management

1. Create a new admin account (or use existing)
2. Promote them to Senior Admin
3. They can now add/edit/delete courses without super admin access
4. They CANNOT promote other users

### Scenario 3: Adding a View-Only Admin

1. Create a new admin account
2. Leave role as "Regular Admin" (default)
3. They can view all admin panels but cannot modify data

---

## 🔄 Migration

### Existing Admins

All existing admin users will default to:
- **REGULAR_ADMIN** if `adminRole` is not set

### Super Admin Setup

The seeding script creates the default super admin:
```typescript
Email: admin@university.edu
Password: admin123
AdminRole: SUPER_ADMIN
```

To manually set an admin as super admin, update the database:
```javascript
await User.findByIdAndUpdate(userId, {
  adminRole: 'SUPER_ADMIN'
})
```

---

## 🧪 Testing

### Test Super Admin Access
1. Login as `admin@university.edu`
2. Navigate to `/admin/admin-roles`
3. Should see all admins and be able to change roles

### Test Senior Admin Access
1. Promote a user to Senior Admin
2. Login as that user
3. Try to create a faculty - should work
4. Try to access `/admin/admin-roles` - should be denied

### Test Regular Admin Access
1. Login as a regular admin
2. Try to create a faculty - should be denied
3. Can view students and analytics

---

## 📚 Documentation Files

- `models/User.ts` - Updated user model with `adminRole` field
- `lib/auth-helpers.ts` - New permission check functions
- `app/api/admin/roles/route.ts` - Admin role management API
- `app/admin/admin-roles/page.tsx` - Admin role management UI
- `app/admin/layout.tsx` - Updated to pass admin status to sidebar
- `components/dashboard/sidebar.tsx` - Updated navigation based on role

---

## ⚠️ Important Notes

1. **Always have at least one Super Admin** - Don't demote all super admins
2. **Super Admins cannot demote themselves** - Prevents lockout
3. **Senior Admins can do most things** - Good for delegating course management
4. **Regular Admins are view-only** - Good for reporting and monitoring

---

## 🆘 Troubleshooting

### Issue: "Only super admins can..."
**Solution:** Check your admin role at `/api/admin/check-super-admin`

### Issue: Cannot see Admin Roles link
**Solution:** Only super admins see this link. Check your role.

### Issue: All admins are Regular Admin
**Solution:** Login as the default super admin and promote others:
```
Email: admin@university.edu
Password: admin123
```

---

**Version:** 2.0  
**Last Updated:** January 2025  
**Breaking Changes:** No - backward compatible with existing admin system

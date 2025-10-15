# Authentication System Documentation

## Overview
This Hospital Management System (HMS) implements a comprehensive authentication system using NextAuth.js with Google OAuth, JWT tokens, and role-based access control.

## Architecture

### Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Centralized authentication state management
   - Handles login, logout, and token validation
   - Integrates with NextAuth.js and localStorage
   - Automatic token expiration handling

2. **AuthGuard** (`src/components/AuthGuard.tsx`)
   - Route protection component
   - Role-based access control
   - Automatic redirects for unauthorized users

3. **Middleware** (`middleware.ts`)
   - Server-side route protection
   - Cookie-based authentication validation
   - JWT token verification

4. **Cookie Utils** (`src/lib/cookie-utils.ts`)
   - Cookie management utilities
   - Secure cookie operations

## Authentication Flow

### 1. Login Process
```
User clicks "Sign in with Google" 
    ↓
NextAuth.js handles Google OAuth
    ↓
Google returns idToken
    ↓
Frontend sends idToken to backend
    ↓
Backend validates and returns JWT + user data
    ↓
Frontend stores JWT + user data in localStorage & cookies
    ↓
User is redirected to role-specific dashboard
```

### 2. Route Protection
```
User navigates to protected route
    ↓
Middleware checks for valid token in cookies
    ↓
If invalid/missing → redirect to login
    ↓
If valid → AuthGuard component checks localStorage
    ↓
AuthGuard validates token and user role
    ↓
If authorized → render content
    ↓
If unauthorized → redirect to appropriate dashboard
```

### 3. Logout Process
```
User clicks logout
    ↓
AuthContext logout function is called
    ↓
Clear localStorage (token, role, email, userId, userName)
    ↓
Clear sessionStorage
    ↓
Clear all auth cookies
    ↓
Clear user state
    ↓
Sign out from NextAuth.js
    ↓
Redirect to login page
```

## User Roles & Access Control

### Available Roles
- `nurse` - Access to `/nurse` routes
- `doctor` - Access to `/doctor` routes
- `admin` - Access to `/admin` routes
- `student` - Access to `/student` routes
- `pharmacist` - Access to `/pharmacist` routes

### Route Protection
- Each role can only access their specific dashboard
- Attempting to access another role's dashboard redirects to user's dashboard
- Unauthenticated users are redirected to login

## Storage Strategy

### localStorage
- `token` - JWT token from backend
- `role` - User role (nurse, doctor, admin, etc.)
- `email` - User email address
- `userId` - User ID from backend
- `userName` - User's display name (optional)

### Cookies
- Same data as localStorage for SSR compatibility
- Secure cookie settings with expiration
- Automatic cleanup on logout

### sessionStorage
- Cleared on logout for security

## Security Features

1. **JWT Token Validation**
   - Automatic token expiration checking
   - Invalid token cleanup
   - Auto-logout on token expiry

2. **Dual Storage**
   - localStorage for client-side access
   - Cookies for server-side middleware

3. **Role-Based Access Control**
   - Server-side middleware validation
   - Client-side AuthGuard protection
   - Automatic redirects for unauthorized access

4. **Secure Logout**
   - Complete state cleanup
   - Cookie clearing
   - NextAuth.js session termination

## Error Handling

1. **Error Boundary** (`src/components/ErrorBoundary.tsx`)
   - Catches React errors
   - Provides fallback UI
   - Development error details

2. **Authentication Errors**
   - Invalid token handling
   - Network error recovery
   - User-friendly error messages

## Development Tools

### Debug Page (`/debug`)
- Real-time authentication status
- Token and cookie inspection
- User information display
- Manual logout functionality

## Usage Examples

### Using AuthContext
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name || user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes
```tsx
import AuthGuard from '@/components/AuthGuard';

function NurseDashboard() {
  return (
    <AuthGuard allowedRoles={['nurse']}>
      <div>Nurse Dashboard Content</div>
    </AuthGuard>
  );
}
```

### Using Logout Hook
```tsx
import { useLogout } from '@/hooks/useLogout';

function Navbar() {
  const { logout } = useLogout();
  
  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

## Environment Variables

Required environment variables:
```env
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_BACKEND_URL=your-backend-url
```

## Testing

1. **Login Flow**
   - Visit `/` and click "Sign in with Google"
   - Should redirect to appropriate dashboard based on role

2. **Route Protection**
   - Try accessing `/nurse` without login → should redirect to `/`
   - Login as different role → should redirect to correct dashboard

3. **Logout**
   - Click logout button → should clear all data and redirect to login

4. **Token Expiration**
   - Tokens automatically expire and trigger logout

## Troubleshooting

### Common Issues

1. **Not redirecting after login**
   - Check console for errors
   - Verify backend is returning correct user data
   - Check localStorage for stored data

2. **Can access routes without login**
   - Verify middleware is enabled
   - Check AuthGuard is wrapping protected components
   - Ensure cookies are being set

3. **Logout not working**
   - Check if AuthContext is properly imported
   - Verify all storage is being cleared
   - Check NextAuth.js session state

### Debug Steps

1. Visit `/debug` page to inspect authentication state
2. Check browser console for error messages
3. Verify localStorage and cookies contain expected data
4. Test with different user roles

"use client";
import AuthGuard from '@/components/AuthGuard';

export default function Admin() {
  return (
    // <AuthGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Hello admin!</h1>
      </div>
    // </AuthGuard>
  )
}

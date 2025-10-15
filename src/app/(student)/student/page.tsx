'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function Student() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Hello Bro!!</h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Log out
      </button>
    </div>
  );
}

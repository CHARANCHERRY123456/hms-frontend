'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react'; // For handling sign-in
import { FcGoogle } from 'react-icons/fc'; // Icon for Google button (from react-icons)

export default function Home() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [activeTab, setActiveTab] = useState('credentials'); // Tab for modal (credentials or google)
  const [email, setEmail] = useState(''); // Email state
  const [password, setPassword] = useState(''); // Password state
  const [error, setError] = useState<string | null>(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // For password visibility toggle

  // Redirect based on role after session is loaded
  useEffect(() => {
    if (session?.user?.role) {
      window.location.href = `/${session.user.role}`;
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSubmitCredentials = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const result = await signIn("credentials", {
      redirect: false, // Don't auto-redirect
      email,
      password,
      callbackUrl: "/", // Where to go after successful login
    });

    if (!result) {
      setError("No response from server. Please try again.");
      return;
    }

    if (result.error) {
      // Handle authentication failure
      setError(result.error || "Invalid email or password.");
    } else if (result.ok) {
      // Close modal and manually redirect on success
      setIsModalOpen(false);
      window.location.href = result.url || "/";
    } else {
      setError("Unexpected error occurred. Please try again.");
    }
  } catch (err: any) {
    console.error("Login error:", err);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    await signIn('google', { callbackUrl: '/' }); // This will handle the Google popup/redirect
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">HMS</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="#" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">About</a>
                <a href="#" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition transform hover:scale-105"
            >
              Login
            </button>
            <div className="md:hidden">
              {/* Hamburger menu for mobile (simplified) */}
              <button>Menu</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 pt-24 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white animate-fade-in-down">
            Welcome to Hospital Management System
          </h1>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto animate-fade-in-up">
            Streamline operations, enhance patient care, and manage resources efficiently with our secure platform.
          </p>
          <div className="mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              Get Started with Login
            </button>
          </div>
        </div>
        {/* Subtle background animation */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="0.1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
              <h3 className="text-xl font-semibold text-blue-600">Patient Management</h3>
              <p className="mt-2 text-gray-600">Efficiently track patient records, appointments, and history.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
              <h3 className="text-xl font-semibold text-blue-600">Staff Scheduling</h3>
              <p className="mt-2 text-gray-600">Optimize shifts and ensure seamless hospital operations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
              <h3 className="text-xl font-semibold text-blue-600">Inventory Control</h3>
              <p className="mt-2 text-gray-600">Manage medical supplies and reduce wastage with real-time tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p>&copy; 2023 Hospital Management System. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Login to HMS</h2>
            <div className="flex mb-6 border-b">
              <button
                onClick={() => setActiveTab('credentials')}
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 'credentials' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Email/Password
              </button>
              <button
                onClick={() => setActiveTab('google')}
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 'google' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Sign in with Google
              </button>
            </div>

            {activeTab === 'credentials' ? (
              <form onSubmit={handleSubmitCredentials}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="relative mb-4">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-3 right-3 text-gray-500"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition transform hover:scale-105"
              >
                <FcGoogle className="mr-2" /> Sign in with Google
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 text-blue-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

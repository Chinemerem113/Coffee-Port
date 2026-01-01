import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { ref, set } from "firebase/database";
import { Coffee } from "lucide-react";

const Signup = ({ setPage }) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is returning from Google redirect
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const googleUser = result.user;
          const googleUsername =
            googleUser.displayName ||
            (googleUser.email
              ? googleUser.email.split("@")[0]
              : `user_${googleUser.uid}`);

          const userRef = ref(db, `users/${googleUser.uid}`);
          await set(userRef, {
            uid: googleUser.uid,
            username: googleUsername,
            email: googleUser.email,
            createdAt: new Date().toISOString(),
            provider: "google",
          });

          setPage("home");
        }
      } catch (err) {
        console.error("Redirect error:", err);
        setError(err.message || "Google sign-in failed");
      }
    };

    handleRedirectResult();
  }, [setPage]);

  // Email and password authentication
  const handleEmailAuthentication = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      // Update profile with username
      await updateProfile(user, { displayName: username });

      // Save to Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        uid: user.uid,
        username,
        email,
        createdAt: new Date().toISOString(),
        provider: "email",
      });

      setPage("home");
    } catch (err) {
      console.error("Signup error:", err.message);
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  // Google Authentication - Use redirect for mobile, popup for desktop
  const googleAuthentication = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      // Detect if mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Use redirect for mobile
        await signInWithRedirect(auth, provider);
        // Note: The redirect result is handled in useEffect above
      } else {
        // Use popup for desktop
        const result = await signInWithPopup(auth, provider);
        const googleUser = result.user;
        const googleUsername =
          googleUser.displayName ||
          (googleUser.email
            ? googleUser.email.split("@")[0]
            : `user_${googleUser.uid}`);

        const userRef = ref(db, `users/${googleUser.uid}`);
        await set(userRef, {
          uid: googleUser.uid,
          username: googleUsername,
          email: googleUser.email,
          createdAt: new Date().toISOString(),
          provider: "google",
        });

        setPage("home");
      }
    } catch (err) {
      console.error("Google signup error:", err.message);
      setError(err.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center">
          <Coffee className="h-8 w-8 text-amber-900" />
          <span className="ml-2 text-2xl font-bold text-gray-900">
            Coffee Port
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
            <p className="text-gray-600 mb-6">
              Create your Coffee Port account
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Email Authentication Form */}
            <form onSubmit={handleEmailAuthentication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-900 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up with Email"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google Authentication Section */}
            <button
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={googleAuthentication}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? "Please wait..." : "Sign in with Google"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => setPage("signin")}
                className="text-amber-900 font-medium hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;

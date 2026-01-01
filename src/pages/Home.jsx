import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Coffee, LogOut, ShoppingBag, Package, User } from "lucide-react";

const Home = ({ setPage, user, username }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPage("empty");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Coffee className="h-8 w-8 text-amber-900" />
            <span className="ml-2 text-2xl font-bold text-gray-900">
              Coffee Port
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-amber-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {username}!
            </h1>
            <p className="text-xl text-gray-600">
              Ready to explore our premium coffee collection?
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <button
              onClick={() => setPage("browse")}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-amber-900 hover:shadow-lg transition-all text-left"
            >
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-amber-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Browse Coffee
              </h3>
              <p className="text-gray-600 text-sm">
                Discover our curated selection of premium beans
              </p>
            </button>

            <button
              onClick={() => setPage("orders")}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-amber-900 hover:shadow-lg transition-all text-left"
            >
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-amber-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Orders
              </h3>
              <p className="text-gray-600 text-sm">
                Track and view your order history
              </p>
            </button>

            <button
              onClick={() => setPage("profile")}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-amber-900 hover:shadow-lg transition-all text-left"
            >
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-amber-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Profile
              </h3>
              <p className="text-gray-600 text-sm">
                Manage your account and preferences
              </p>
            </button>
          </div>

          {/* Featured Section */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-8 border border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Featured This Week
            </h2>
            <p className="text-gray-700 mb-6">
              Explore our hand-picked selection of specialty coffees from around
              the world. Each blend tells a unique story of craftsmanship and
              flavor.
            </p>
            <button
              onClick={() => setPage("browse")}
              className="bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
            >
              View Collection
            </button>
          </div>

          {/* Account Info */}
          <div className="mt-12 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Username:</span> {username}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {user?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium">Member since:</span>{" "}
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Coffee Port. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

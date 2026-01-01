import React from "react";
import { Coffee, ShoppingCart, Package, User } from "lucide-react";

function Empty({ setPage }) {
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
        <div className="max-w-4xl w-full">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to Coffee Port
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your destination for premium coffee sourced from the finest
              regions around the world. Browse our collection, place orders, and
              enjoy exceptional coffee delivered to your door.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Coffee className="h-6 w-6 text-amber-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Browse Coffee
              </h3>
              <p className="text-gray-600">
                Explore our curated selection of specialty coffees from around
                the world with detailed descriptions and origins.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-amber-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Shopping
              </h3>
              <p className="text-gray-600">
                Add your favorite coffees to cart, manage your orders, and
                checkout securely with our streamlined process.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-amber-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Track your orders in real-time and receive fresh coffee at your
                doorstep within days.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-amber-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personal Account
              </h3>
              <p className="text-gray-600">
                Create your account to save preferences, view order history, and
                manage your coffee subscriptions.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button
              onClick={() => setPage("signup")}
              className="bg-amber-900 text-white px-10 py-4 rounded-lg hover:bg-amber-800 transition-colors font-semibold text-lg shadow-sm"
            >
              Get Started
            </button>
            <p className="text-gray-500 mt-4">
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

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Coffee Port Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Empty;

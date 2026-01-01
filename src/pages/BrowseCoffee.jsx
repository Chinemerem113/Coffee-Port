import React, { useState } from "react";
import { Coffee, ShoppingCart, ArrowLeft, Star, Filter } from "lucide-react";

const BrowseCoffee = ({ setPage, username, onCheckout }) => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCart, setShowCart] = useState(false);

  // Coffee products data
  const coffeeProducts = [
    {
      id: 1,
      name: "Ethiopian Yirgacheffe",
      origin: "Ethiopia",
      category: "light",
      price: 18.99,
      rating: 4.8,
      description: "Floral notes with hints of citrus and tea",
      //    image: "../assets/Cofees/Ethiopian Yirgacheffe.png",
      image: "☕",
      roast: "Light Roast",
      weight: "250g",
    },
    {
      id: 2,
      name: "Colombian Supremo",
      origin: "Colombia",
      category: "medium",
      price: 16.99,
      rating: 4.6,
      description: "Smooth, balanced with caramel sweetness",
      //    image: "../assets/Cofees/Columbian supremo.png",
      image: "☕",
      roast: "Medium Roast",
      weight: "250g",
    },
    {
      id: 3,
      name: "Sumatra Mandheling",
      origin: "Indonesia",
      category: "dark",
      price: 17.99,
      rating: 4.7,
      description: "Bold, earthy with herbal undertones",
      image: "☕",
      roast: "Dark Roast",
      weight: "250g",
    },
    {
      id: 4,
      name: "Brazilian Santos",
      origin: "Brazil",
      category: "medium",
      price: 15.99,
      rating: 4.5,
      description: "Nutty, chocolatey with low acidity",
      image: "☕",
      roast: "Medium Roast",
      weight: "250g",
    },
    {
      id: 5,
      name: "Kenya AA",
      origin: "Kenya",
      category: "light",
      price: 19.99,
      rating: 4.9,
      description: "Bright, fruity with wine-like acidity",
      image: "☕",
      roast: "Light Roast",
      weight: "250g",
    },
    {
      id: 6,
      name: "Italian Espresso",
      origin: "Italy",
      category: "dark",
      price: 17.99,
      rating: 4.7,
      description: "Rich, intense with dark chocolate notes",
      image: "☕",
      roast: "Dark Roast",
      weight: "250g",
    },
    {
      id: 7,
      name: "Costa Rican Tarrazu",
      origin: "Costa Rica",
      category: "medium",
      price: 18.49,
      rating: 4.6,
      description: "Clean, bright with citrus acidity",
      image: "☕",
      roast: "Medium Roast",
      weight: "250g",
    },
    {
      id: 8,
      name: "Guatemala Antigua",
      origin: "Guatemala",
      category: "medium",
      price: 17.49,
      rating: 4.8,
      description: "Smooth, complex with cocoa notes",
      image: "☕",
      roast: "Medium Roast",
      weight: "250g",
    },
  ];

  const categories = [
    { id: "all", name: "All Coffee" },
    { id: "light", name: "Light Roast" },
    { id: "medium", name: "Medium Roast" },
    { id: "dark", name: "Dark Roast" },
  ];

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? coffeeProducts
      : coffeeProducts.filter(
          (product) => product.category === selectedCategory
        );

  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Calculate total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage("home")}
              className="text-gray-600 hover:text-amber-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <Coffee className="h-8 w-8 text-amber-900" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                Coffee Port
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 mb-8 border border-amber-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Our Coffee Collection
          </h1>
          <p className="text-gray-700">
            Welcome, {username}! Discover premium coffee beans from around the
            world.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filter by Roast
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-amber-900 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-amber-900"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 h-48 flex items-center justify-center">
                <span className="text-7xl">{product.image}</span>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">{product.origin}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                    <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-amber-900 bg-amber-50 px-2 py-1 rounded">
                    {product.roast}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.weight}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors text-sm font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowCart(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ${item.price} each
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="font-medium">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onCheckout(cart, cartTotal)}
                    className="w-full bg-amber-900 text-white py-4 rounded-lg hover:bg-amber-800 transition-colors font-bold text-lg"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseCoffee;

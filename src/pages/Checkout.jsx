import React, { useState } from "react";
import {
  Coffee,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Truck,
  Clock,
  Package,
} from "lucide-react";
import { ref, push, set } from "firebase/database";
import { db, auth } from "../firebase/config";

const Checkout = ({ setPage, username, cart, cartTotal }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentOrderNumber, setCurrentOrderNumber] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: username || "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!deliveryInfo.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!deliveryInfo.phone.trim())
      newErrors.phone = "Phone number is required";
    if (!deliveryInfo.address.trim())
      newErrors.address = "Delivery address is required";
    if (!deliveryInfo.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (validateForm()) {
      const orderNumber = `CP${Math.floor(Math.random() * 1000000)}`;
      const user = auth.currentUser;

      if (user) {
        try {
          // Create order object
          const orderData = {
            orderNumber,
            userId: user.uid,
            username,
            items: cart,
            total: cartTotal,
            deliveryInfo,
            status: "On the way",
            orderDate: new Date().toISOString(),
            estimatedDelivery: "30-45 minutes",
            paymentMethod: "Cash on Delivery",
          };

          // Save to Firebase
          const ordersRef = ref(db, `orders/${user.uid}`);
          await push(ordersRef, orderData);

          setCurrentOrderNumber(orderNumber);
          setOrderPlaced(true);
        } catch (error) {
          console.error("Error saving order:", error);
          alert("Failed to place order. Please try again.");
        }
      }
    }
  };

  // Generate order number and delivery time
  const orderNumber = currentOrderNumber;
  const estimatedDelivery = "30-45 minutes";

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="max-w-4xl mx-auto flex items-center">
            <Coffee className="h-8 w-8 text-amber-900" />
            <span className="ml-2 text-2xl font-bold text-gray-900">
              Coffee Port
            </span>
          </div>
        </header>

        {/* Order Confirmation */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {/* Success Icon */}
              <div className="mb-6">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order Confirmed!
                </h1>
                <p className="text-gray-600">
                  Your coffee is on its way, {username}!
                </p>
              </div>

              {/* Order Number */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-2xl font-bold text-amber-900">
                  {orderNumber}
                </p>
              </div>

              {/* Delivery Status */}
              <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Truck className="h-6 w-6 text-amber-900" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Your Order is on its Way!
                  </h2>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                  <Clock className="h-5 w-5" />
                  <span>Estimated delivery: {estimatedDelivery}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Delivery Address:
                  </p>
                  <p className="text-sm text-gray-600">
                    {deliveryInfo.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {deliveryInfo.address}
                  </p>
                  <p className="text-sm text-gray-600">{deliveryInfo.city}</p>
                  <p className="text-sm text-gray-600">{deliveryInfo.phone}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                  <span className="text-2xl">💵</span>
                  Payment Instructions
                </h3>
                <p className="text-gray-700 mb-4">
                  Please prepare{" "}
                  <span className="font-bold text-xl text-gray-900">
                    ${cartTotal.toFixed(2)}
                  </span>{" "}
                  to pay the dispatch operator upon delivery.
                </p>
                <p className="text-sm text-gray-600">
                  Payment can be made in cash or via mobile transfer to the
                  delivery person.
                </p>
              </div>

              {/* Order Summary */}
              <div className="border border-gray-200 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setPage("home")}
                  className="w-full bg-amber-900 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => setPage("browse")}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Support Info */}
              <p className="text-sm text-gray-500 mt-6">
                Need help? Contact us at support@coffeeport.com
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Coffee className="h-8 w-8 text-amber-900" />
            <span className="ml-2 text-2xl font-bold text-gray-900">
              Coffee Port
            </span>
          </div>
          <button
            onClick={() => setPage("browse")}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to Shopping
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Delivery Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-900" />
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryInfo.fullName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryInfo.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900`}
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900`}
                      placeholder="Street address"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900`}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={deliveryInfo.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>

              {/* Payment Notice */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">💵</span>
                  Payment Method
                </h3>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Cash on Delivery:</span> Pay $
                  {cartTotal.toFixed(2)} to the dispatch operator when your
                  order arrives.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm border-b border-gray-100 pb-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-amber-900">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-amber-900 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-bold text-lg"
              >
                Place Order
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

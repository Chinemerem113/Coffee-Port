import React, { useState, useEffect } from "react";
import {
  Coffee,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { ref, get } from "firebase/database";
import { db, auth } from "../firebase/config";

const Orders = ({ setPage, username }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const ordersRef = ref(db, `orders/${user.uid}`);
          const snapshot = await get(ordersRef);

          if (snapshot.exists()) {
            const ordersData = snapshot.val();
            // Convert object to array and sort by date (newest first)
            const ordersArray = Object.keys(ordersData)
              .map((key) => ({
                id: key,
                ...ordersData[key],
              }))
              .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

            setOrders(ordersArray);
          } else {
            setOrders([]);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "on the way":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      case "on the way":
        return <Truck className="h-5 w-5" />;
      case "processing":
        return <Clock className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-gray-600 hover:text-amber-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <Coffee className="h-8 w-8 text-amber-900" />
            <span className="text-2xl font-bold text-gray-900">
              Order Details
            </span>
          </div>
        </header>

        {/* Order Details */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 border-b border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedOrder.orderDate)}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full border font-semibold flex items-center gap-2 ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-900" />
                Order Items
              </h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gray-50 rounded-lg p-4"
                  >
                    <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-lg flex items-center justify-center text-3xl">
                      ☕
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.origin} • {item.roast}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${item.price} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-900" />
                Delivery Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-900">
                  <span className="font-medium">Name:</span>{" "}
                  {selectedOrder.deliveryInfo.fullName}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedOrder.deliveryInfo.phone}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">Address:</span>{" "}
                  {selectedOrder.deliveryInfo.address}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">City:</span>{" "}
                  {selectedOrder.deliveryInfo.city}
                </p>
                {selectedOrder.deliveryInfo.notes && (
                  <p className="text-gray-900">
                    <span className="font-medium">Notes:</span>{" "}
                    {selectedOrder.deliveryInfo.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Payment & Total */}
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-amber-900" />
                Payment Summary
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-amber-900">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={() => setPage("browse")}
              className="w-full bg-amber-900 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
            >
              Order Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setPage("home")}
            className="text-gray-600 hover:text-amber-900 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <Coffee className="h-8 w-8 text-amber-900" />
          <span className="text-2xl font-bold text-gray-900">My Orders</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 mb-8 border border-amber-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order History
          </h1>
          <p className="text-gray-700">
            Welcome back, {username}! Here's a complete history of all your
            coffee orders.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start browsing our premium
              coffee collection!
            </p>
            <button
              onClick={() => setPage("browse")}
              className="bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors font-semibold"
            >
              Browse Coffee
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full border text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Package className="h-4 w-4" />
                      <span>{order.items.length} item(s)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-700"
                        >
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-700">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Total: </span>
                        <span className="font-bold text-gray-900 text-lg">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Payment: </span>
                        <span className="font-medium text-gray-900">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                    <button className="text-amber-900 font-semibold hover:underline text-sm">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;

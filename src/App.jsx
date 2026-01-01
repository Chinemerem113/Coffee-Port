import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/config";
import { get, ref } from "firebase/database";

import Empty from "./pages/Empty";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import BrowseCoffee from "./pages/BrowseCoffee";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUserName] = useState("");
  const [page, setPage] = useState("loading");
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({ cart: [], total: 0 });

  const handleCheckout = (cart, total) => {
    console.log("Checkout data:", cart, total); // Debug log
    setCheckoutData({ cart, total });
    setPage("checkout");
  };

  // Debug: Log page changes
  useEffect(() => {
    console.log("Current page:", page);
  }, [page]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = ref(db, `users/${currentUser.uid}`);
          const snapshot = await get(userRef);
          setUserName(snapshot.val()?.username || "User");
          setPage("home");
        } catch (error) {
          console.error("Error fetching user data:", error);
          setPage("empty");
        }
      } else {
        setUserName("");
        setPage("empty");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {page === "empty" && <Empty setPage={setPage} />}
      {page === "signin" && <Signin setPage={setPage} />}
      {page === "signup" && <Signup setPage={setPage} />}
      {page === "home" && (
        <Home setPage={setPage} user={user} username={username} />
      )}
      {page === "browse" && (
        <BrowseCoffee
          setPage={setPage}
          username={username}
          onCheckout={handleCheckout}
        />
      )}
      {page === "checkout" && (
        <Checkout
          setPage={setPage}
          username={username}
          cart={checkoutData.cart}
          cartTotal={checkoutData.total}
        />
      )}
      {page === "orders" && <Orders setPage={setPage} username={username} />}
      {page === "profile" && (
        <Profile setPage={setPage} user={user} username={username} />
      )}
    </div>
  );
};

export default App;

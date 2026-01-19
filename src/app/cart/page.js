"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Cart.module.css"; // import the module

export default function Cart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchCart();
  }, [status]);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCartItems(data);
  }

  const handleQuantityChange = (id, action) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let quantity = item.quantity;
          if (action === "increment") quantity++;
          if (action === "decrement") quantity = Math.max(1, quantity - 1);
          return { ...item, quantity, total: item.price * quantity };
        }
        return item;
      })
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert("Cart is empty");

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, totalAmount }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Frontend received:", data);

      if (data?.orderId) {
        router.push(`/payment/${data.orderId}`);
      } else {
        alert("Failed to create order");
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <section className={styles.container}>
      <h2>🛒 Your Cart</h2>

      {cartItems.map((item) => (
        <div key={item.id} className={styles.item}>
          <span>{item.name}</span>
          <span>₹{item.price}</span>
          <div className={styles.quantityControls}>
            <button onClick={() => handleQuantityChange(item.id, "decrement")}>-</button>
            <span style={{ margin: "0 10px" }}>{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.id, "increment")}>+</button>
          </div>
          <span>₹{item.total}</span>
          <button onClick={() => handleRemove(item.id)}>❌</button>
        </div>
      ))}

      <h3>Total: ₹{totalAmount}</h3>

      <button onClick={handleCheckout} className={styles.checkoutBtn}>
        Proceed to Checkout
      </button>
    </section>
  );
}

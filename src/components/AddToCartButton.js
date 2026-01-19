"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast"; // optional

export default function AddToCartButton({ productId, onCartUpdate }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setAdded(false);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.ok) {
        setAdded(true);
        toast.success(data.message || "Added to cart!");
        if (onCartUpdate) onCartUpdate();
        setTimeout(() => setAdded(false), 1500);
      } else {
        toast.error(data.error || "Failed to add to cart");
      }
    } catch (err) {
      console.error("AddToCart error:", err);
      toast.error("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="btn"
      onClick={handleClick}
      disabled={loading}
    >
      <FiShoppingCart className="btn-icon" />
      {loading
        ? "Adding..."
        : added
        ? "Added ✅"
        : session
        ? "Add to Cart"
        : "Login to Add to Cart"}
    </button>
  );
}

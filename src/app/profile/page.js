"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Profile.module.css";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch user + cart data
  useEffect(() => {
    if (!session?.user?.email) return;

    async function fetchData() {
      try {
        const [userRes, cartRes] = await Promise.all([
          fetch("/api/user", { credentials: "include" }),
          fetch("/api/cart", { credentials: "include" }),
        ]);

        if (userRes.ok) {
          setUserData(await userRes.json());
        }

        if (cartRes.ok) {
          setCartData(await cartRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session]);

  if (status === "loading" || loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (!session) return null;

  const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className={styles.wrapper}>
      <h2>User Dashboard</h2>

      {/* Profile Card */}
      <div className={styles.card}>
        <div className={styles.profileHeader}>
          <img
            src={userData?.avatar || "/default-avatar.png"}
            alt="Profile"
            className={styles.avatar}
          />
          <div>
            <p><strong>Name:</strong> {userData?.name || "N/A"}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p>
              <strong>Joined:</strong>{" "}
              {userData?.created_at
                ? new Date(userData.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className={styles.card}>
        <h3>Cart Summary</h3>
        <p><strong>Total Items:</strong> {totalItems}</p>
        <p><strong>Total Cost:</strong> ₹{totalCost}</p>

        <button
          className={styles.viewCartBtn}
          onClick={() => router.push("/cart")}
        >
          View Cart
        </button>
      </div>

      {/* Order History */}
      <div className={styles.card}>
        <h3>Order History</h3>
        <p>No orders yet.</p>
      </div>

      <button
        className={styles.logoutBtn}
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign Out
      </button>
    </div>
  );
}

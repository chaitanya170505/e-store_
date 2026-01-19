"use client";

import { useRouter } from "next/navigation";
import styles from "./OrderSuccess.module.css"; // import CSS module

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎉 Order Placed Successfully!</h1>

        <p className={styles.text}>
          Thank you for your purchase. Your payment was successful and your
          order is being processed.
        </p>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => router.push("/")}>
            Go to Home
          </button>

          <button className={styles.secondaryBtn} onClick={() => router.push("/orders")}>
            View My Orders
          </button>
        </div>
      </div>
    </section>
  );
}

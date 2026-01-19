"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Payment.module.css";

export default function Payment() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId;
  const { data: session } = useSession();

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const payNow = async () => {
    if (!session) {
      alert("Please login first");
      return;
    }

    const res = await fetch("/api/payment/fake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: card.number.replace(/\s/g, ""),
        cvv: card.cvv,
        orderId,
      }),
    });

    const data = await res.json();

    if (data.status === "success") {
      router.push("/order-success");
    } else {
      alert("Payment Failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Fake Card Payment</h2>
      <p className={styles.orderId}>Order ID: {orderId}</p>

      <input
        className={styles.input}
        placeholder="Card Number"
        onChange={(e) =>
          setCard({ ...card, number: e.target.value })
        }
      />

      <input
        className={styles.input}
        placeholder="MM/YY"
        onChange={(e) =>
          setCard({ ...card, expiry: e.target.value })
        }
      />

      <input
        className={styles.input}
        placeholder="CVV"
        onChange={(e) =>
          setCard({ ...card, cvv: e.target.value })
        }
      />

      <button className={styles.button} onClick={payNow}>
        Pay
      </button>

      <p className={styles.testCard}>
        Test Card: <b>4242 4242 4242 4242</b> | CVV: <b>123</b>
      </p>
    </div>
  );
}

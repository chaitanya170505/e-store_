"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LocationPage.module.css"; // import CSS module

export default function LocationPage() {
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const router = useRouter();

  async function saveLocation() {
    const res = await fetch("/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincode, city, state }),
    });

    if (res.ok) {
      router.back();
    } else {
      alert("Failed to save location");
    }
  }

  return (
    <div className={styles.container}>
      <h2>Update Delivery Location</h2>

      <input
        placeholder="Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        className={styles.input}
      />

      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className={styles.input}
      />

      <input
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className={styles.input}
      />

      <button onClick={saveLocation} className={styles.button}>
        Save Location
      </button>
    </div>
  );
}

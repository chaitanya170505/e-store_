"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Register.module.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      setMessage("Account created. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      const data = await res.json();
      setMessage(data.error);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Signup</h2>

        {message && <p className={styles.message}>{message}</p>}

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button>Create Account</button>
      </form>
    </div>
  );
}

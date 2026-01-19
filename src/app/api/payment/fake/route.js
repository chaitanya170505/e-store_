import pool from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const session = await getServerSession();

  if (!session) {
    return Response.json(
      { status: "unauthorized" },
      { status: 401 }
    );
  }

  const { number, cvv, orderId } = await req.json();

    console.log("Card Number:", number);
    console.log("CVV:", cvv);
    console.log("Order ID:", orderId);

  const userRes = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [session.user.email]
    );

    

    const userId = userRes.rows[0].id;

  // Fake card validation
  if (number !== "4242424242424242" || cvv !== "123") {
    return Response.json(
      { status: "failed" },
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Mark order as PAID (only if belongs to user)
    await client.query(
      `UPDATE orders
       SET status = 'PAID'
       WHERE id = $1`,
      [orderId]
    );

    // 2️⃣ Clear cart for logged-in user
    await client.query(
      `DELETE FROM cart_items WHERE user_id = $1`,
      [userId]
    );

    await client.query("COMMIT");

    return Response.json({ status: "success" });
  } catch (err) {
    await client.query("ROLLBACK");

    return Response.json(
      { status: "failed", message: "Payment failed" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
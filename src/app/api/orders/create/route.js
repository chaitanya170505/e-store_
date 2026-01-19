// /app/api/orders/create/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth/next"; // important

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cartItems, totalAmount } = await req.json();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      "SELECT id FROM users WHERE email=$1",
      [session.user.email]
    );

    const userId = userRes.rows[0].id;

    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, status)
       VALUES ($1, $2, 'PENDING')
       RETURNING id`,
      [userId, totalAmount]
    );

    const orderId = orderRes.rows[0].id;

    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_name, price, quantity)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.name, item.price, item.quantity]
      );
    }

    await client.query("COMMIT");

    console.log("Order ID:", orderId); // ✅ server-side debug

    return NextResponse.json({ orderId }); // ✅ proper return
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  } finally {
    client.release();
  }
}

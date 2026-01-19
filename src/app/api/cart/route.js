// /app/api/cart/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";
import { products } from "@/app/data/products";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userRes = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [session.user.email]
    );

    if (userRes.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = userRes.rows[0].id;

    const cartRes = await pool.query(
      "SELECT * FROM cart_items WHERE user_id=$1",
      [userId]
    );

    const cartItems = cartRes.rows.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        id: item.id,
        productId: item.product_id,
        name: product?.name || "Unknown",
        price: product?.price || 0,
        quantity: item.quantity,
        total: (product?.price || 0) * item.quantity,
      };
    });

    return new Response(JSON.stringify(cartItems), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cart" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { productId } = await req.json();

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const userRes = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [session.user.email]
    );

    if (userRes.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = userRes.rows[0].id;

    const existing = await pool.query(
      "SELECT id, quantity FROM cart_items WHERE user_id=$1 AND product_id=$2",
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE id=$1",
        [existing.rows[0].id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, 1)",
        [userId, productId]
      );
    }

    return new Response(
      JSON.stringify({ message: "Product added to cart" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("POST /api/cart error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to add product" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

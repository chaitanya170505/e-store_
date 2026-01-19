import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "User already exists" }, { status: 409 });
  }
}

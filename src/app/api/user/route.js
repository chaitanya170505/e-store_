import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const userRes = await pool.query(
    `
    SELECT 
      name, 
      email, 
      created_at 
    FROM users 
    WHERE email = $1
    `,
    [session.user.email]
  );

  if (userRes.rows.length === 0) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const user = userRes.rows[0];

  return new Response(
    JSON.stringify({
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userRes = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [session.user.email]
  );

  if (userRes.rows.length === 0) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const userId = userRes.rows[0].id;

  const locationRes = await pool.query(
    "SELECT pincode, city, state FROM user_locations WHERE user_id = $1",
    [userId]
  );

  return NextResponse.json(
    locationRes.rows[0] || null
  );
}



export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { pincode, city, state } = await req.json();

  if (!pincode || pincode.length !== 6) {
    return NextResponse.json(
      { error: "Invalid pincode" },
      { status: 400 }
    );
  }

  const userRes = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [session.user.email]
  );

  const userId = userRes.rows[0].id;

  await pool.query(
    `
    INSERT INTO user_locations (user_id, pincode, city, state)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET
      pincode = EXCLUDED.pincode,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      updated_at = CURRENT_TIMESTAMP
    `,
    [userId, pincode, city, state]
  );

  return NextResponse.json({ success: true });
}

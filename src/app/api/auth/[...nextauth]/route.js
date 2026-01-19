import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (result.rows.length === 0) return null;

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

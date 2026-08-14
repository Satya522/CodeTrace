import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Mock Account",
      credentials: {
        username: { label: "Username (use: admin)", type: "text", placeholder: "admin" },
        password: { label: "Password (use: password)", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        if (credentials.username === "admin" && credentials.password === "password") {
          // Auto-create user in DB if it doesn't exist
          let user = await prisma.user.findUnique({ where: { username: "admin" } });
          if (!user) {
            user = await prisma.user.create({
              data: { username: "admin", password: "password" }
            });
          }
          return { id: user.id, name: user.username };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "codetrace-secret-key-123456789"
};

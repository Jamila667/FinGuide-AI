import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Hisob ma'lumotlari",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "ism@misol.com" },
        password: { label: "Parol", type: "password" },
        name: { label: "Ism Familiya", type: "text" },
        action: { label: "Action", type: "text" } // Hidden field to determine if login or signup
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email va parolni kiriting");
        }

        if (credentials.action === "signup") {
          const existingUser = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (existingUser) {
            throw new Error("Bu email ro'yxatdan o'tgan");
          }
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.name || null,
            }
          });
          return { id: user.id, email: user.email, name: user.name };
        } else {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user || !user.password) {
            throw new Error("Email yoki parol noto'g'ri");
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Email yoki parol noto'g'ri");
          }
          return { id: user.id, email: user.email, name: user.name ?? undefined };
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'google' && token.email) {
        let dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (!dbUser) {
           dbUser = await prisma.user.create({ data: { email: token.email, name: token.name } });
        }
        token.sub = dbUser.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        // @ts-expect-error - NextAuth types do not include id by default
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

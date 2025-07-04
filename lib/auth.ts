// lib/auth.ts or app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthConfig, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import DbConnect from "@/lib/db";
import { UserModel } from "@/models/user.model";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          await DbConnect();

          const user = await UserModel.findOne({
            email: credentials.email,
          }).select("+password");

          if (!user) {
            return null;
          }

          const isPasswordValid = await user.comparePassword(
            credentials.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      if (account && user) {
        token.provider = account.provider;

        // For Google sign-in, fetch the user from database to get the actual DB ID
        if (account.provider === "google") {
          try {
            await DbConnect();
            const dbUser = await UserModel.findOne({ email: user.email });
            if (dbUser) {
              token.userId = dbUser._id.toString();
            }
          } catch (error) {
            console.error("Error fetching user in JWT callback:", error);
          }
        } else {
          // For credentials, user.id is already the DB ID
          token.userId = user.id;
        }
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token) {
        session.user.id = token.userId ?? "";
        session.user.provider = token.provider ?? "";
      }
      return session;
    },
    async signIn({ user, account }) {
      if (!account) {
        return false;
      }
      if (account.provider === "google") {
        try {
          await DbConnect();

          const existingUser = await UserModel.findOne({ email: user.email });

          if (!existingUser) {
            await UserModel.create({
              email: user.email,
              username: user.name,
              image: user.image,
              provider: "google",
              providerId: account.providerAccountId,
              emailVerified: new Date(),
            });
          }

          // Update the user object with the database ID
          user.id = existingUser._id.toString();

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
} satisfies NextAuthConfig;

export const { signIn, signOut, auth, handlers } = NextAuth(authOptions);

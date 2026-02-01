import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./src/lib/db";
import User from "./src/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await User.findOne({ email: credentials.email }).select(
            "+password",
          );

          if (!user || typeof user.password !== "string") {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password as string,
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null; // ❗ NEVER throw
        }
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        const dbUser = await User.findOne({ email: user.email });

        await User.updateOne(
          { email: user.email },
          {
            $set: {
              name: user.name,
              image: user.image,
              provider: "google",
            },
          },
          { upsert: true },
        );
        user.id = dbUser._id.toString();
      }

      return true;
    },

    async jwt({ token, user, profile }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      if (profile?.picture) {
        token.picture = profile.picture;
      }
      if (token.email && !token.userId) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.userId = dbUser._id.toString();
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
});

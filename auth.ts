import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectDB from "./src/lib/db";
import User from "./src/models/User";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string,
        );

        if (!isPasswordValid) {
          return null;
        }

        return user;
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
      }

      return true;
    },

    async jwt({ token, profile }) {
      if (profile) {
        token.picture = profile.picture;
      }

      if (token.email && !token.userId) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) token.userId = dbUser._id.toString();
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
});

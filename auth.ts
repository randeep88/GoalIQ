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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
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

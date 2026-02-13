import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "@/app/lib/dbConnect";
import User from "@/app/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials?.email }).select("+password");
        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(credentials!.password, user.password);
        if (!isMatch) return null;

      return {
  id: user._id.toString(),
  name: user.name,              // ✅ ADD THIS
  email: user.email,
  image: user.image || null,    // ✅ ADD THIS (if exists in DB)
  role: user.role,
  hospital_id: user.hospital_id?.toString() || null,
};

      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: user.email });

        if (existingUser?.role === "HOSPITAL_ADMIN") return false;

        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            name: user.name,
            role: "PATIENT",
            provider: "google",
          });
        }

        (user as any).id = existingUser._id.toString();
        (user as any).role = existingUser.role;
        (user as any).hospital_id = existingUser.hospital_id || null;
      }

      return true;
    },

    async jwt({ token, user }) {
  if (user) {
    token.id = (user as any).id;
    token.name = (user as any).name;        // ✅
    token.email = (user as any).email;      // ✅
    token.picture = (user as any).image;    // ✅
    token.role = (user as any).role;
    token.hospital_id = (user as any).hospital_id;
  }
  return token;
},


   async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.name = token.name as string;        // ✅
    session.user.email = token.email as string;      // ✅
    session.user.image = token.picture as string;    // ✅
    session.user.role = token.role as string;
    session.user.hospital_id = token.hospital_id as string | null;
  }
  return session;
},
  },

  session: { strategy: "jwt" },

  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
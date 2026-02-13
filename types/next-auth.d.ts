import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      hospital_id?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    hospital_id?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    hospital_id?: string | null;
  }
}

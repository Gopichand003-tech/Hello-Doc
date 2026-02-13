"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export default function RequireRole({ allowedRoles, children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (
      status === "authenticated" &&
      session?.user?.role &&
      !allowedRoles.includes(session.user.role)
    ) {
      router.replace("/unauthorized");
    }
  }, [status, session, allowedRoles, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Checking access…
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}

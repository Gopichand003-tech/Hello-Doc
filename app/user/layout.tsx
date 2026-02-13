import Navbar from "@/app/components/user/Navbar";
import { AuthProvider } from "@/app/context/Authcontext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="bg-[#F9FBFC] min-h-screen">
        {children}
      </main>
    </AuthProvider>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid admin credentials");
      return;
    }

    router.push("/admin/dashboard-hospital");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-slate-100 px-6 overflow-hidden">

      {/* subtle background blur shapes */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* LOGO */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <Image
            src="/doctor.jpg"
            alt="Admin Logo"
            width={72}
            height={72}
            className="rounded-full border bg-white shadow-md"
          />
          <h1 className="font-logo text-4xl tracking-widest text-emerald-600">
            Hello Doc
          </h1>
        </div>

        <h2 className="mb-6 text-center text-2xl font-semibold text-slate-800">
          Hospital Admin Login
        </h2>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
           className="mb-4 text-center text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}

        {/* FORM CARD */}
        <form
          onSubmit={handleAdminLogin}
          className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-8 shadow-xl space-y-5"
        >
          {/* EMAIL */}
          <input
            type="email"
            required
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-500 hover:text-emerald-600 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:opacity-95 transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login as Admin"
            )}
          </button>
        </form>

        {/* SIGN UP */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/admin/signup")}
            className="cursor-pointer font-medium text-emerald-600 hover:underline"
          >
            Sign Up
          </span>
        </div>

        {/* BACK */}
        <p
          onClick={() => router.push("/login")}
          className="mt-4 cursor-pointer text-center text-sm text-slate-600 hover:text-emerald-600 transition"
        >
          ← Back to Patient Login
        </p>
      </motion.div>
    </div>
  );
}

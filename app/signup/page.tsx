"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.message || "Signup failed");
    return;
  }

  router.push("/login");
};


  const handleGoogleSignup = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f5f7fb]">

      {/* LEFT IMAGE */}
      <div className="relative hidden lg:block">
        <Image
          src="/doctor.jpg"
          alt="Healthcare"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full items-center justify-center px-16">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-6">
              Join Hello Doc
            </h1>
            <p className="text-lg max-w-md text-white/90">
              Create your account and manage appointments,
              doctors, and hospitals with ease.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIGNUP SECTION */}
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md text-center">

          {/* LOGO */}
          <div className="mb-10 flex items-center justify-center gap-4 relative -left-6">
            <Image
              src="/doctor.jpg"
              alt="Logo"
              width={95}
              height={95}
              className="rounded-full border border-emerald-200 shadow-sm"
            />
            <h2 className="font-logo text-5xl text-emerald-600 tracking-[0.25em] drop-shadow-md">
              Hello Doc
            </h2>
          </div>

          <h3 className="mb-8 text-2xl font-semibold text-slate-800">
            Create your account
          </h3>

          {/* SIGNUP FORM */}
          <form onSubmit={handleSignup} className="space-y-5 text-left">

            {/* NAME */}
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            {/* EMAIL */}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-3.5 text-slate-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* SIGNUP BUTTON */}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Create Account
            </button>
          </form>

          {/* GOOGLE SIGNUP */}
          <button
            onClick={handleGoogleSignup}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 py-3 text-sm font-medium hover:bg-slate-100 transition"
          >
            <FcGoogle size={20} />
            Sign up with Google
          </button>

          {/* LOGIN LINK */}
          <div className="mt-10 text-sm text-slate-600">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="cursor-pointer text-emerald-600 hover:underline"
            >
              Login
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

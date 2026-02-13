"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    console.error("Login failed:", result.error);
    alert("Invalid email or password");
    return;
  }

  // ✅ Login success → session created
  router.push("/user");
};

  const handleGoogleLogin = async () => {
  try {
    await signIn("google", {
      callbackUrl: "/user",
    });
  } catch (error) {
    console.error("Google login failed", error);
  }
};


  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f5f7fb]">

      {/* LEFT IMAGE */}
      <div className="relative hidden lg:block">
        <Image
          src="/doctor.jpg"
          alt="Doctor Illustration"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full items-center justify-center px-16">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
            <p className="text-lg max-w-md text-white/90">
              Securely manage appointments, patients, and hospitals —
              all in one professional platform.
            </p>
          </div>
        </div>
      </div>

   

{/* RIGHT LOGIN SECTION */}
<div className="flex min-h-screen items-center justify-center px-6">
  <div className="w-full max-w-md text-center">

 {/* LOGO */}
<div className="flex items-center justify-center gap-4 mb-8">
  
  {/* Logo Circle */}
  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-200   ring-4 ring-emerald-200 shadow-md">
    <video
      src="/videos/logo.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    />
  </div>

  {/* Brand Name */}
  <h2 className="font-logo text-5xl text-emerald-600 tracking-[0.25em] drop-shadow-md leading-none"> Hello Doc </h2>

</div>



    <h3 className="mb-7 text-2xl font-semibold text-slate-800">
      Sign in to your account
    </h3>

    {/* LOGIN FORM */}
    <form onSubmit={handleLogin} className="space-y-5 text-left">

      {/* EMAIL */}
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
      />

      {/* PASSWORD */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* LOGIN BUTTON */}
      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
      >
        Login
      </button>
    </form>

    {/* FORGOT PASSWORD */}
    <p
      onClick={() => router.push("/forgot-password")}
      className="mt-6 cursor-pointer text-sm text-emerald-600 hover:underline"
    >
      Forgot password?
    </p>

    {/* GOOGLE LOGIN */}
    <button
   onClick={handleGoogleLogin}
      className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 py-3 text-sm font-medium hover:bg-slate-100 transition"
    >
      <FcGoogle size={20} />
      Continue with Google
    </button>

    {/* SIGN UP */}
    <div className="mt-10 text-sm text-slate-600">
      Don&apos;t have an account?{" "}
      <span
        onClick={() => router.push("/signup")}
        className="cursor-pointer text-emerald-600 hover:underline"
      >
        Sign Up
      </span>
    </div>

    {/* ADMIN */}
    <div
      onClick={() => router.push("/admin/login")}
      className="mt-3 cursor-pointer text-sm text-orange-500 hover:underline"
    >
      Login as Hospital Admin
    </div>

  </div>
</div>

</div>
  );
}

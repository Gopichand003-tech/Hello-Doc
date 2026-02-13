"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminSignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    hospitalName: "",
    phone: "",
    address: "",
    hospitalImage: "", // 🔥 NEW
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setForm({ ...form, hospitalImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/register-hospital", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }

    router.push("/admin/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-slate-100 px-6 overflow-hidden">

      {/* background blur */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative"
      >
        {/* LOGO */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <Image
            src="/doctor.jpg"
            alt="Logo"
            width={72}
            height={72}
            className="rounded-full border bg-white shadow-md"
          />
          <h1 className="font-logo text-4xl text-emerald-600 tracking-widest">
            Hello Doc
          </h1>
        </div>

        <h2 className="mb-6 text-center text-2xl font-semibold text-slate-800">
          Hospital Admin Signup
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

        {/* FORM */}
        <form
          onSubmit={handleSignup}
          className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-8 shadow-xl space-y-4"
        >
          {/* HOSPITAL IMAGE */}
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            <div className="relative h-28 w-28 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center bg-white overflow-hidden hover:scale-105 transition">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Hospital"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-emerald-600 text-xs">
                  <Upload size={20} />
                  Upload Logo
                </div>
              )}
            </div>
            <span className="mt-2 text-xs text-slate-500">
              Hospital Logo / Image
            </span>
          </label>

          <input
            name="name"
            required
            placeholder="Admin Name"
            onChange={handleChange}
            className="input"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Admin Email"
            onChange={handleChange}
            className="input"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              onChange={handleChange}
              className="input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-500 hover:text-emerald-600 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <input
            name="hospitalName"
            required
            placeholder="Hospital Name"
            onChange={handleChange}
            className="input"
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="input"
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="input"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Hospital & Admin"
            )}
          </button>
        </form>

        <p
          onClick={() => router.push("/admin/login")}
          className="mt-6 cursor-pointer text-center text-sm text-slate-600 hover:text-emerald-600 transition"
        >
          Already an admin? Login
        </p>
      </motion.div>
    </div>
  );
}

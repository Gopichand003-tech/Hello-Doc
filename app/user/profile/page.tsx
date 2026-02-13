"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  Loader2,
  Camera,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Profile = {
  name: string;
  email: string;
  phone?: string;
  image?: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { update  } = useSession();


  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- FETCH PROFILE ---------------- */
 const { data: session, status } = useSession();

useEffect(() => {
  if (status === "authenticated") {
    // instant render from session
    setProfile({
      name: session.user.name || "",
      email: session.user.email || "",
      phone: "", // temporary
      image: session.user.image || null,
    });

    // then fetch phone from DB
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile((prev) => ({
          ...prev!,
          phone: data.profile.phone || "",
        }));
      });

    setLoading(false);
  }
}, [status]);



  /* ---------------- HANDLE IMAGE CHANGE ---------------- */
 const handleImageChange = async (e: any) => {
  const file = e.target.files[0];
  if (!file || !profile) return;

  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64 = reader.result;

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 }),
    });

    const data = await res.json();

    if (data.url) {
      setProfile({ ...profile, image: data.url });
    }
  };

  reader.readAsDataURL(file);
};

  /* ---------------- SAVE ---------------- */
 const handleSave = async () => {
  if (!profile) return;

  setSaving(true);

  await fetch("/api/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  // 🔥 THIS IS IMPORTANT
  await update({
    name: profile.name,
    image: profile.image,
  });

  setSaving(false);
  setToast("Profile updated successfully");

  setTimeout(() => setToast(null), 2500);
};


  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="h-80 bg-slate-200 rounded-3xl animate-pulse" />
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <motion.h1
        initial={{ y: 0 }}
        animate={{ y: -40 }}
        transition={{ duration: 0.5 }}
        className="font-logo text-5xl text-emerald-600 tracking-[0.25em] drop-shadow-md leading-none text-center"
      >
        My Profile
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-3 gap-10"
      >
        {/* ---------------- LEFT PROFILE CARD ---------------- */}
        <div className="md:col-span-1 bg-blue-200 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-xl flex flex-col items-center text-center">
          <div className="relative group">
           <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg border-4 border-white">
 {profile.image?.startsWith("http") ? (
  <img
    src={profile.image}
    alt="Profile"
    className="w-full h-full object-cover"
  />
) : (
  <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-green-400 flex items-center justify-center text-white text-4xl font-bold">
    {profile.name?.charAt(0).toUpperCase()}
  </div>
)}
</div>


            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:scale-110 transition"
            >
              <Camera size={16} />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="mt-6 text-center">
  <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
    {profile.name}
  </h2>

  <p className="mt-2 text-slate-500 text-sm font-medium">
    {profile.email}
  </p>

  <span className="mt-3 inline-block px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full">
    Patient Account
  </span>
</div>

        </div>

        {/* ---------------- RIGHT FORM ---------------- */}
        <div className="md:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-10 border border-slate-200 shadow-xl space-y-8">
          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Full Name
            </label>
            <div className="mt-2 flex items-center gap-3 border rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-blue-600" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Email
            </label>
            <div className="mt-2 flex items-center gap-3 border rounded-xl px-4 py-3 bg-slate-100">
              <Mail className="w-4 h-4 text-red-600" />
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-transparent outline-none text-slate-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Phone Number
            </label>
            <div className="mt-2 flex items-center gap-3 border rounded-xl px-4 py-3">
              <Phone className="w-4 h-4 text-green-600" />
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* SAVE */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl py-3 font-semibold bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </motion.div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            <CheckCircle className="w-5 h-5 inline mr-2" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

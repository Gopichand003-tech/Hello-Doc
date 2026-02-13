"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
  Home,
  Stethoscope,
  CalendarCheck,
  History,
  User,
} from "lucide-react";

export default function Navbar() {
  const { data: session  } = useSession();
  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* ================= LOGO ================= */}
          <Link href="/user" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-400  ring-4 ring-emerald-200 shadow-m">
              <video
                src="/videos/logo.mp4"   /* 🔥 put your logo video here */
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <span className="font-logo text-3xl text-emerald-600 tracking-[0.25em] drop-shadow-md leading-none">
              Hello Doc
            </span>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link href="/user" className="hover:text-emerald-600 flex gap-2 items-center">
              <Home size={16} /> Home
            </Link>
            <Link href="/extradoctors" className="hover:text-emerald-600 flex gap-2 items-center">
              <Stethoscope size={16} /> Doctors
            </Link>
            <Link href="/user/appointments" className="hover:text-emerald-600 flex gap-2 items-center">
              <CalendarCheck size={16} /> Appointments
            </Link>
            <Link href="/user/history" className="hover:text-emerald-600 flex gap-2 items-center">
              <History size={16} /> History
            </Link>
          </nav>

          {/* ================= RIGHT ================= */}
          <div className="flex items-center gap-3 -translate-x-8">

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-emerald-50"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-700 bg-emerald-400   ring-4 ring-emerald-200 flex items-center justify-center">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-emerald-600 w-4 h-4" />
                  )}
                </div>
                <ChevronDown size={16} />
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
  <div className="absolute right-0 mt-4 w-72 origin-top-right animate-in fade-in zoom-in-95 duration-200">
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl p-5">
      
      {/* USER INFO */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        
        {/* Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400   ring-4 ring-emerald-200 shadow-md">
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                <User className="text-emerald-600 w-6 h-6" />
              </div>
            )}
          </div>

          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        {/* Name + Email */}
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate text-lg">
            {user?.name || "Guest User"}
          </p>
          <p className="text-sm text-slate-500 truncate">
            {user?.email || "Not signed in"}
          </p>
        </div>
      </div>

      {/* MENU OPTIONS */}
      <div className="mt-4 space-y-2">
        <Link
          href="/user/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-all"
        >
          <User className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium">My Profile</span>
        </Link>

        <Link
          href="/user/history"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-all"
        >
          <History className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium">Appointment History</span>
        </Link>
      </div>

      {/* LOGOUT */}
      {user && (
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-50 to-rose-100 py-3 text-rose-600 font-medium hover:shadow-md hover:scale-[1.02] transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
      )}
    </div>
  </div>
)}

            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg border border-slate-200"
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />

          <div className="fixed top-0 right-0 z-50 h-full w-[80%] max-w-sm bg-white shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <span className="font-semibold text-emerald-600">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>

            <nav className="flex flex-col gap-5 px-6 py-6 text-slate-700 font-medium">
              <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/extradoctors" onClick={() => setMobileOpen(false)}>Doctors</Link>
              <Link href="/appointments" onClick={() => setMobileOpen(false)}>Appointments</Link>
              <Link href="/history" onClick={() => setMobileOpen(false)}>History</Link>
              <Link href="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

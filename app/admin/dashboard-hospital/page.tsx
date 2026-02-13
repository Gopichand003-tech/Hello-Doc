"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Stethoscope,
  LayoutDashboard,
  UserCog,
  CalendarDays,
  CalendarCheck,
  LogOut,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { signOut } from "next-auth/react";

import AddDoctorForm from "./AddDoctorForm";
import DoctorList from "./doctorslist";
import Availability from "./Availability";
import BookingsList from "./BookingList";
import PatientsList from "./paitents";
import toast from "react-hot-toast";
/* ================= TYPES ================= */

type Section =
  | "dashboard"
  | "doctors"
  | "availability"
  | "patients"
  | "bookings";

/* ================= MAIN DASHBOARD ================= */

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>("dashboard");
  const [refreshDoctors, setRefreshDoctors] = useState(0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">

      {/* ================= SIDEBAR ================= */}
      <aside className="hidden w-72 flex-col bg-white shadow-2xl md:flex">
       {/* Brand */} <div className="flex items-center gap-3 px-8 py-6">
         <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-300  ring-4 ring-emerald-200 shadow-sm"> 
          <video src="/videos/logo.mp4" 
          /* 🔥 put your logo video here */
           autoPlay muted loop playsInline className="w-full h-full object-cover" /> 
           </div>
           <div>
             <span className="font-logo text-2xl text-emerald-600 tracking-[0.25em] drop-shadow-md leading-none">
               Hello Doc
                </span>
            </div>
            </div>

        <nav className="mt-4 flex-1 space-y-1 px-4">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={section === "dashboard"} onClick={() => setSection("dashboard")} />
          <SidebarItem icon={<UserCog />} label="Doctors" active={section === "doctors"} onClick={() => setSection("doctors")} />
          <SidebarItem icon={<CalendarDays />} label="Availability" active={section === "availability"} onClick={() => setSection("availability")} />
          <SidebarItem icon={<Users />} label="Patients" active={section === "patients"} onClick={() => setSection("patients")} />
          <SidebarItem icon={<CalendarCheck />} label="Bookings" active={section === "bookings"} onClick={() => setSection("bookings")} />
        </nav>

      <button
  onClick={() => {
    toast.success("Logged out successfully");
    setTimeout(() => {
      signOut({ callbackUrl: "/admin/login" });
    }, 800);
  }}
  className="
    m-6 flex items-center justify-center gap-2
    rounded-2xl bg-gradient-to-r from-red-500 to-rose-600
    px-4 py-3 text-sm font-semibold text-white
    shadow-lg hover:opacity-90 active:scale-95
  "
>
  <LogOut size={16} />
  Logout
</button>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 px-10 py-8">
       <motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-10 flex items-center justify-between"
>
  <div>
    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
      {section === "dashboard" ? "Hospital Overview" : section}
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      {section === "dashboard"
        ? "Today’s activity and performance summary"
        : `Manage ${section}`}
    </p>
  </div>

  <div className="hidden sm:flex items-center gap-3 rounded-2xl
    bg-white/70 backdrop-blur-xl px-4 py-2 shadow-md border border-white"
  >
    <span className="text-sm font-medium text-slate-600">
      {new Date().toDateString()}
    </span>
  </div>
</motion.div>

        <AnimatePresence mode="wait">
          {section === "dashboard" && (
            <MotionSection>
              <DashboardOverview go={setSection} />
            </MotionSection>
          )}

          {section === "doctors" && (
            <MotionSection>
              <div className="grid xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-xl">
                  <DoctorList refreshKey={refreshDoctors} />
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-xl">
                  <AddDoctorForm onSuccess={() => setRefreshDoctors(v => v + 1)} />
                </div>
              </div>
            </MotionSection>
          )}

          {section === "availability" && <MotionSection><Availability /></MotionSection>}
          {section === "patients" && <MotionSection><PatientsList /></MotionSection>}
          {section === "bookings" && <MotionSection><BookingsList /></MotionSection>}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ================= DASHBOARD OVERVIEW ================= */

function DashboardOverview({ go }: { go: (s: Section) => void }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(setStats);
  }, []);

  /* ===== Loading ===== */
  if (!stats) {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-36 rounded-3xl bg-slate-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const chartData = [
    { name: "Doctors", value: stats.doctors },
    { name: "Patients", value: stats.patients },
    { name: "Bookings", value: stats.bookings },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-14"
    >
      {/* ================= STATS ================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatCard
            title="Doctors"
            value={stats.doctors}
            gradient="from-indigo-500 to-purple-600"
          />
          <StatCard
            title="Patients Today"
            value={stats.patients}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Bookings Today"
            value={stats.bookings}
            gradient="from-cyan-500 to-blue-600"
          />
        </div>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-6 shadow-2xl border border-white">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Today Overview
            </h3>
            <p className="text-sm text-slate-500">
              Doctors, patients, and bookings summary
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-2xl
            bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live data
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap={32}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
                contentStyle={{
                  borderRadius: "14px",
                  border: "none",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Bar
                dataKey="value"
                radius={[14, 14, 0, 0]}
                fill="url(#barGradient)"
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Quick Actions
          </h3>
          <p className="text-sm text-slate-500">
            Frequently used management shortcuts
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <ActionCard
            title="Add Doctor"
            description="Register a new doctor"
            gradient="from-indigo-500 to-purple-600"
            onClick={() => go("doctors")}
          />
          <ActionCard
            title="View Patients"
            description="Browse patient records"
            gradient="from-emerald-500 to-teal-600"
            onClick={() => go("patients")}
          />
          <ActionCard
            title="Manage Bookings"
            description="Appointments & schedules"
            gradient="from-cyan-500 to-blue-600"
            onClick={() => go("bookings")}
          />
        </div>
      </div>
    </motion.div>
      );
}

 /* ================= REUSABLE UI ================= */

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3
        text-sm font-medium transition
        ${
          active
            ? "bg-emerald-50 text-emerald-600"
            : "text-slate-600 hover:bg-slate-100"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MotionSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {children}
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  gradient,
}: {
  title: string;
  value: number;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="relative rounded-3xl bg-white/70 backdrop-blur-xl
      p-6 shadow-xl border border-white"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl
        bg-gradient-to-r ${gradient}`}
      />

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-4xl font-bold text-slate-800">
        {value ?? 0}
      </p>
    </motion.div>
  );
}

function ActionCard({
  title,
  description,
  gradient,
  onClick,
}: {
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="
        relative overflow-hidden rounded-3xl
        bg-white/80 backdrop-blur-xl
        p-6 text-left shadow-xl border border-white
      "
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
      />

      <h4 className="text-lg font-semibold text-slate-800">
        {title}
      </h4>
      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <span className="mt-4 inline-block text-sm font-semibold text-emerald-600">
        Go →
      </span>
    </motion.button>
  );
}
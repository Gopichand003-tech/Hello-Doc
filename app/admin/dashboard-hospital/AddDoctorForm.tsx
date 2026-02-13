"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Stethoscope, IndianRupee, Loader2 } from "lucide-react";

export default function AddDoctorForm({ onSuccess }: any) {
  const [form, setForm] = useState({
    name: "",
    speciality: "",
    fee: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.speciality || !form.fee) return;

    setLoading(true);

    await fetch("/api/admin/doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        fee: Number(form.fee),
      }),
    });

    setLoading(false);
    setForm({ name: "", speciality: "", fee: "" });
    onSuccess?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border bg-white p-7 shadow-xl space-y-6"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Add Doctor
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add a doctor to manage availability & bookings
        </p>
      </div>

      {/* FORM */}
      <div className="space-y-4">
        <Field
          icon={<User size={18} />}
          label="Doctor Name"
          value={form.name}
          onChange={(v: string) => setForm({ ...form, name: v })}
        />

        <Field
          icon={<Stethoscope size={18} />}
          label="Speciality"
          value={form.speciality}
          onChange={(v) =>
            setForm({ ...form, speciality: v })
          }
        />

        <Field
          icon={<IndianRupee size={18} />}
          label="Consultation Fee"
          value={form.fee}
          type="number"
          onChange={(v) => setForm({ ...form, fee: v })}
        />
      </div>

      {/* ACTION */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2
        rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white
        shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Add Doctor"
        )}
      </button>
    </motion.div>
  );
}

/* ================= FIELD ================= */

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  type?: string;
};

function Field({
  label,
  value,
  onChange,
  icon,
  type = "text",
}: FieldProps) {

  return (
    <div className="relative">
      <span className="absolute left-4 top-3.5 text-slate-400">
        {icon}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="w-full rounded-xl border border-slate-300 bg-white
        px-11 py-3 text-sm text-slate-800 outline-none transition
        focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}

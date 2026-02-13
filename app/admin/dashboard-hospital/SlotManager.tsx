"use client";

import { useState } from "react";
import { Loader2, Plus, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function SlotManager({ doctorId }: { doctorId: string }) {
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const addSlot = async () => {
    if (!time || loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          time, // ✅ PERMANENT SLOT (NO DATE)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to add slot");
      } else {
        setMessage("✅ Slot added successfully");
        setTime("");
      }
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm"
    >
      {/* HEADER */}
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
        <Clock size={16} className="text-emerald-600" />
        Permanent Time Slots
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-3">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="
            w-full rounded-xl border border-slate-300 bg-white
            px-4 py-2.5 text-sm text-slate-800 outline-none
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30
          "
        />

        <button
          onClick={addSlot}
          disabled={loading || !time}
          className="
            flex items-center gap-1.5 rounded-xl
            bg-gradient-to-r from-emerald-600 to-cyan-600
            px-4 py-2.5 text-sm font-medium text-white shadow
            hover:opacity-90 transition disabled:opacity-60
          "
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          Add
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 text-xs font-medium ${
            message.startsWith("✅")
              ? "text-emerald-600"
              : "text-rose-600"
          }`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Search,
  CalendarCheck,
  Hash,
  Stethoscope,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find a Doctor",
    description:
      "Search verified specialists by category, availability, or hospital.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Select Date & Slot",
    description:
      "Choose your preferred date and available time slot instantly.",
  },
  {
    icon: Hash,
    step: "03",
    title: " Token Confirmation",
    description:
      "Receive your appointment token and confirmation details.",
  },
  {
    icon: Stethoscope,
    step: "04",
    title: "Visit & Get Treated",
    description:
      "Consult the doctor at your scheduled time.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="relative py-28 bg-gradient-to-b from-white to-emerald-50/40 overflow-hidden">
      
      {/* Soft Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-block px-6 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide shadow-sm">
            HOW IT WORKS
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Book Healthcare in 4 Simple Steps
          </h2>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            From finding a doctor to receiving care — Hello Doc
            streamlines your entire appointment journey.
          </p>
        </motion.div>

        {/* STEPS */}
        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Horizontal Flow Line */}
          <div className="hidden lg:block absolute top-28 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-300 via-emerald-200 to-transparent rounded-full" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="relative bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300">
                
                {/* Step Badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center shadow-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 250 }}
                  className="mt-10 w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-inner"
                >
                  <step.icon className="w-10 h-10 text-emerald-600" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-slate-600 leading-relaxed text-sm">
                  {step.description}
                </p>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 opacity-0 group-hover:opacity-20 blur-2xl transition duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

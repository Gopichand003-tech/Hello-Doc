"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-slate-900 text-slate-300 pt-20 pb-10 overflow-hidden">
      
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* BRAND */}
          <div>
           <span className="font-logo text-4xl text-white-300 tracking-[0.25em] drop-shadow-md leading-none">
              Hello Doc
            </span>
            <p className="text-slate-400 text-sm leading-relaxed">
              Seamless doctor booking and healthcare management —
              built for modern patients who value time and care.
            </p>

            {/* Socials */}
            <div className="flex gap-4 mt-6">
              <a className="hover:text-emerald-400 transition">
                <Facebook size={18} />
              </a>
              <a className="hover:text-emerald-400 transition">
                <Instagram size={18} />
              </a>
              <a className="hover:text-emerald-400 transition">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/user" className="hover:text-emerald-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/extradoctors" className="hover:text-emerald-400 transition">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/user/appointments" className="hover:text-emerald-400 transition">
                  My Appointments
                </Link>
              </li>
              <li>
                <Link href="/user/history" className="hover:text-emerald-400 transition">
                  Appointment History
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="hover:text-emerald-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Contact
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={16} />
                support@hellodoc.com
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} />
                +91 91546 xxxx
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={16} />
                Vijayawada, India
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mt-16 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Hello Doc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

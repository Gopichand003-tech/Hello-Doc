import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";

import Availability from "@/app/models/Availability";
import Doctor from "@/app/models/Doctor";

/* ===============================
   POST → CREATE / UPDATE AVAILABILITY
================================ */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { doctorId, date, available } = await req.json();

    /* -------- VALIDATION -------- */
    if (!doctorId || !date) {
      return NextResponse.json(
        { error: "doctorId and date are required" },
        { status: 400 }
      );
    }

    if (typeof available !== "boolean") {
      return NextResponse.json(
        { error: "available must be true or false" },
        { status: 400 }
      );
    }

    /* -------- DOCTOR CHECK -------- */
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    /* -------- UPSERT AVAILABILITY -------- */
    const availability = await Availability.findOneAndUpdate(
      { doctor: doctorId, date },
      { available },
      { upsert: true, new: true }
    );

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("AVAILABILITY POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    );
  }
}

/* ===============================
   GET → FETCH AVAILABILITY
================================ */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const doctorId = req.nextUrl.searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 }
      );
    }

    const availability = await Availability.find({
      doctor: doctorId,
    }).sort({ date: 1 });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("AVAILABILITY GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

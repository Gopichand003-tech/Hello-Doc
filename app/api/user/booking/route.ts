import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/dbConnect";
import Booking from "@/app/models/Booking";
import Doctor from "@/app/models/Doctor";
import Slot from "@/app/models/Slot";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { doctorId, date, slotTime } = await req.json();

  if (!doctorId || !date || !slotTime) {
    return NextResponse.json(
      { error: "doctorId, date and slotTime are required" },
      { status: 400 }
    );
  }

  const appointmentDate = new Date(date);

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const sessionDb = await mongoose.startSession();
  sessionDb.startTransaction();

  try {
    /* ===============================
       🧠 DAILY LIMIT (PER PATIENT)
    =============================== */
    const patientDailyCount = await Booking.countDocuments(
      {
        patient: session.user.id,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: "CANCELLED" },
      },
      { session: sessionDb }
    );

    if (patientDailyCount >= 2) {
      throw new Error("DAILY_LIMIT");
    }

    /* ===============================
       🔒 SLOT LOCK (ATOMIC)
    =============================== */
   
    const existingBooking = await Booking.findOne({
  doctor: doctorId,
  appointmentDate: {
    $gte: startOfDay,
    $lte: endOfDay,
  },
  slotTime,
  status: { $ne: "CANCELLED" },
});

if (existingBooking) {
  return NextResponse.json(
    { error: "This slot is already booked" },
    { status: 409 }
  );
}

    /* ===============================
       🔢 TOKEN NUMBER (SAFE)
    =============================== */
    const lastBooking = await Booking.findOne(
      {
        doctor: doctorId,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      },
      {},
      { session: sessionDb }
    )
      .sort({ tokenNumber: -1 });

    const nextToken = lastBooking ? lastBooking.tokenNumber + 1 : 1;

    /* ===============================
       📌 CREATE BOOKING
    =============================== */
    const booking = await Booking.create(
      [
        {
          doctor: doctorId,
          hospital: doctor.hospital_id,
          patient: session.user.id,
          appointmentDate,
          slotTime,
          tokenNumber: nextToken,
          status: "BOOKED",
        },
      ],
      { session: sessionDb }
    );

    await sessionDb.commitTransaction();
    sessionDb.endSession();

    return NextResponse.json({ booking: booking[0] });

  } catch (error: any) {
    await sessionDb.abortTransaction();
    sessionDb.endSession();

    if (error.message === "DAILY_LIMIT") {
      return NextResponse.json(
        { error: "You can only book 2 appointments per day" },
        { status: 400 }
      );
    }

    if (error.message === "SLOT_TAKEN") {
      return NextResponse.json(
        { error: "This slot is no longer available" },
        { status: 409 }
      );
    }

    console.error("BOOKING ERROR:", error);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}

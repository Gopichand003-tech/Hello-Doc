import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Booking from "@/app/models/Booking";
import User from "@/app/models/user";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.hospital_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔴 FIX: convert string → ObjectId
  const hospitalId = new mongoose.Types.ObjectId(
    session.user.hospital_id
  );

  /**
   * STEP 1: Latest booking per patient (this hospital)
   */
  const latestBookings = await Booking.aggregate([
  {
    $match: {
      hospital: hospitalId,
      status: { $ne: "CANCELLED" },
    },
  },
  { $sort: { updatedAt: -1 } },
  {
    $group: {
      _id: "$patient",
      tokenNumber: { $first: "$tokenNumber" },
      lastVisit: { $first: "$appointmentDate" },
    },
  },
]);

  if (!latestBookings.length) {
    return NextResponse.json({ patients: [] });
  }

  /**
   * STEP 2: Fetch patient users
   */
  const patientIds = latestBookings.map((b) => b._id);

  const users = await User.find(
    { _id: { $in: patientIds } },
    { password: 0 }
  ).lean();

  /**
   * STEP 3: Merge
   */
  const bookingMap = new Map(
    latestBookings.map((b) => [
      b._id.toString(),
      {
        tokenNumber: b.tokenNumber,
        lastVisit: b.lastVisit,
      },
    ])
  );

  const patients = users.map((u) => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone || null,
    tokenNumber:
      bookingMap.get(u._id.toString())?.tokenNumber ?? null,
    lastVisit:
      bookingMap.get(u._id.toString())?.lastVisit ?? null,
  }));

  return NextResponse.json({ patients });
}

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Booking from "@/app/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // ✅ Start of today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const bookings = await Booking.find({
    patient: userId,
    $or: [
      { status: { $ne: "COMPLETED" } },
      {
        status: "COMPLETED",
        appointmentDate: { $gte: startOfToday },
      },
    ],
  })
    .populate("doctor", "name speciality")
    .populate("hospital", "name")
    .sort({ appointmentDate: 1 });

  return NextResponse.json({ bookings });
}

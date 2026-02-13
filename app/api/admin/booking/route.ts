import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Booking from "@/app/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.hospital_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hospitalId = session.user.hospital_id;

  // 🔴 End of today
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const bookings = await Booking.find({
    hospital: hospitalId,

    // ❗ Hide completed bookings after today
    $or: [
      { status: { $ne: "COMPLETED" } },
      {
        status: "COMPLETED",
        appointmentDate: { $gte: endOfToday },
      },
    ],
  })
    .populate("doctor", "name speciality")
    .populate("patient", "name email")
    .sort({ appointmentDate: 1 });

  return NextResponse.json({ bookings });
}


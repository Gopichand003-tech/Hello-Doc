import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Booking from "@/app/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import Doctor from "@/app/models/Doctor";
import Hospital from "@/app/models/Hospital";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ history: [] }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const history = await Booking.find({
    patient: session.user.id,
    $or: [
      { appointmentDate: { $lt: today } },
      { status: { $ne: "BOOKED" } },
    ],
  })
    .populate("doctor", "name speciality")
    .populate("hospital", "name")
    .sort({ appointmentDate: -1 })
    .lean();

  return NextResponse.json({ history });
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import Doctor from "@/app/models/Doctor";
import Booking from "@/app/models/Booking";
import { connectDB } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.hospital_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hospitalId = session.user.hospital_id;

  // 📅 Today range
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 👨‍⚕️ Doctors
  const doctors = await Doctor.countDocuments({
    hospital_id: hospitalId,
  });

  const newDoctors = await Doctor.countDocuments({
    hospital_id: hospitalId,
    createdAt: { $gte: today, $lt: tomorrow },
  });

  // 📆 TODAY bookings only
  const bookingsToday = await Booking.countDocuments({
    hospital: hospitalId,
    appointmentDate: { $gte: today, $lt: tomorrow },
  });

  // 🧑‍🤝‍🧑 Unique patients today
  const patientsToday = (
    await Booking.distinct("patient", {
      hospital: hospitalId,
      appointmentDate: { $gte: today, $lt: tomorrow },
    })
  ).length;

  return NextResponse.json({
    doctors,
    newDoctors,
    patients: patientsToday,
    bookings: bookingsToday, // ✅ only today
  });
}

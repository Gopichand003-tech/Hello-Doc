import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { connectDB } from "@/app/lib/dbConnect";
import Doctor from "@/app/models/Doctor";
import User from "@/app/models/user";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 🔐 Get session (SINGLE source of truth)
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, speciality, fee , availableToday,  } = await req.json();

    if (!name || !speciality || !fee) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const adminId = session.user.id; // ✅ REAL ObjectId
    const admin = await User.findById(adminId);

    if (!admin || !admin.hospital_id) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    const doctor = await Doctor.create({
      name,
      speciality,
      fee,
      availableToday: Boolean,
      hospital_id: admin.hospital_id,
    });

    return NextResponse.json({ success: true, doctor });
  } catch (err: any) {
    console.error("ADD DOCTOR ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

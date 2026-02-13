import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/app/lib/dbConnect";
import Doctor from "@/app/models/Doctor";
import User from "@/app/models/user";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "HOSPITAL_ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const adminId = session.user.id; // ✅ real ObjectId

  const admin = await User.findById(adminId);

  const doctors = await Doctor.find({
    hospital_id: admin.hospital_id,
  });

  return NextResponse.json({ doctors });
}

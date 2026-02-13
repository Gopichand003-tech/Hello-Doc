import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Booking from "@/app/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = await req.json();

  await Booking.findOneAndUpdate(
    { _id: bookingId, patient: session.user.id },
    { status: "CANCELLED" }
  );

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/app/lib/dbConnect";
import User from "@/app/models/user";

/* ================= GET PROFILE ================= */
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id).select(
      "name email phone"
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: user,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
export async function PUT(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, image } = body;

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name,
        phone,
        image, // 🔥 THIS WAS MISSING
      },
      { new: true, runValidators: true }
    ).select("name email phone image");

    return NextResponse.json({
      profile: updatedUser,
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/dbConnect";
import User from "@/app/models/user";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      role: "PATIENT",
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

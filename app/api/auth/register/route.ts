import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateTzId } from "@/lib/generateTzId";
import { signJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate TZ ID
    const tzId = await generateTzId();

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name,
      tzId,
      registrationCompleted: false,
      role: "user",
      eventsRegistered: [],
      workshopsRegistered: [],
      workshopPayments: {},
    });

    // Create JWT
    const token = signJWT({
      userId: user._id.toString(),
      email: user.email,
      registrationCompleted: user.registrationCompleted,
    });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        tzId: user.tzId,
        registrationCompleted: user.registrationCompleted,
      },
    }, { status: 201 });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[Register API] Error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}

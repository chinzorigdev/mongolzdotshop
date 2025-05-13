import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { z } from "zod";

// Validation schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  adminCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { username, email, password, adminCode } = body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Username or email already exists",
        },
        { status: 409 }
      );
    }

    // Set role based on admin code or first user
    let role = "user";

    // For first user setup or if admin code matches
    const userCount = await User.countDocuments();
    if (userCount === 0 || adminCode === process.env.ADMIN_CODE) {
      role = "admin";
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      role,
    });

    await newUser.save();

    // Return user info (except password)
    const userData = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    return NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

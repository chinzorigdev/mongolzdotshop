import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { z } from "zod";

// Validation schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { username, password } = body;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    // Return user info (except password)
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/db"; // Assuming this correctly connects to your DB
import { UserModel } from "@/models/user.model"; // Assuming this is your Mongoose User model

// Sign up
export const POST = async (req: NextRequest) => {
  // Changed to POST as it's standard for sign-in
  try {
    await DbConnect();

    const { username, email, password } = await req.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await UserModel.findOne({ username, email });
    if (user) {
      return NextResponse.json(
        { success: false, message: "User already found" }, // Generic message for security
        { status: 401 }
      );
    }

    const newUser = await UserModel.create({ username, email });

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      data: newUser,
    });

    return response;
  } catch (error: any) {
    console.error("Sign-up error:", error);
    // It's good practice to avoid sending detailed internal error messages to the client.
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
};

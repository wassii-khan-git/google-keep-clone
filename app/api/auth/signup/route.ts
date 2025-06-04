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
      return NextResponse.json({ status: 400 });
    }

    // Check if the user exists
    const user = await UserModel.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return NextResponse.json(
        { success: false, message: "User already found" }, // Generic message for security
        { status: 401 }
      );
    }

    // Create a new user
    const newUser = new UserModel({
      username,
      email,
      password, // Ensure password is hashed in the UserModel schema
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      data: newUser,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "An error occurred during sign-up",
        },
        { status: 500 }
      );
    }
    console.error("Sign-up error:", error);
  }
};

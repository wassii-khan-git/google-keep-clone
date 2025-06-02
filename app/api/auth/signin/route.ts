import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/db"; // Assuming this correctly connects to your DB
import { UserModel } from "@/models/user.model"; // Assuming this is your Mongoose User model
import jwt from "jsonwebtoken";

// Sign in
export const POST = async (req: NextRequest) => {
  // Changed to POST as it's standard for sign-in
  try {
    await DbConnect();

    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await UserModel.findOne({ email }).select("+password"); // Include password for comparison

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" }, // Generic message for security
        { status: 401 }
      );
    }

    // Check for the password
    const isPasswordValid = await user.comparePassword(password);
    // if password is not valid
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" }, // Generic message for security
        { status: 401 }
      );
    }

    // Generate the JWT token
    const tokenPayload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Prepare user data to return (excluding sensitive info)
    const { password: _, ...userWithoutPassword } = user.toObject(); // Or user._doc

    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully",
      user: userWithoutPassword,
      // token, // Optionally return token in body if needed by client for non-web platforms
    });

    // Set the token in an HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "lax", // Or "strict" for more security, "lax" is a good default
      maxAge: 60 * 60 * 24 * 1, // 1 day in seconds (align with token expiry)
      path: "/", // Cookie available for all paths
    });

    return response;
  } catch (error: any) {
    console.error("Sign-in error:", error);
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

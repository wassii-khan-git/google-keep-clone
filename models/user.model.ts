// models/user.model.ts
import { Document, Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
// patterns
import { EmailPatterns } from "@/lib/patterns";

export interface IUser extends Document {
  _id: string;
  username?: string;
  email: string;
  password: string;
  image?: string;
  emailVerified?: Date;
  provider?: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [EmailPatterns, "Please enter a valid email"],
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },
    providerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = models.users || model<IUser>("users", UserSchema);

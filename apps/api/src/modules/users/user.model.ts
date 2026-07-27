import mongoose, { Schema } from "mongoose";
import type { IUser } from "./user.types";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpiry: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },
    avatar: String,
    lastLoginAt: Date,
    emailNotifications: { type: Boolean, default: true },
    deletedAt: { type: Date, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        return ret;
      },
    },
  },
);

userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ deletedAt: 1 }, { sparse: true });

// Soft-delete filter
userSchema.pre(/^find/, function (next) {
  (this as mongoose.Query<unknown, IUser>).where({ deletedAt: null });
  next();
});

export const User = mongoose.model<IUser>("User", userSchema);

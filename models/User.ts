import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
  // Basic info
  name: string
  email: string
  passwordHash: string
  // TZ ID
  tzId: string
  // Registration details
  collegeName?: string
  mobileNumber?: string
  yearOfStudy?: string
  department?: string
  registrationCompleted: boolean
  // Role
  role: "user" | "admin"
  // Events
  eventsRegistered: string[]
  // Workshops
  workshopsRegistered: string[]
  workshopPayments: {
    [workshopId: string]: "PAID" | "NOT_PAID"
  }
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    tzId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    collegeName: String,
    mobileNumber: String,
    yearOfStudy: String,
    department: String,
    registrationCompleted: {
      type: Boolean,
      default: false,
    },
    eventsRegistered: {
      type: [String],
      default: [],
    },
    workshopsRegistered: {
      type: [String],
      default: [],
    },
    workshopPayments: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

// Export model - uses "users" collection (no conflict since Auth.js is removed)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User


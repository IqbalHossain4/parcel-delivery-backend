import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, Role, Status } from "./user.interface";

const authProvider = new Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.receiver,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },

    picture: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.isActive,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    auths: [authProvider],
    parcels: { type: Schema.Types.ObjectId, ref: "Parcels" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Users = model<IUser>("Users", userSchema);

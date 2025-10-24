import { Types } from "mongoose";

export enum Role {
  admin = "admin",
  sender = "sender",
  receiver = "receiver",
}

export enum Status {
  isActive = "active",
  isInactive = "inactive",
  isBlocked = "blocked",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  address?: string;
  phone?: string;
  role: Role;
  picture?: string;
  status?: Status;
  isDeleted?: string;
  isVerified?: boolean;
  auths: IAuthProvider[];
  parcels?: Types.ObjectId[];
  createdAt?: Date;
}

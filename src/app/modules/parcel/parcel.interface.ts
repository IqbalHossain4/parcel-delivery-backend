import { Types } from "mongoose";

export enum IParcelStatus {
  requested = "requested",
  approved = "approved",
  dispatched = "dispatched",
  inTransit = "inTransit",
  delivered = "delivered",
  cancelled = "cancelled",
  rejected = "rejected",
  returned = "returned",
  rescheduled = "rescheduled",
}

export interface IStatusLog {
  status: IParcelStatus;
  updatedBy: Types.ObjectId;
  note?: string;
}



export interface IParcel {
  type: string;
  weight?: number;
  fee?: number;
  sender: Types.ObjectId;
  receiver: {
    name: string;
    address: string;
    email?: string;
    phone: string;
    city: string;
    postalCode:string;
  };
  deliveryDate: Date;
  status: IParcelStatus;
  trackingCode: string;
  statusLog?: IStatusLog[];
  assignedTo?:Types.ObjectId
  isFlagged: boolean;
  isBlocked: boolean;
  dispatchedAt?:Date;
  deliveredAt?:Date;
  createdAt?: Date;
  updatedAt?: Date;
}

import { model, Schema } from "mongoose";
import { IParcel, IParcelStatus,IStatusLog } from "./parcel.interface";


const statusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: Object.values(IParcelStatus),
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    note: {
      type: String,
      
    },
  },
  { _id: false,  timestamps: true  }
);




const parcelSchema = new Schema<IParcel>(
  {
    type: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiver: {
      name:String, phone:String, address:String, city:String, postalCode:String
    },
    address: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(IParcelStatus),
      default: IParcelStatus.requested,
    },
    trackingCode: {
      type: String,
      required: true,
      unique: true,
    },
    assignedTo:{
      type:Schema.Types.ObjectId,
      ref:"Users",
      default: null
    },
    statusLog:{
      type:[statusLogSchema],
      default: [],
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    dispatchedAt: {
      type: Date,

    },
    deliveredAt: {
      type: Date,

    }},
    
  {
    timestamps: true,
  }
);

export const Parcels = model<IParcel>("Parcels", parcelSchema);

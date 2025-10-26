import { JwtPayload } from "jsonwebtoken"
import { Users } from "../user/user.model"
import { IParcel, IParcelStatus, IStatusLog } from "./parcel.interface"
import AppError from "../../errorHelper/AppError"
import { Parcels } from "./parcel.model"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { Types } from "mongoose"

const createParcel=async(payload:IParcel, decodedToken:JwtPayload)=>{
    const isUserExist =  await Users.findById(decodedToken.userId)

    if(!isUserExist){
        throw new AppError(404,"User not found")
    }

    if(isUserExist.role !== "sender"){
        throw new AppError(401,"Unauthorized")
    }

    payload.sender = decodedToken.userId

    const parcel= await Parcels.create({
        ...payload,
        sender:decodedToken.userId
    })

    return parcel
}


const getAllParcels=async(query:Record<string,string>)=>{
    const queryBuilder = new QueryBuilder(Parcels.find(), query)
    const parcels = await queryBuilder.paginate().fields().filter().sort();
    const [data, meta] = await Promise.all([
        parcels.build(),
        queryBuilder.getMeta()
    ])
    
    return{
        data,
        meta
    }
}


const getSenderParcels =  async(decodedToken:JwtPayload)=>{
const result =  await Parcels.find({sender:decodedToken.userId})
return result
}


const getReceiverParcels = async(emailOrPhone:string)=>{
    const result = await Parcels.find({$or:[{"receiver.email":emailOrPhone},{"receiver.phone":emailOrPhone}]}).populate("sender").sort({createdAt:-1})
    return result
}


const confirmDelivery =  async(id:string)=>{
const isPacelExist =  await Parcels.findById(id)

if(!isPacelExist){
    throw new AppError(404, "Parcel not found")
}

const result = await Parcels.findByIdAndUpdate(id,{status:IParcelStatus.delivered},{new:true, runValidators:true})
return result
}

const cancelParcel = async(id:string)=>{
    const parcel =  await Parcels.findById(id);


    if(!parcel){
        throw new AppError(404,"Parcel not found")
    }

   if (!parcel.status || !["requested", "approved"].includes(parcel.status)) {
  throw new AppError(400, "Parcel cannot be cancelled");
}

    parcel.status = IParcelStatus.cancelled;

  parcel.statusLog = parcel.statusLog || [];
  parcel.statusLog.push({
    status: IParcelStatus.cancelled,
    updatedBy: parcel.sender,
    note: "Parcel cancelled by sender",
  });
 
 await parcel.save();
 return parcel
}


const getParcelById= async(id:string)=>{
    const parcel= await Parcels.findById(id)
    if(!parcel){
        throw new AppError(404,"Parcel not found")
    }
    const result = await parcel.populate("sender")
    return result
}


const updateStatus=async(id:string, payload:IStatusLog, decodedToken:JwtPayload)=>{
const isParcelExist =  await Parcels.findById(id);

if(!isParcelExist){
    throw new AppError(404,"Parcel not found")
}

isParcelExist.status = payload.status;
isParcelExist.statusLog?.push({
    status:payload.status,
    updatedBy: decodedToken.userId,
    note:payload.note
})


if(isParcelExist.status ==="dispatched"){
   isParcelExist.dispatchedAt = new Date();
}

if(isParcelExist.status ==="delivered"){
    isParcelExist.deliveredAt = new Date();
}

await isParcelExist.save();
return isParcelExist

}


const blockParcel = async(id:string)=>{
const parcel = await Parcels.findById(id);

if(!parcel){
    throw new AppError(404,"Parcel not found")
}

const result = await Parcels.findByIdAndUpdate(id,{isBlocked:true},{new:true, runValidators:true})
return result

}


const assignDeliveryPerson = async(id:string, decodedToken:JwtPayload, payload:Record<string,Types.ObjectId>)=>{
    const parcel = await Parcels.findById(id);

    if(!parcel){
        throw new AppError(404,"Parcel not found")
    }

parcel.assignedTo = payload.assignedTo;
parcel.status = IParcelStatus.dispatched
parcel.statusLog?.push({
    status:IParcelStatus.dispatched,
    updatedBy:decodedToken.userId,
    note:"Parcel assigned to delivery person"
})
await parcel.save();
return parcel

}

const trackParcel= async(trackingId:string)=>{

    const parcel = await Parcels.findOne({trackingCode:trackingId}).select("trackingId status receiver statusLogs type weight fee createdAt deliveredAt isBlocked");
    if (!parcel) {
    throw new AppError(404, "Parcel not found");
  }

  if (parcel.isBlocked) {
    throw new AppError(403, "This parcel has been blocked by the admin");
  }

    return parcel
}


export const ParcelService={
    createParcel,
    getAllParcels,
    getSenderParcels,
    getReceiverParcels,
    confirmDelivery,
    getParcelById,
    updateStatus,
    blockParcel,
    assignDeliveryPerson,
    cancelParcel,
    trackParcel
}
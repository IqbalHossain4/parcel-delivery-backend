import { JwtPayload } from "jsonwebtoken"
import { Users } from "../user/user.model"
import { IParcel, IParcelStatus, IStatusLog } from "./parcel.interface"
import AppError from "../../errorHelper/AppError"
import { Parcels } from "./parcel.model"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { Types } from "mongoose"
import { Role } from "../user/user.interface"

const createParcel=async(payload:IParcel, decodedToken:JwtPayload)=>{
    const isUserExist =  await Users.findById(decodedToken.userId)
    if(!isUserExist){
        throw new AppError(404,"User not found")
    }

    const parcel= await Parcels.create(payload)

    return parcel
}


const getAllParcels=async(query:Record<string,string>)=>{
    const queryBuilder = new QueryBuilder(Parcels.find(),query)
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
const result =  await Parcels.find({sender:decodedToken.userId}).populate("receiver").sort({createdAt:-1})
return result
}


const getReceiverParcels = async(decodedToken:JwtPayload)=>{
    const result = await Parcels.find({receiver:decodedToken.userId}).sort({createdAt:-1})
    return result

}


const confirmDelivery =  async(id:string)=>{
const userIsExist =  await Users.findById(id)

if(!userIsExist){
    throw new AppError(404, "User not found")
}

const result = await Parcels.findByIdAndUpdate(id,{status:IParcelStatus.delivered},{new:true, runValidators:true})
return result
}

const cancelParcel = async(id:string)=>{
    const parcel =  await Parcels.findById({_id:id});

    if(!parcel){
        throw new AppError(404,"Parcel not found")
    }

    if(!["requested","approved"].includes(parcel.status)){
        throw new AppError(400,"Parcel cannot be cancelled")
    }

   parcel.status = IParcelStatus.cancelled;
   parcel.statusLog?.push({
    status:IParcelStatus.cancelled,
    updatedBy: parcel.sender,
    note:"Parcel cancelled by sender"
   })
 await parcel.save();
 return parcel
}


const updateStatus=async(id:string, payload:IStatusLog)=>{
const isParcelExist =  await Parcels.findById(id);

if(!isParcelExist){
    throw new AppError(404,"Parcel not found")
}

isParcelExist.status = payload.status;
isParcelExist.statusLog?.push({
    status:payload.status,
    updatedBy: payload.updatedBy,
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


const assignParcel = async(id:string,decodedToken:JwtPayload, payload:string)=>{
    const parcel = await Parcels.findById(id);

    if(!parcel){
        throw new AppError(404,"Parcel not found")
    }


    parcel.assignedTo = new Types.ObjectId(payload)
parcel.statusLog?.push({
    status:IParcelStatus.approved,
    updatedBy:decodedToken.userId,
    note:"Parcel assigned to driver"
})
await parcel.save();
return parcel

}

const trackParcel= async(id:string)=>{

    const parcel = await Parcels.findById(id).select("trackingId status receiver statusLogs type weight fee createdAt deliveredAt isBlocked");
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
    updateStatus,
    blockParcel,
    assignParcel,
    cancelParcel,
    trackParcel
}
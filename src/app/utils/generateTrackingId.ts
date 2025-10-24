import crypto from "crypto";
import { Parcels } from "../modules/parcel/parcel.model";


export const generateTrackingCode   = async():Promise<string> =>{
    const date =  new Date().toISOString().slice(0,10).replace(/-/g,"");
    const random = crypto.randomBytes(3).toString("hex");
    const trackingId = `TRK-${date}-${random}`;
    const isExist =  await Parcels.findOne({trackingId:trackingId});
    if(isExist){
        return await generateTrackingCode()
    }
    return trackingId
}
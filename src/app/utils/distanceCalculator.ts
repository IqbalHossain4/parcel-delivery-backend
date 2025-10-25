import axios from "axios";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";

export const calculateDistance= async(origin:string, destination:string):Promise<number>=>{
const apiKey = envVars.GOOGLE_MAPS_API_KEY;
const url =`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

const response = await axios.get(url)
const data = response.data;

if(data.status !== "OK"){
    throw new Error(data.error_message);
}

const distanceInMeters = data.rows[0].elements[0].distance.value;

if (!distanceInMeters){
     throw new AppError(400, "Invalid address");
}
 
const distanceInKm = distanceInMeters / 1000;

return distanceInKm

}


export const calculateFeeByDistance =(distance:number)=>{
if(distance <= 5 ) return 80;
if(distance <= 20) return 150;
if(distance <= 50) return 300;
if(distance <= 100) return 500;
return 800;
}
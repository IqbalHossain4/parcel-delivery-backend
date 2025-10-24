/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelService } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";
import { generateTrackingCode } from "../../utils/generateTrackingId";



const createParcel = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
const decodedToken =  req.user as JwtPayload;
const trackingCode =  await generateTrackingCode();
const payload = {
trackingCode:trackingCode,
...req.body
};
const result =  await ParcelService.createParcel(payload, decodedToken);
sendResponse(res,{
    statusCode:200,
    success:true,
    message:"Parcel created successfully",
    data:payload
})
});



const getAllParcels =  catchAsync(async(req:Request, res:Response, next:NextFunction) => {

    const result = await ParcelService.getAllParcels(req.query as Record<string,string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Parcels fetched successfully",
        data: result,
      });
})


const getSenderParcels =  catchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const decodedToken  =  req.user as JwtPayload;
    const resut = await ParcelService.getSenderParcels(decodedToken)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Parcels fetched successfully",
        data: resut,
      });
})


const getReceiverParcels = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
const decodedToken = req.user as JwtPayload
 
    const result = await ParcelService.getReceiverParcels(decodedToken);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Parcels fetched successfully",
        data: result,
      });
})


const confirmDelivery = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
const id =  req.params.id;
const result = await ParcelService.confirmDelivery(id);
sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel delivered successfully",
    data: result,
  });
})

const cancelParcel = catchAsync(async(req:Request, res:Response, next:NextFunction) => {
    const id = req.params.id;
  
    const result = await ParcelService.cancelParcel(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: result,
      });
})


const updateStatus = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
const id =  req.params.id;
const payload = req.body;
const result = await ParcelService.updateStatus(id, payload);
sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel status updated successfully",
    data: result,
  });
})


const blockParcel = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
const id = req.params.id;
const result = await ParcelService.blockParcel(id);
sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel blocked successfully",
    data: result,
  });
})


const assignParcel = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
const id = req.params.id;
const decodedToken = req.user as JwtPayload
const payload = req.body;
const result = await ParcelService.assignParcel(id, decodedToken, payload);
sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel assigned successfully",
    data: result,
  });
})


const trackParcel = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
const id = req.params.trackingId;
const result = await ParcelService.trackParcel(id);
sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel tracked successfully",
    data: result,
  });
})

export const ParcelController = {
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
      };
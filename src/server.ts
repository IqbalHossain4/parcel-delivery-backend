/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL as string);
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

(async () => {
  await startServer();
})();


//server error handling

process.on("SIGTERM",(err)=>{
  console.log("SIGTERM detected, Server is Shutting down",err);
  if(server){
server.close(()=>{
  process.exit(1)
})
  }

  process.exit(1)

})


process.on("SIGINT",(err)=>{
console.log("SIGINT detected, server is shutting down", err);
if(server){
  server.close(()=>{
    process.exit(1)
  })
}

process.exit(1)

})


//unHandledRejection
process.on("unhandledRejection",(err)=>{
  console.log("UnhandledRejection is detected, server is shutting  down", err);
  if(server){
    server.close(()=>{
      process.exit(1)
    })
  }
  process.exit(1)
})


process.on("uncaughtException", (err)=>{
  console.log("uncaughtException is detected, server is shutting down", err);

  if(server){
    server.close(()=>{
      process.exit(1)
    })
  }
  process.exit(1)
})
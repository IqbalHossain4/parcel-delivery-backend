import crypto from "crypto";
import AppError from "../../errorHelper/AppError";
import { redisClient } from "../../config/redis.config";
import { Users } from "../user/user.model";
import { sendEmail } from "../../utils/sendMail";

const generateOTP = () => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (email: string, name: string) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new AppError(401, "User not found");
  }
  if (user?.isVerified) {
    throw new AppError(401, "User already verified");
  }
  const otp = generateOTP();
  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: 2 * 60, //2minutes,
    },
  });

  await sendEmail({
    to: email,
    subject: "Yout OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new AppError(401, "User not Found");
  }

  if (user?.isVerified) {
    throw new AppError(401, "User is already verified");
  }
  const redisKey = `otp:${email}`;
  const savedOTP = await redisClient.get(redisKey);

  if (!savedOTP) {
    throw new AppError(401, "Invalid OTP");
  }

  if (savedOTP !== otp) {
    throw new AppError(401, "Invalid OTP");
  }

  await Promise.all([
    Users.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey]),
  ]);
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};

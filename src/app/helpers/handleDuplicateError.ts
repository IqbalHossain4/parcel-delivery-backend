/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interface/error.types";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const matchArray = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 400,
    message: `${matchArray?.[1]} already exists`,
  };
};

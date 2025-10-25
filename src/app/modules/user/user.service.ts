import bcrypt from "bcryptjs";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { Users } from "./user.model";
import AppError from "../../errorHelper/AppError";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await Users.findOne({ email });
  if (isUserExist) {
    throw new Error("User is Exist");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await Users.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async (query:Record<string, string>) => {
  const userSearchField = ["name","email", "role"]
  const queryBuilder = new QueryBuilder(Users.find(), query)
 const users = await queryBuilder.search(userSearchField).paginate().fields().filter().sort();
 const [data, meta] = await Promise.all([
  users.build(),
  queryBuilder.getMeta()
 ])

return{
  data,
  meta
}


};

const getMyProfile = async (userId: string) => {
  const result = await Users.findById(userId).select("-password");
  return result;
};

const getUserById = async (id: string) => {
  const result = await Users.findById(id);
  return result;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role == Role.receiver || decodedToken.role == Role.sender) {
    if (userId != decodedToken.userId) {
      throw new AppError(401, "Unauthorized");
    }
  }

  const isUserExist = await Users.findById(userId);

  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }

  if (decodedToken.role !== Role.admin) {
    throw new AppError(401, "Unauthorized");
  }

  if (payload.role) {
    if (
      decodedToken.role === Role.receiver ||
      decodedToken.role === Role.sender
    ) {
      throw new AppError(401, "Unauthorized");
    }
  }

  if (payload.status || payload.isDeleted || payload.isVerified) {
    if (
      decodedToken.role === Role.receiver ||
      decodedToken.role === Role.sender
    ) {
      throw new AppError(401, "Unauthorized");
    }
  }

  const newUpdateUser = await Users.findByIdAndUpdate(
    { _id: userId },
    payload,
    {
      new: true,
      runValidators: true,
    }
  );
  return newUpdateUser;
};

export const UserService = {
  createUser,
  getAllUsers,
  getMyProfile,
  getUserById,
  updateUser,
};

import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import { User } from "./UserTypes";
import { Roles } from "../../constants";

export default class UserService {
  constructor(private userModel: Model<User>) {}

  async create({
    email,
    fullname,
    password,
    username,
    role,
  }: {
    email: string;
    fullname: string;
    password: string;
    username: string;
    role: string;
  }) {
    return await this.userModel.create({
      personal_info: {
        email,
        fullname,
        password,
        username,
      },
      role,
    });
  }

  async createSocialAuthUser({
    email,
    fullname,
  }: {
    email: string;
    fullname: string;
  }) {
    const user = await this.findUserByEmail(email);

    if (user) {
      return user;
    }

    const username = await this.generateUserName(email);

    const newUser = await this.userModel.create({
      personal_info: {
        email,
        fullname,
        password: this.generateRandomPassword(),
        username,
      },
      role: Roles.USER,
      social_auth: true,
    });

    return newUser;
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ "personal_info.email": email });
    return user;
  }

  async findUserById(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async findUserByIdWithoutPassword(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select("-personal_info.password -blogs -google_auth  -__v -updatedAt")
      .exec();
    return user;
  }

  async generateUserName(email: string) {
    let username = email.split("@")[0];

    const user = await this.userModel.findOne({
      "personal_info.username": username,
    });

    if (!user) {
      return username;
    }

    username = username + "-" + uuidv4().slice(0, 6);

    return username;
  }

  generateRandomPassword() {
    return uuidv4();
  }

  async generateHashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

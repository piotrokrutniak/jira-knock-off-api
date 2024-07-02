import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument, User } from "./user.schema";
import CreateUserDto from "./dto/createUser.dto";
import ProjectService from "../projects/project.service";
import { InjectConnection } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

@Injectable()
class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly postsService: ProjectService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).populate({
      path: "posts",
      populate: {
        path: "categories",
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id).populate({
      path: "posts",
      populate: {
        path: "categories",
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(userData: CreateUserDto) {
    const createdUser = new this.userModel(userData);
    await createdUser
      .populate({
        path: "posts",
        populate: {
          path: "categories",
        },
      })
      .execPopulate();
    return createdUser.save();
  }

  async delete(userId: string) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const user = await this.userModel
        .findByIdAndDelete(userId)
        .populate("posts")
        .session(session);

      if (!user) {
        throw new NotFoundException();
      }
      const projects = user.projects;

      await this.postsService.deleteMany(
        projects.map((post) => post._id.toString()),
        session,
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default UsersService;

import { FilterQuery, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Task, TaskDocument } from "./tasks.schema";
import { NotFoundException } from "@nestjs/common";
import PostDto from "./dto/task.dto";
import { User } from "../users/user.schema";
import * as mongoose from "mongoose";
import UpdateTaskDto from "./dto/updateTask.dto";

@Injectable()
class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(
    documentsToSkip = 0,
    limitOfDocuments?: number,
    startId?: string,
    searchQuery?: string,
  ) {
    const filters: FilterQuery<TaskDocument> = startId
      ? {
          _id: {
            $gt: startId,
          },
        }
      : {};

    if (searchQuery) {
      filters.$text = {
        $search: searchQuery,
      };
    }

    const findQuery = this.taskModel
      .find(filters)
      .sort({ _id: 1 })
      .skip(documentsToSkip)
      .populate("author")
      .populate("categories")
      .populate("series");

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }

    const results = await findQuery;
    const count = await this.taskModel.count();

    return { results, count };
  }

  async findOne(id: string) {
    const post = await this.taskModel
      .findById(id)
      .populate("author")
      .populate("categories")
      .populate("series");
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async create(postData: PostDto, author: User) {
    const createdPost = new this.taskModel({
      ...postData,
      author,
    });
    await createdPost.populate("categories").populate("series").execPopulate();
    return createdPost.save();
  }

  async update(id: string, taskData: UpdateTaskDto) {
    const post = await this.taskModel
      .findOneAndReplace({ _id: id }, taskData, { new: true })
      .populate("project")
      .populate("user")
      .populate("story");
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async delete(postId: string) {
    const result = await this.taskModel.findByIdAndDelete(postId);
    if (!result) {
      throw new NotFoundException();
    }
  }

  async deleteMany(
    ids: string[],
    session: mongoose.ClientSession | null = null,
  ) {
    return this.taskModel.deleteMany({ _id: ids }).session(session);
  }
}

export default TasksService;

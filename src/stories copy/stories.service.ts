import { FilterQuery, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Story, StoryDocument } from "./stories.schema";
import { NotFoundException } from "@nestjs/common";
import PostDto from "./dto/story.dto";
import { User } from "../users/user.schema";
import * as mongoose from "mongoose";
import UpdatePostDto from "./dto/updateStory.dto";

@Injectable()
class PostsService {
  constructor(
    @InjectModel(Story.name) private postModel: Model<StoryDocument>,
  ) {}

  async findAll(
    documentsToSkip = 0,
    limitOfDocuments?: number,
    startId?: string,
    searchQuery?: string,
  ) {
    const filters: FilterQuery<StoryDocument> = startId
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

    const findQuery = this.postModel
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
    const count = await this.postModel.count();

    return { results, count };
  }

  async findOne(id: string) {
    const post = await this.postModel
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
    const createdPost = new this.postModel({
      ...postData,
      author,
    });
    await createdPost.populate("categories").populate("series").execPopulate();
    return createdPost.save();
  }

  async update(id: string, postData: UpdatePostDto) {
    const post = await this.postModel
      .findOneAndReplace({ _id: id }, postData, { new: true })
      .populate("author")
      .populate("categories")
      .populate("series");
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async delete(postId: string) {
    const result = await this.postModel.findByIdAndDelete(postId);
    if (!result) {
      throw new NotFoundException();
    }
  }

  async deleteMany(
    ids: string[],
    session: mongoose.ClientSession | null = null,
  ) {
    return this.postModel.deleteMany({ _id: ids }).session(session);
  }
}

export default PostsService;

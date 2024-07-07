import { FilterQuery, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Story, StoryDocument } from "./stories.schema";
import { NotFoundException } from "@nestjs/common";
import PostDto from "./dto/story.dto";
import { User, UserDocument } from "../users/user.schema";
import * as mongoose from "mongoose";
import { UpdateStoryDto } from "./dto/updateStory.dto";
import { Project, ProjectDocument } from "src/projects/project.schema";
import { BadRequestException } from "@nestjs/common";

@Injectable()
class StoriesService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
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

    const findQuery = this.storyModel
      .find(filters)
      .sort({ _id: 1 })
      .skip(documentsToSkip)
      .populate("project")
      .populate("owner");

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }

    const results = await findQuery;
    const count = await this.storyModel.count();

    return { results, count };
  }

  async findOne(id: string) {
    const story = await this.storyModel
      .findById(id)
      .populate("project")
      .populate("owner");

    if (!story) {
      throw new NotFoundException();
    }
    return story;
  }

  async create(postData: PostDto, user: User) {
    const project = await this.projectModel.findById(postData.project);
    const owner = await this.userModel.findById(postData.ownerId);
    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (
      !owner?.roles.filter((role) => role === "developer" || role === "devops")
    ) {
      throw new BadRequestException(
        "Only developers and devops can be assigned to stories stories",
      );
    }

    const createdPost = new this.storyModel({
      ...postData,
      owner,
      project,
    });
    await createdPost.populate("project").populate("owner").execPopulate();
    return createdPost.save();
  }

  async update(id: string, storyData: UpdateStoryDto) {
    const owner = await this.userModel.findById(storyData.owner);
    if (!owner) {
      throw new NotFoundException("Owner not found");
    }

    if (
      !owner?.roles.filter((role) => role === "developer" || role === "devops")
    ) {
      throw new BadRequestException(
        "Only developers and devops can be assigned to stories stories",
      );
    }

    const post = await this.storyModel
      .findOneAndReplace({ _id: id }, storyData, { new: true })
      .populate("projects");
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async delete(postId: string) {
    const result = await this.storyModel.findByIdAndDelete(postId);
    if (!result) {
      throw new NotFoundException();
    }
  }

  async deleteMany(
    ids: string[],
    session: mongoose.ClientSession | null = null,
  ) {
    return this.storyModel.deleteMany({ _id: ids }).session(session);
  }
}

export default StoriesService;

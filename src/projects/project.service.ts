import { FilterQuery, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Project, ProjectDocument as ProjectDocument } from "./project.schema";
import { NotFoundException } from "@nestjs/common";
import ProjectDto from "./dto/project.dto";
import { User } from "../users/user.schema";
import * as mongoose from "mongoose";
import UpdateProjectDto from "./dto/updateProject.dto";
import { Story, StoryDocument } from "src/stories/stories.schema";

@Injectable()
class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
  ) {}

  async findAll(
    documentsToSkip = 0,
    limitOfDocuments?: number,
    startId?: string,
    searchQuery?: string,
  ) {
    const filters: FilterQuery<ProjectDocument> = startId
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

    const findQuery = this.projectModel
      .find(filters)
      .sort({ _id: 1 })
      .skip(documentsToSkip)
      .populate("owner");

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }

    const results = await findQuery;
    const count = await this.projectModel.count();

    return { results, count };
  }

  async findOne(id: string) {
    const post = await this.projectModel.findById(id).populate("owner");
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async create(postData: ProjectDto, author: User) {
    const createdPost = new this.projectModel({
      ...postData,
      author,
    });
    await createdPost.execPopulate();
    return createdPost.save();
  }

  async update(id: string, postData: UpdateProjectDto) {
    const post = await this.projectModel
      .findOneAndReplace({ _id: id }, postData, { new: true })
      .populate("owner");
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async delete(postId: string) {
    const result = await this.projectModel.findByIdAndDelete(postId);
    if (!result) {
      throw new NotFoundException();
    }
  }

  async deleteMany(
    ids: string[],
    session: mongoose.ClientSession | null = null,
  ) {
    return this.projectModel.deleteMany({ _id: ids }).session(session);
  }

  async findProjectStories(projectId: string) {
    return this.storyModel
      .find({ project: projectId })
      .populate("project")
      .populate("owner");
  }
}

export default ProjectService;

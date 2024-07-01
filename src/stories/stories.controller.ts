import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import StoriesService from "./stories.service";
import ParamsWithId from "../utils/paramsWithId";
import PostDto from "./dto/story.dto";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import MongooseClassSerializerInterceptor from "../utils/mongooseClassSerializer.interceptor";
import { Story } from "./stories.schema";
import { PaginationParams } from "../utils/paginationParams";
import UpdatePostDto from "./dto/updateStory.dto";

@Controller("stories")
@UseInterceptors(MongooseClassSerializerInterceptor(Story))
export default class PostsController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async getAllPosts(
    @Query() { skip, limit, startId }: PaginationParams,
    @Query("searchQuery") searchQuery: string,
  ) {
    return this.storiesService.findAll(skip, limit, startId, searchQuery);
  }

  @Get(":id")
  async getPost(@Param() { id }: ParamsWithId) {
    return this.storiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: PostDto, @Req() req: RequestWithUser) {
    return this.storiesService.create(post, req.user);
  }

  @Delete(":id")
  async deletePost(@Param() { id }: ParamsWithId) {
    return this.storiesService.delete(id);
  }

  @Put(":id")
  async updatePost(@Param() { id }: ParamsWithId, @Body() post: UpdatePostDto) {
    return this.storiesService.update(id, post);
  }
}

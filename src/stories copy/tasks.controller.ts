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
import ParamsWithId from "../utils/paramsWithId";
import TaskDto from "./dto/task.dto";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import MongooseClassSerializerInterceptor from "../utils/mongooseClassSerializer.interceptor";
import { Task as TaskModel } from "./tasks.schema";
import { PaginationParams } from "../utils/paginationParams";
import UpdateTaskDto from "./dto/updateTask.dto";
import TasksService from "./tasks.service";

@Controller("tasks")
@UseInterceptors(MongooseClassSerializerInterceptor(TaskModel))
export default class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllPosts(
    @Query() { skip, limit, startId }: PaginationParams,
    @Query("searchQuery") searchQuery: string,
  ) {
    return this.tasksService.findAll(skip, limit, startId, searchQuery);
  }

  @Get(":id")
  async getPost(@Param() { id }: ParamsWithId) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: TaskDto, @Req() req: RequestWithUser) {
    return this.tasksService.create(post, req.user);
  }

  @Delete(":id")
  async deletePost(@Param() { id }: ParamsWithId) {
    return this.tasksService.delete(id);
  }

  @Put(":id")
  async updatePost(@Param() { id }: ParamsWithId, @Body() post: UpdateTaskDto) {
    return this.tasksService.update(id, post);
  }
}

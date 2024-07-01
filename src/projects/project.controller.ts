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
import ProjectService from "./project.service";
import ParamsWithId from "../utils/paramsWithId";
import ProjectDto from "./dto/project.dto";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import MongooseClassSerializerInterceptor from "../utils/mongooseClassSerializer.interceptor";
import { Project } from "./project.schema";
import { PaginationParams } from "../utils/paginationParams";
import UpdateProjectDto from "./dto/updateProject.dto";

@Controller("projects")
@UseInterceptors(MongooseClassSerializerInterceptor(Project))
export default class ProjectsController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAllProjects(
    @Query() { skip, limit, startId }: PaginationParams,
    @Query("searchQuery") searchQuery: string,
  ) {
    return this.projectService.findAll(skip, limit, startId, searchQuery);
  }

  @Get(":id")
  async getProject(@Param() { id }: ParamsWithId) {
    return this.projectService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProject(@Body() post: ProjectDto, @Req() req: RequestWithUser) {
    return this.projectService.create(post, req.user);
  }

  @Delete(":id")
  async deleteProject(@Param() { id }: ParamsWithId) {
    return this.projectService.delete(id);
  }

  @Put(":id")
  async updateProject(
    @Param() { id }: ParamsWithId,
    @Body() post: UpdateProjectDto,
  ) {
    return this.projectService.update(id, post);
  }
}

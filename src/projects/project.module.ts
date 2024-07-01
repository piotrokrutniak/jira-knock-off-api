import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import ProjectsController from "./project.controller";
import ProjectService from "./project.service";
import { Project, ProjectSchema } from "./project.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectService],
  exports: [ProjectService],
})
class PostsModule {}

export default PostsModule;

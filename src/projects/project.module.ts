import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import ProjectsController from "./project.controller";
import ProjectService from "./project.service";
import { Project, ProjectSchema } from "./project.schema";
import { Story, StorySchema } from "src/stories/stories.schema";
import StoriesService from "src/stories/stories.service";
import { User, UserSchema } from "src/users/user.schema";
import UsersService from "src/users/users.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectService, UsersService, StoriesService],
  exports: [ProjectService],
})
class ProjectsModule {}

export default ProjectsModule;

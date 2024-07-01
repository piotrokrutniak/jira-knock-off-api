import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import PostsController from "./stories.controller";
import StoriesService from "./stories.service";
import { Story, StorySchema } from "./stories.schema";
import ProjectService from "src/projects/project.service";
import UsersService from "src/users/users.service";
import { User, UserSchema } from "src/users/user.schema";
import { Project, ProjectSchema } from "src/projects/project.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [PostsController],
  providers: [StoriesService, ProjectService, UsersService],
  exports: [StoriesService],
})
class StoriesModule {}

export default StoriesModule;

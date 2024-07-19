import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Project, ProjectSchema } from "src/projects/project.schema";
import ProjectService from "src/projects/project.service";
import { Story, StorySchema } from "src/stories/stories.schema";
import StoriesService from "src/stories/stories.service";
import { User, UserSchema } from "src/users/user.schema";
import UsersService from "src/users/users.service";
import TasksController from "./tasks.controller";
import { Task, TaskSchema } from "./tasks.schema";
import TasksService from "./tasks.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [TasksController],
  providers: [TasksService, ProjectService, UsersService, StoriesService],
  exports: [TasksService],
})
export class TasksModule {}

export default TasksModule;

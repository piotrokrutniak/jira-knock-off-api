import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsDateString } from "class-validator";
import { Date } from "mongoose";
import { Project } from "src/projects/project.schema";
import { Story } from "src/stories/stories.schema";
import { User } from "src/users/user.schema";

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Type(() => Story)
  story: Story;

  @IsNotEmpty()
  @Type(() => Project)
  project: Project;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsNotEmpty()
  @Type(() => User)
  owner: User;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  startedAt?: Date;

  @IsDateString()
  completedAt?: Date;

  @IsDateString()
  doneByEstimate?: Date;
}

export default TaskDto;

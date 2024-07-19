import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from "class-validator";
import { User } from "../../users/user.schema";
import { Exclude, Type } from "class-transformer";
import { Project } from "src/projects/project.schema";
import { Story } from "src/stories/stories.schema";
import { Date } from "mongoose";

export class UpdateTaskDto {
  @IsOptional()
  @Exclude()
  _id: string;

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

  @IsNotEmpty()
  @Type(() => User)
  owner: User;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDateString()
  startedAt?: string;

  @IsDateString()
  completedAt?: string;

  @IsDateString()
  doneByEstimate?: string;
}

export default UpdateTaskDto;

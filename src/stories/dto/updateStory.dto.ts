import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { Exclude } from "class-transformer";
import { Project } from "src/projects/project.schema";

export class UpdateStoryDto {
  @IsOptional()
  @Exclude()
  _id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsString()
  priority: string;

  @IsNotEmpty()
  project: Project;

  @IsString()
  owner: string;
}

export default UpdateStoryDto;

import { IsString, IsNotEmpty } from "class-validator";
import { Project } from "src/projects/project.schema";

export class StoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  status: string;

  @IsString()
  priority: string;

  @IsNotEmpty()
  project: Project;

  @IsString()
  ownerId: string;
}

export default StoryDto;

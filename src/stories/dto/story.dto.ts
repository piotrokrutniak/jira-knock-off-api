import { IsString, IsNotEmpty } from "class-validator";
import { Project } from "src/projects/project.schema";

export class StoryDto {
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

export default StoryDto;

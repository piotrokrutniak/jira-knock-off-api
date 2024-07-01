import { IsString, IsNotEmpty } from "class-validator";

export class ProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export default ProjectDto;

import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { User } from "../../users/user.schema";
import { Exclude, Type } from "class-transformer";

export class UpdateProjectDto {
  @IsOptional()
  @Exclude()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => User)
  @IsNotEmpty()
  owner: User;
}

export default UpdateProjectDto;

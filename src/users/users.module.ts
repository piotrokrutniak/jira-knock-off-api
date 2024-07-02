import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema, User } from "./user.schema";
import ProjectsModule from "../projects/project.module";
import UsersService from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ProjectsModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

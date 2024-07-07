import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import JwtAuthenticationGuard from "src/authentication/jwt-authentication.guard";
import MongooseClassSerializerInterceptor from "src/utils/mongooseClassSerializer.interceptor";
import { User } from "./user.schema";
import UsersService from "./users.service";

@Controller("users")
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getUsers() {
    return this.usersService.findAll();
  }
}

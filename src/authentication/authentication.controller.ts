import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import RegisterDto from "./dto/register.dto";
import RequestWithUser from "./requestWithUser.interface";
import { LocalAuthenticationGuard } from "./localAuthentication.guard";
import JwtAuthenticationGuard from "./jwt-authentication.guard";
import { User } from "../users/user.schema";
import MongooseClassSerializerInterceptor from "../utils/mongooseClassSerializer.interceptor";

@Controller("authentication")
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("register")
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post("log-in")
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessToken = this.authenticationService.getCookieWithJwtToken(
      user._id,
    );
    const refreshToken = this.authenticationService.generateRefreshToken(
      user._id,
    );
    request.res?.setHeader("Set-Cookie", [accessToken, refreshToken]);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post("log-out")
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    console.log("request.res", request.res);
    request.res?.setHeader(
      "Set-Cookie",
      this.authenticationService.getCookieForLogOut(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post("refresh")
  async refreshToken(@Req() request: RequestWithUser) {
    const refreshToken = request.cookies["refreshToken"];
    const isValid =
      this.authenticationService.validateRefreshToken(refreshToken);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    // Assuming validateRefreshToken returns the user ID or some identifier
    const accessToken = this.authenticationService.getCookieWithJwtToken(
      isValid.userId,
    );
    request.res?.setHeader("Set-Cookie", accessToken);
    return { accessToken };
  }
}

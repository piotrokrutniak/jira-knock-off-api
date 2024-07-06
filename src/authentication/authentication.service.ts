import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import RegisterDto from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import TokenPayload from "./tokenPayload.interface";
import MongoError from "../utils/mongoError.enum";
import UsersService from "../users/users.service";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    try {
      return await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
    } catch (error) {
      Logger.error(error);
      if (error?.code === MongoError.DuplicateKey) {
        throw new HttpException(
          "User with that email already exists",
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        "Something went wrong",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    const cookieOptions = {
      HttpOnly: true,
      Path: "/",
      "Max-Age": this.configService.get("JWT_EXPIRATION_TIME"),
      Secure: true,
      SameSite: "Strict",
    };
    return this.createCookieString("Authentication", token, cookieOptions);
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  generateRefreshToken(userId: string) {
    const payload: TokenPayload = { userId: userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: `${this.configService.get("JWT_REFRESH_EXPIRATION_TIME")}s`,
    });

    const cookieOptions = {
      HttpOnly: true,
      path: "/",
      "Max-Age": this.configService.get("JWT_REFRESH_EXPIRATION_TIME"),
      Secure: true,
      SameSite: "Strict",
    };

    // TODO: Save to db to validate or revoke later
    return this.createCookieString("Refresh", refreshToken, cookieOptions);
  }

  validateRefreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });
      return payload;
    } catch (error) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
  }

  private createCookieString(
    name: string,
    value: string,
    options: Record<string, any>,
  ): string {
    const optionsString = Object.entries(options)
      .map(([key, val]) => {
        if (val === true) {
          return key;
        }
        return `${key}=${val}`;
      })
      .join("; ");
    return `${name}=${value}; ${optionsString}`;
  }
}

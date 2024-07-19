import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import ProjectsModule from "./projects/project.module";
import * as Joi from "@hapi/joi";
import { AuthenticationModule } from "./authentication/authentication.module";
import CategoriesModule from "./categories/categories.module";
import StoriesModule from "./stories/stories.module";
import { UsersModule } from "./users/users.module";
import TasksModule from "./stories copy/tasks.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // MONGO_USERNAME: Joi.string().required(),
        // MONGO_PASSWORD: Joi.string().required(),
        // MONGO_DATABASE: Joi.string().required(),
        // MONGO_HOST: Joi.string().required(),
        MONGO_CONNECTION_STRING: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // const username = configService.get('MONGO_USERNAME');
        // const password = configService.get('MONGO_PASSWORD');
        // const host = configService.get('MONGO_HOST');
        const database = configService.get("MONGO_DATABASE");
        const connectionString = configService.get("MONGO_CONNECTION_STRING");

        return {
          // uri: `mongodb://${username}:${password}@${host}`,
          uri: connectionString,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    ProjectsModule,
    AuthenticationModule,
    StoriesModule,
    CategoriesModule,
    UsersModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

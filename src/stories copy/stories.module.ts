import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import PostsController from "./stories.controller";
import PostsService from "./stories.service";
import { Post, PostSchema } from "./stories.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
class PostsModule {}

export default PostsModule;

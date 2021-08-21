import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
import { NotFoundException } from '@nestjs/common';
import PostDto from './dto/post.dto';
import { User } from '../users/user.schema';

@Injectable()
class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAll() {
    return this.postModel.find().populate('author').populate('categories');
  }

  async findOne(id: string) {
    const post = await this.postModel
      .findById(id)
      .populate('author')
      .populate('categories');
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async create(postData: PostDto, author: User) {
    const createdPost = new this.postModel({
      ...postData,
      author,
    });
    await createdPost.populate('categories').execPopulate();
    return createdPost.save();
  }

  async update(id: string, postData: PostDto) {
    const post = await this.postModel
      .findByIdAndUpdate(id, postData)
      .setOptions({ overwrite: true, new: true })
      .populate('author')
      .populate('categories');
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async delete(postId: string) {
    const result = await this.postModel.findByIdAndDelete(postId);
    if (!result) {
      throw new NotFoundException();
    }
  }
}

export default PostsService;

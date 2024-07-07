import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { User } from "../users/user.schema";
import { Transform, Type } from "class-transformer";
import { Category } from "../categories/category.schema";
import { Series } from "../series/series.schema";

export type StoryDocument = Story & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Story {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  title: string;

  @Prop({
    set: (content: string) => {
      return content.trim();
    },
  })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  author: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }],
  })
  @Type(() => Category)
  categories: Category[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Series.name,
  })
  @Type(() => Series)
  series?: Series;
}

const StorySchema = SchemaFactory.createForClass(Story);

StorySchema.index({ title: "text", content: "text" });

export { StorySchema };

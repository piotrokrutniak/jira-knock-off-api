import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { Transform } from "class-transformer";
import { Project } from "src/projects/project.schema";
import { User } from "src/users/user.schema";
import { Optional } from "@nestjs/common";

export type StoryDocument = Story & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Story {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  title: string;

  @Prop({
    required: false,
    set: (description: string) => {
      return description.trim();
    },
  })
  description?: string;

  @Prop({ required: true, enum: ["open", "in_progress", "closed"] }) // Example enum, adjust as needed
  status: string;

  @Prop({ required: true, enum: ["low", "medium", "high"] }) // Example enum, adjust as needed
  priority: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Project" })
  project: Project | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  owner: User | string;
}

const StorySchema = SchemaFactory.createForClass(Story);

StorySchema.index({ title: "text", description: "text" });

export { StorySchema };

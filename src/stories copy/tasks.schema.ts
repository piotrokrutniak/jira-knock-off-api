import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { User } from "../users/user.schema";
import { Transform } from "class-transformer";
import { Project } from "src/projects/project.schema";
import { Story } from "src/stories/stories.schema";

export type TaskDocument = Task & Document;

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
export class Task {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  title: string;

  @Prop({
    set: (content: string) => {
      return content.trim();
    },
  })
  description: string;

  @Prop({ required: true, enum: ["todo", "in-progress", "done"] }) // Example enum, adjust as needed
  status: string;

  @Prop({ required: true, enum: ["low", "medium", "high"] }) // Example enum, adjust as needed
  priority: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Project" })
  project: Project | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  owner: User | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Story" })
  story: Story | string;

  @Prop()
  startedAt?: string;

  @Prop()
  completedAt?: string;

  @Prop()
  doneByEstimate?: string;
}

const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ title: "text", content: "text" });

export { TaskSchema };

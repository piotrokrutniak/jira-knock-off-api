import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { User } from "../users/user.schema";
import { Transform, Type } from "class-transformer";

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop({
    set: (content: string) => {
      return content.trim();
    },
  })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  owner: User;
}

const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ name: "text", description: "text" });

export { ProjectSchema };

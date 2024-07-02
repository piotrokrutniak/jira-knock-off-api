import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { User } from "../users/user.schema";
import { Exclude, Type } from "class-transformer";

export type ProjectDocument = Project & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Project {
  @Exclude()
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

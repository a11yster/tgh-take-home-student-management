import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export type TaskDocument = HydratedDocument<TaskEntity>;

@Schema({ timestamps: true, collection: 'tasks' })
export class TaskEntity {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: null })
  description: string | null;

  @Prop({ required: true })
  dueAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(TaskStatus), default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({ default: null })
  completedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
  assignedBy: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(TaskEntity);

import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  content: string;
  userId: Schema.Types.ObjectId;
}

const noteSchema = new Schema<INote>({
  content: {
    type: String,
    required: [true, 'Note content cannot be empty'],
  },
  // Links note to user
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

const Note = model<INote>('Note', noteSchema);
export default Note;
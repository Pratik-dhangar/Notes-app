import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  content: string;
  userId: Schema.Types.ObjectId; // Reference to the User who created it
}

const noteSchema = new Schema<INote>({
  content: {
    type: String,
    required: [true, 'Note content cannot be empty'],
  },
  // This creates a relationship between the Note and User models.
  // Each note will belong to a single user.
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This 'ref' tells Mongoose which model to use during population
    required: true,
  },
}, {
  timestamps: true
});

const Note = model<INote>('Note', noteSchema);
export default Note;
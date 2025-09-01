import { Request, Response } from 'express';
import Note from '../models/noteModel';

// @desc    Create a new note
// @route   POST /api/notes
export const createNote = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Note content cannot be empty' });
    }

    const note = await Note.create({
      content,
      userId: (req.user as any).id, // Use req.user.id directly
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all notes for a user
// @route   GET /api/notes
export const getNotes = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const notes = await Note.find({ userId: (req.user as any).id }).sort({ createdAt: -1 }); // Use req.user.id
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== (req.user as any).id) { // Use req.user.id
      return res.status(401).json({ message: 'User not authorized' });
    }

    await note.deleteOne();

    res.status(200).json({ message: 'Note removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
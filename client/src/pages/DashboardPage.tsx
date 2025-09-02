import { useState, useEffect, type FormEvent } from 'react';
import api from '../services/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

const DashboardPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get('/notes');
        setNotes(data);
      } catch (error) {
        toast.error("Failed to fetch notes.");
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    try {
      const { data: newNote } = await api.post('/notes', { content: newNoteContent });
      setNotes([newNote, ...notes]);
      setNewNoteContent('');
      toast.success("Note added successfully!");
    } catch (error) {
      toast.error("Failed to add note.");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter(note => note._id !== noteId));
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete note.");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-text-primary">Welcome back!</h2>
          <button onClick={handleLogout} className="text-sm font-medium text-text-secondary hover:text-primary-blue">Logout</button>
        </header>

        <form onSubmit={handleAddNote} className="mb-8">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Add a new note..."
            className="w-full border border-border-default rounded-lg p-3 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
            rows={3}
          ></textarea>
          <button type="submit" className="w-full mt-2 bg-primary-blue text-white font-medium py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue">
            Add Note
          </button>
        </form>

        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map(note => (
              <div key={note._id} className="bg-white border border-border-default rounded-lg p-4 flex justify-between items-start">
                <p className="text-text-primary pr-4 break-words">{note.content}</p>
                <button onClick={() => handleDeleteNote(note._id)} className="text-red-500 hover:text-red-700 font-semibold text-sm flex-shrink-0">
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
                <p className="text-text-secondary">You have no notes yet. Add one above to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
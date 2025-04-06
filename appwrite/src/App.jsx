import React, { useState, useEffect } from 'react';
import { database, ID } from '/src/assets/lib/appwrite.js'; // Ensure this is the correct path

const App = () => {
  const [newNote, setNewNote] = useState(''); // State for new note input
  const [notes, setNotes] = useState([]); // State for storing notes

  // Fetch notes from Appwrite database on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes from the Appwrite database
  async function fetchNotes() {
    try {
      const response = await database.listDocuments('NotesDB', 'Notes'); // Fetch documents from Notes collection
      setNotes(response.documents); // Set the fetched notes to state
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  // Save a new note to the database
  async function saveNote() {
    if (newNote.trim() === '') 
      return;

    try {

      await database.createDocument('NotesDB', 'Notes', ID.unique(), {
        content: newNote,
      });

      setNewNote('');
      fetchNotes(); 
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }

  // Delete a note from the database
  async function deleteNote(noteId) {
    try {
      await database.deleteDocument('NotesDB', 'Notes', noteId); // Delete the note by its ID
      fetchNotes(); // Re-fetch the notes after deletion
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 drop-shadow-sm">
        My Notes
      </h1>
  
      {/* Notes Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-32">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.$id}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border-l-4 border-indigo-400 relative"
            >
              <p className="text-gray-800 whitespace-pre-line">{note.content}</p>
              <button
                onClick={() => deleteNote(note.$id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition"
              >
                {/* Trash Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No notes yet. Add your first note!</p>
        )}
      </div>
  
      {/* Note Input */}
      <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
        <div className="bg-white p-4 rounded-2xl shadow-2xl max-w-xl mx-auto flex flex-col items-center">
          <textarea
            placeholder="Write something inspiring..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 text-sm"
            rows={3}
          />
          <button
            onClick={saveNote}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-xl hover:bg-indigo-700 transition duration-200"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default App;

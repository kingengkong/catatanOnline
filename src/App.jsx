import { useState, useTransition } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useFetch } from "./hooks/useFetch";
import "./App.css";

export default function App() {
  const [notes, setNotes] = useLocalStorage("notes", []); // simpan ke localStorage
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [isPending, startTransition] = useTransition();

  // contoh API dummy (pakai jsonplaceholder atau server lokal)
  const { postData } = useFetch("https://jsonplaceholder.typicode.com/posts");

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const newNote = { title, content };

    startTransition(() => {
      if (editingIndex !== null) {
        // Edit catatan
        const updated = [...notes];
        updated[editingIndex] = newNote;
        setNotes(updated);
        setEditingIndex(null);
      } else {
        // Tambah catatan
        setNotes([...notes, newNote]);
      }

      // Sinkronisasi ke API
      postData(newNote);
    });

    setTitle("");
    setContent("");
  };

  const handleEdit = (index) => {
    setTitle(notes[index].title);
    setContent(notes[index].content);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = notes.filter((_, i) => i !== index);
    setNotes(updated);
  };

  return (
    <div className="container">
      <h1>📝 Online Notes</h1>

      <input
        type="text"
        placeholder="Note Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Note Content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleSave} disabled={isPending}>
        {isPending ? "Saving..." : editingIndex !== null ? "Update" : "Save"}
      </button>

      <ul className="note-list">
        {notes.map((note, index) => (
          <li key={index}>
            <div>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(index)}>✏️ Edit</button>
              <button onClick={() => handleDelete(index)}>🗑 Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

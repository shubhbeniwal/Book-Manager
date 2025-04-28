"use client";

import { useState, useEffect } from "react";
import { Book } from "../types/Book";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const savedBooks = localStorage.getItem("books");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const handleAddOrUpdateBook = () => {
    if (title.trim() === "" || author.trim() === "" || description.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    if (editId) {
      const updatedBooks = books.map(book =>
        book.id === editId ? { ...book, title, author, description } : book
      );
      setBooks(updatedBooks);
      setEditId(null);
    } else {
      const newBook: Book = {
        id: uuidv4(),
        title,
        author,
        description,
      };
      setBooks([...books, newBook]);
    }
    setTitle("");
    setAuthor("");
    setDescription("");
  };

  const handleEdit = (id: string) => {
    const book = books.find(b => b.id === id);
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description);
      setEditId(id);
    }
  };

  return (
    <main>
      <h1>Book Manager</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateBook(); }}>
        <input
          type="text"
          placeholder="Enter book title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter author name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />
        <button type="submit">{editId ? "Update Book" : "Add Book"}</button>
      </form>

      {books.map(book => (
        <div key={book.id} className="book-card" onClick={() => handleEdit(book.id)}>
          <div className="book-title">{book.title}</div>
          <div className="book-author">by {book.author}</div>
          <div className="book-description">{book.description}</div>
        </div>
      ))}
    </main>
  );
}

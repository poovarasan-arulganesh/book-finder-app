import React, { useState, useEffect } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchBooks(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      if (!data.docs || data.docs.length === 0) {
        setError("No results found.");
      } else {
        setResults(data.docs.slice(0, 20)); // show top 20
      }
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Alex's Book Finder</h1>
      <form onSubmit={searchBooks} className="flex gap-2 max-w-xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books by title..."
          className="flex-1 border px-3 py-2 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div className="max-w-3xl mx-auto mt-6">
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <ul className="grid gap-4 mt-4">
          {results.map((book) => (
            <li
              key={book.key}
              className="bg-white p-4 rounded-lg shadow flex gap-4"
            >
              <img
                src={
                  book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "https://placehold.co/100x150?text=No+Cover"
                }
                alt={book.title}
                className="w-24 h-36 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold text-lg">{book.title}</h2>
                <p className="text-sm text-slate-600">
                  {book.author_name ? book.author_name.join(", ") : "Unknown"}
                </p>
                <p className="text-sm text-slate-500">
                  {book.first_publish_year || ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

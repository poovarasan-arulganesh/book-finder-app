import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("q");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://openlibrary.org/search.json?${searchType}=${query}`);
      const data = await res.json();
      if (data.docs.length === 0) {
        setError("No books found.");
      }
      setBooks(data.docs.slice(0, 12));
    } catch (err) {
      setError("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center p-6"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="bg-black/60 w-full max-w-4xl p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">📚 Book Finder</h1>
        
        <form onSubmit={searchBooks} className="flex gap-2 mb-6 flex-wrap">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="q">All</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search books by ${searchType}...`}
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-white text-center">Loading...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600">
                  No Cover
                </div>
              )}
              <h2 className="font-semibold text-lg">{book.title}</h2>
              <p className="text-sm text-gray-700">
                {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
              </p>
              <p className="text-sm text-gray-500">
                {book.first_publish_year || "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

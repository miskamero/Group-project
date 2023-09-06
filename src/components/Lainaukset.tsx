import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  id: number;
  nimi: string;
  kirjoittaja: string;
  kpl: number;
}

const Lainaukset: React.FC = () => {
  const [kirjaID, setKirjaID] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios
      .get<Book[]>('http://localhost:3001/kirjat/  ')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const lainaaKirja = () => {
    // remoe one kpl from the book
    const book = books.find((book) => book.id === Number(kirjaID));
    if (book) {
      const updatedBook = {
        ...book,
        kpl: book.kpl - 1,
      };
      axios
        .put<Book>(`http://localhost:3001/kirjat/${kirjaID}`, updatedBook)
        .then((response) => {
          setBooks(
            books.map((book) =>
              book.id !== Number(kirjaID) ? book : response.data
            )
          );
        });
    }
  };

  return (
    <div>
      <h1>Lainaukset</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.id} {book.nimi} | {book.kirjoittaja} | {book.kpl}
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Kirjan kirjaID"
        value={kirjaID}
        onChange={(e) => setKirjaID(e.target.value)}
      />

      <button onClick={lainaaKirja}>Lainaa kirja</button>
    </div>
  );
};

export default Lainaukset;

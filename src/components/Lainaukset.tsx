import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Lainaukset = () => {
  const [kirjaID, setKirjaID] = useState('');
  const [books, setBooks] = useState([]);
  const apiUrl = 'http://localhost:3001/kirjat';

  useEffect(() => {
    // Fetch all books initially
    axios.get(apiUrl)
      .then((response) => {
        setBooks(response.data.kirjat);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, []);

  const lainaaKirja = () => {
    // Find the book by kirjaID
    const book = books.find((item) => item.kirjaID === kirjaID);

    if (book && book.kpl > 0) {
      // Decrease the number of available copies
      const newBooks = books.map((item) => {
        if (item.kirjaID === kirjaID) {
          return { ...item, kpl: item.kpl - 1 };
        }
        return item;
      });

      // Update the book locally (on the client)
      setBooks(newBooks);

      // You can optionally send the updated book data to the server if needed
      // axios.put(`${apiUrl}/${kirjaID}`, book, {
      //   headers: { 'Content-Type': 'application/json' },
      // })
      // .then(() => {
      //   // Optionally handle success
      // })
      // .catch((error) => {
      //   console.error('Error updating book:', error);
      // });
    } else {
      console.log('Book not found or no more copies available.');
    }
  };

  return (
    <div>
      <h1>Lainaukset</h1>
      <ul>
        {books.map((book) => (
          <li key={book.kirjaID}>
            <h2>{book.nimi}</h2>
            <p>{book.kirjoittaja}</p>
            <p>{book.kpl} kpl</p>
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

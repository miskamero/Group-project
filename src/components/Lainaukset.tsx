import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  id: number;
  nimi: string;
  kirjoittaja: string;
  kpl: number;
}

interface Lainaus {
  id: string;
  tuoteet: string[]; // Assuming tuoteet is an array of strings (book IDs)
}

const Lainaukset: React.FC = () => {
  const [kirjaID, setKirjaID] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [returnBooks, setReturnBooks] = useState<string>('');
  const [users, setUsers] = useState<Lainaus[]>([]);
  const [userName, setUserName] = useState<string>('gr123456');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch books
    axios
      .get<Book[]>('http://localhost:3001/kirjat')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        setError('Error fetching books');
        console.log(error);
      });

    // Fetch users' lending information
    axios
      .get<Lainaus[]>('http://localhost:3002/lainaukset/')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError('Error fetching user lending information');
        console.log(error);
      });
  }, []);

  const lainaaKirja = () => {
    const book = books.find((book) => book.id === Number(kirjaID));
    const user = users.find((user) => user.id === userName);

    // if the id is found in the tuotteet, it will return
    if (user && user.tuoteet.includes(kirjaID)) {
      setError('Kirja on jo lainattu. :(');
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    if (book && book.kpl > 0) {
      // Update the book's availability
      const updatedBook = {
        ...book,
        kpl: book.kpl - 1,
      };

      axios
        .put<Book>(`http://localhost:3001/kirjat/${kirjaID}`, updatedBook)
        .then((response) => {
          setBooks(
            books.map((book) => (book.id !== Number(kirjaID) ? book : response.data))
          );
        })
        .catch((error) => {
          setError('Error updating book availability');
          console.log(error);
        });

      // Add the borrowed book to the user's lending information
      

      if (user) {
        const updatedUser = {
          ...user,
          tuoteet: [...user.tuoteet, kirjaID],
        };

        axios
          .put<Lainaus>(`http://localhost:3002/lainaukset/${userName}`, updatedUser)
          .then((response) => {
            setUsers(
              users.map((user) => (user.id !== userName ? user : response.data))
            );
          })
          .catch((error) => {
            setError('Error updating user lending information');
            console.log(error);
          });
      }
    } else {
      setError('Book not found or not available');
    }
  };

  const ReturnBooks = () => {
    // add the borrowed book to the user's lending information
    const user = users.find((user) => user.id === userName);
    // if the id is not found in tuotteet, it will return
    if (user && !user.tuoteet.includes(returnBooks)) {
      setError('Book not found or not available');
      return;
    }
    

    if (user) {
      const updatedUser = {
        ...user,
        tuoteet: user.tuoteet.filter((book) => !returnBooks.includes(book)),
      };

      axios
        .put<Lainaus>(`http://localhost:3002/lainaukset/${userName}`, updatedUser)
        .then((response) => {
          setUsers(
            users.map((user) => (user.id !== userName ? user : response.data))
          );
        })
        .catch((error) => {
          setError('Error updating user lending information');
          console.log(error);
        });
      }
      else {
        setError('Book not found or not available');
      }

      // Update the book's availability
      // find the book with the id, Returnbooks gives the id of the book that will be returned
      const book = books.find((book) => book.id === Number(returnBooks));

      //if book is found
      if (book) {
        const updatedBook = {
          ...book,
          kpl: book.kpl + 1,
        };

        axios
          .put<Book>(`http://localhost:3001/kirjat/${returnBooks}`, updatedBook)
          .then((response) => {
            setBooks(
              books.map((book) => (book.id !== Number(returnBooks) ? book : response.data))
            );
          })
          .catch((error) => {
            setError('Error updating book availability');
            console.log(error);
          });
      }
  };

  return (
    <div>
      <input type="text"
        placeholder="Käyttäjänimi"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <h1>Käyttäjä: {userName}</h1>
      <h1>Lainaukset</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.id} {book.nimi} | {book.kirjoittaja} | {book.kpl}
          </li>
        ))}
      </ul>

      <h1>Käyttäjän lainaukset:</h1>
      <ul>
        {userName &&
          users
            .filter((user) => user.id === userName)
            .map((user) => (
              <li key={user.id}>
                {user.id} {user.tuoteet.join(', ')}
              </li>
            ))}
      </ul>

      <input
        type="text"
        placeholder="Kirjan kirjan ID"
        value={kirjaID}
        onChange={(e) => setKirjaID(e.target.value)}
      />
      <button onClick={lainaaKirja}>Lainaa kirja</button>
      <br />
      
      <input type="text"
        placeholder="Palautettavan kirjan ID"
        value={returnBooks}
        onChange={(e) => setReturnBooks(e.target.value)}
      />
      <button onClick={ReturnBooks}>Palauta Kirja</button>

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Lainaukset;

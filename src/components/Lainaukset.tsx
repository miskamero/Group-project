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
  tuoteet: [];
}

const Lainaukset: React.FC = () => {
  const [kirjaID, setKirjaID] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<Lainaus[]>([]);
  const userName: string = "gr123456"

  useEffect(() => {
    axios
      .get<Book[]>('http://localhost:3001/kirjat/  ')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get<Lainaus[]>('http://localhost:3002/lainaukset/')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  , []);

  const lainaaKirja = () => {
    const book = books.find((book) => book.id === Number(kirjaID));
    if (book && book.kpl > 0) {
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

          // find userName varibale from lainaukset.json and add kirjaID to tuoteet array
          const user = users.find((user) => user.id === userName);
          if (user) {
            const updatedUser = {
              ...user,
              tuoteet: [...user.tuoteet, kirjaID],
            };
            axios
              .put<Lainaus>(`http://localhost:3002/lainaukset/${userName}`, updatedUser)
              .then((response) => {
                setUsers(
                  users.map((user) =>
                    user.id !== userName ? user : response.data
                  )
                );
              });
          }          
      }
      return;
    } else {
      alert('Kirjaa ei löydy tai kirjaa ei ole varastossa');
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
      <h1>käyttäjä</h1>
      <input
        type="text"
        placeholder="Kirjan kirjaID"
        value={kirjaID}
        onChange={(e) => setKirjaID(e.target.value)}/>
      <button onClick={lainaaKirja}>Lainaa kirja</button>
    </div>
  );
};

export default Lainaukset;
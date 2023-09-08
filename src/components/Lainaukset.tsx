import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";

// Define TypeScript interfaces to describe data structures
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

// Define a functional component called GetUserName
const GetUserName: React.FC = () => {
  // Retrieve the username from secure local storage
  const username: string | null = secureLocalStorage.getItem('username') as string;

  return (
    <div>
      {username}
    </div>
  );
}

// Define the main functional component Lainaukset
const Lainaukset: React.FC = () => {
  // Define and initialize state variables using the useState hook
  const [kirjaID, setKirjaID] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [returnBooks, setReturnBooks] = useState<string>('');
  const [users, setUsers] = useState<Lainaus[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Function to save the username to secure local storage and set it in state
  const saveUsernameToLocalStorage = (username: string) => {
      secureLocalStorage.setItem("username", username);
      setUserName(username);
  };

  // useEffect hook to perform side effects when the component mounts
  useEffect(() => {
    // Fetch the username from local storage when the component mounts
    const storedUsername: string | null = secureLocalStorage.getItem('username') as string;
    if (storedUsername) {
      setUserName(storedUsername);
    }

    // Fetch books from an API endpoint
    axios
      .get<Book[]>('http://localhost:3001/kirjat')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        setError('Error fetching books');
        console.log(error);
      });

    // Fetch users' lending information from an API endpoint
    axios
      .get<Lainaus[]>('http://localhost:3002/lainaukset/')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError('Error fetching user lending information');
        console.log(error);
      });
  }, []); // The empty dependency array ensures this effect runs once when the component mounts

  // Function to handle borrowing a book
  const lainaaKirja = () => {
    const usernamePattern = /^gr\d{6}$/;
    if (!usernamePattern.test(userName)) {
      setError('Invalid username format. It should start with "gr" followed by 6 numbers.');
      return;
    }
    // Find the selected book by its ID
    const book = books.find((book) => book.id === Number(kirjaID));
    // Find the user by their username
    const user = users.find((user) => user.id === userName);

    // Check if the book is already borrowed by the user
    if (user && user.tuoteet.includes(kirjaID)) {
      setError('Kirja on jo lainattu. :(');
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    // Check if the book is found and available
    if (book && book.kpl > 0) {
      // Update the book's availability
      const updatedBook = {
        ...book,
        kpl: book.kpl - 1,
      };

      // Make an API request to update the book's information
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

        // Make an API request to update the user's lending information
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

  // Function to handle returning a borrowed book
  const ReturnBooks = () => {
    const usernamePattern = /^gr\d{6}$/;
    if (!usernamePattern.test(userName)) {
      setError('Invalid username format. It should start with "gr" followed by 6 numbers.');
      return;
    }
    // Find the user by their username
    const user = users.find((user) => user.id === userName);

    // Check if the book is not found or not borrowed by the user
    if (user && !user.tuoteet.includes(returnBooks)) {
      setError('Book not found or not available');
      return;
    }

    // Update the user's lending information by removing the returned book
    if (user) {
      const updatedUser = {
        ...user,
        tuoteet: user.tuoteet.filter((book) => !returnBooks.includes(book)),
      };

      // Make an API request to update the user's lending information
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
    } else {
      setError('Book not found or not available');
    }

    // Update the book's availability by incrementing its count
    const book = books.find((book) => book.id === Number(returnBooks));

    // Check if the book is found
    if (book) {
      const updatedBook = {
        ...book,
        kpl: book.kpl + 1,
      };

      // Make an API request to update the book's availability
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

  // Render the component's UI
  return (
    <div>
      <input type="text"
        placeholder="Käyttäjänimi"
        value={userName}
        onChange={(e) => saveUsernameToLocalStorage(e.target.value)}
      />
      <br />
      <h1>Käyttäjä: <GetUserName /></h1>
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
      <div className="search-box">
        <button className="btn-search"><i className="fa fa-search" style={{color: "ffffff"}}>Text</i></button>
        <input type="text" className="input-search" placeholder="Kirjoita hakusana..."/>
      </div>
    </div>
  );
};

export default Lainaukset;

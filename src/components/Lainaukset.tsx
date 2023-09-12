import secureLocalStorage from "react-secure-storage";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useParams } from "react-router-dom"
// testikommentti

// Define TypeScript interfaces to describe data structures
interface Book {
  id: number;
  nimi: string;
  kirjoittaja: string;
  kpl: number;
}

interface Lainaus {
  id: string;
  tuoteet: string[];
}

// props from the router for the url parameter
interface LainauksetProps {
  bookId: string | undefined;
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

// Function that gets the book's name and writer by its ID
const GetBookInfo: React.FC<{id: number}> = ({id}) => {
  // Define and initialize state variables using the useState hook
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string>('');  // Error handling works as follows:

  // useEffect hook to perform side effects when the component mounts
  useEffect(() => {
    // Fetch the book's information from an API endpoint
    axios
      .get<Book>(`http://localhost:3001/kirjat/${id}`)
      .then((response) => {
        setBook(response.data);
      })
      .catch((error) => {
        setError('Error fetching book information, please try refreshing the page, if the problem persists, contact the administrator');
        console.log(error);
      });
  }, [id]); // The dependency array ensures this effect runs when the component mounts and when the ID changes

  // Render the component's UI
  return (
    <div>
      {book ? `${book.nimi} ${book.kirjoittaja}` : error}
    </div>
  );
}

// Define the main functional component Lainaukset
const Lainaukset: React.FC<LainauksetProps> = ({ bookId }) => {
  const [kirjaID, setKirjaID] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [returnBooks, setReturnBooks] = useState<string>('');
  const [users, setUsers] = useState<Lainaus[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  // Function to save the username to secure local storage and set it in state
  const saveUsernameToLocalStorage = (username: string) => {
      secureLocalStorage.setItem("username", username);
      setUserName(username);
  };

  const displayError = (message: string) => {
    setError(message);
    document.getElementById('error-message')!.style.opacity = '1';
    setTimeout(() => {
      document.getElementById('error-message')!.style.opacity = '0';
    }, 2500); // Adjust the delay as needed
  };


  // useEffect hook to perform side effects when the component mounts
  useEffect(() => {
  // Fetch the username from local storage when the component mounts
  const storedUsername: string | null = secureLocalStorage.getItem('username') as string;
  if (storedUsername) {
    setUserName(storedUsername);
  }

  const fetchAndUpdateBookData = () => {
    // Check if bookId is defined in the URL
    if (bookId && count === 0) {
      // Find the book with the given ID
      const book = books.find((book) => book.id === Number(bookId));

      if (book) {
        // Set the bookId in state
        lainaaKirja(bookId);
        window.history.pushState({}, document.title, '/'); // This clears the bookId from the URL
        // reset the bookId interface to an empty string
        setCount(count + 1);
      } else {
        // Handle the case where the book with the given ID was not found
        console.error("Book not found for ID:", bookId);
      }
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
  };

  // Fetch and update book data every second
  const interval = setInterval(fetchAndUpdateBookData, 1000);

  // Clear the interval when the component unmounts
  return () => clearInterval(interval);
}, [bookId, books]);


  // Function to handle borrowing a book
  const lainaaKirja = (kirjaID: string) => {

    console.log(kirjaID);

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
      displayError('Book already borrowed by the user');
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
            displayError('Error updating user lending information');
            console.log(error);
          });
          setKirjaID('');
      }
    } else {
      displayError('Book not found or not available');
    }
  };

  // Function to handle returning a borrowed book
  const ReturnBooks = () => {
    const usernamePattern = /^gr\d{6}$/;
    if (!usernamePattern.test(userName)) {
      displayError('Invalid username format. It should start with "gr" followed by 6 numbers.');
      return;
    }
    // Find the user by their username
    const user = users.find((user) => user.id === userName);

    // Check if the book is not found or not borrowed by the user
    if (user && !user.tuoteet.includes(returnBooks)) {
      displayError('Book not found or not borrowed by the user');
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
      displayError('Book not found or not available');
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
        setReturnBooks('');
    }
  };

  // Render the component's UI
  return (
    <div className='container'>
      <div className='contain'>
        <input type="text" className='username'
          placeholder="Käyttäjänimi"
          value={userName}
          onChange={(e) => saveUsernameToLocalStorage(e.target.value)}
        />
        <br />
        <div className='lainaa'>
          <h1>Käyttäjä: <GetUserName /></h1>
          <p id={"error-message"}>Error: <span>{error}</span></p>
          <input
            type="text"
            placeholder="Kirjan kirjan ID"
            value={kirjaID}
            onChange={(e) => setKirjaID(e.target.value)}
          />
          <button onClick={() => lainaaKirja(kirjaID)}>Lainaa Kirja</button>
          <br />
          
          <input type="text"
            placeholder="Palautettavan kirjan ID"
            value={returnBooks}
            onChange={(e) => setReturnBooks(e.target.value)}
          />
          <button onClick={ReturnBooks}>Palauta Kirja</button>
        </div>
        <div className='lainaukset'>
          {/* Use the GetBookInfo component to display the book's name and writer by its ID in the user's lending information and seperately display the ID of the book infront of the book's name and writer */}
          <h1>Käyttäjän <GetUserName /> lainaukset:</h1>
          <ul>
            {users.filter((user) => user.id === userName).map((user) => (
              user.tuoteet.map((book) => (
                <li key={book}>
                  {book} <GetBookInfo id={Number(book)} /> 
                </li>
              ))
            ))}
          </ul>
        </div>
        <div className="search-box">
          <input type="text" 
          className="input-search"
          placeholder="Kirjoita hakusana..."
          onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className='kirjat'>
          <h1>Kirjat:</h1>
          <ul>
            {books
              .filter((book) => book.nimi.toLowerCase().includes(search.toLowerCase()))
              .map((book) => (
                <li key={book.id}>
                  {book.id} {book.nimi} {book.kirjoittaja} {book.kpl}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Lainaukset;
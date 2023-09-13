import secureLocalStorage from "react-secure-storage";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Action from '../services/services';

import { Book } from '../services/services'; // Adjust the path as needed
import { UserInfo } from '../services/services'; // Adjust the path as needed
import { useNavigate } from "react-router-dom";

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
const Lainaukset = () => {
  const [kirjaID, setKirjaID] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [returnBooks, setReturnBooks] = useState<string>('');
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const navigate = useNavigate();
  window.onload = function() {
    if (secureLocalStorage.getItem('username') === null || secureLocalStorage.getItem('username') === undefined) {
      navigate("/login");
    }
    getUsers();
    getBooks();
  }
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
    }, 3500); // Adjust the delay as needed
  };

useEffect(() => {
  // Fetch the username from local storage when the component mounts
  const storedUsername: string | null = secureLocalStorage.getItem('username') as string;
    if (storedUsername) {
      setUserName(storedUsername);
    }
    // at the start of the program, get the information from the API
    setInterval(() => {
      getUsers();
      getBooks();
    }, 1000);
  }, []);
  const UpdateData = () => {
    getUsers();
    getBooks();
  };
  // function handlers
  const getUsers = async () => {
    const response = await Action.getUsers();
    setUsers(response.data);
  };

  const getBooks = async () => {
    const response = await Action.getBooks();
    setBooks(response.data);
  };

  const BorrowBook = async (userName: string, bookID: string) => {
    const result = await Action.borrowBook(userName, bookID);
    // if the result is an error, display the error message
    if (result && result.success === false) {
      displayError(result.message);
      console.log("error");
    }
    UpdateData();
    setKirjaID('');
    
  };

  const ReturnBook = async (userName: string, bookID: string) => {
    const result = await Action.returnBook(userName, bookID);
    // if the result is an error, display the error message
    if (result.success === false) {
      displayError(result.message);
      console.log("error");
    }
    UpdateData();
    setReturnBooks('');
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
          <button onClick={() => BorrowBook(userName, kirjaID)}>Lainaa Kirja</button>
          <br />
          
          <input type="text"
            placeholder="Palautettavan kirjan ID"
            value={returnBooks}
            onChange={(e) => setReturnBooks(e.target.value)}
          />
          <button onClick={() => ReturnBook(userName, returnBooks)}>Palauta Kirja</button>
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
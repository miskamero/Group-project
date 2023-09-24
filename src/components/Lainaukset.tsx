import secureLocalStorage from "react-secure-storage";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Action from '../services/services';
import '../App.scss';
import NavBar from './NavBar';

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

// Define the main functional component Lainauksetnavi
const Lainaukset = () => {
  const check: number = 0;
  if (0 === check) {
    document.body.style.overflow = "visible";
  }
  const [kirjaID, setKirjaID] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [returnBooks, setReturnBooks] = useState<string>('');
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const navigate = useNavigate(); // Move it here


  // Reusable function to display error messages, takes in the error message as a string as a parameter
  const displayError = (message: string) => {
    setError(message);
    document.getElementById('error-message')!.style.opacity = '1';
    setTimeout(() => {
      document.getElementById('error-message')!.style.opacity = '0';
    }, 3500); // 3500ms = 3.5s
  };

useEffect(() => {
  // Fetch the username from local storage when the component mounts
  const storedUsername: string | null = secureLocalStorage.getItem('username') as string;
    if (storedUsername) {
      setUserName(storedUsername);
    }
    // Call the UpdateData function every second which updates the data from the JSON-database
    setInterval(() => {
      UpdateData();
    }, 1000);
  }, []);
  // Function to update the data from the JSON-database
  const UpdateData = () => {
    getUsers();
    getBooks();
  };
  // Function for getting the users from the JSON-database, callable from other components
  const getUsers = async () => {
    const response = await Action.getUsers();
    setUsers(response.data);
  };
  // Function for getting the books from the JSON-database, callable from other components
  const getBooks = async () => {
    const response = await Action.getBooks();
    setBooks(response.data);
  };
  // Function for borrowing a book, takes in the username as a string and the book's ID as a string as parameters
  const BorrowBook = async (userName: string, bookID: string) => {
    const result = await Action.borrowBook(userName, bookID);
    // if the result is an error, display the error message
    if (result && result.success === false) {
      displayError(result.message);
      console.log("error");
    }
    // Update the data from the JSON-database using the UpdateData function from earlier
    UpdateData();
    setKirjaID('');
    
  };
  // Function for returning a book, takes in the username as a string and the book's ID as a string as parameters
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

  const checkIfLoggedIn = () => {
    // Fetch the username from local storage when the component mounts
    const storedUsername: string | null = secureLocalStorage.getItem('username') as string;
    if (storedUsername) {
      setUserName(storedUsername);
    }
    // If the username is not in local storage, navigate to the login page
    if (storedUsername === null) {
      navigate("/login");
    }
  };
  // Call the checkIfLoggedIn function when the component mounts
  useEffect(() => {
    checkIfLoggedIn();
  }, []);
  // Render the component's UI
  return (
    <div className="pageContainer">
      <NavBar />
      <div className='contain'> {/* container for the page's content */}
        <div className="userInfoContainer">
          <div className='lainaa'>
            <p id={"error-message"}>Error: <br/><span>{error}</span></p> {/* Error message paragraph */}
            <input type="button"
              value="Skannaa QR-koodi"
              onClick={() => navigate("/qr")
            }
            />
            <input
              type="text"
              placeholder="Kirjan kirjan ID"
              value={kirjaID}
              onChange={(e) => setKirjaID(e.target.value)}
            />
            <button onClick={() => BorrowBook(userName, kirjaID)}>Lainaa Kirja</button> {/* Button to borrow a book */}
            <br />
            
            <input type="text"
              placeholder="Palautettavan kirjan ID"
              value={returnBooks}
              onChange={(e) => setReturnBooks(e.target.value)}
            />
            <button onClick={() => ReturnBook(userName, returnBooks)}>Palauta Kirja</button> {/* Button to return a book */}
          </div>
          <div className='lainaukset'>
            {/* Use the GetBookInfo component to display the book's name and writer by its ID in the user's lending information and seperately display the ID of the book infront of the book's name and writer */}
            <h1>Lainauksesi:</h1>
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
        </div>
        <div className="search-box"> {/* Search box for searching books by their name */}
          <input type="text" 
          className="input-search"
          placeholder="Kirjoita hakusana..."
          onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className='kirjat'> {/* Display all the books in the JSON-database */}
          <h1>Kirjat:</h1>
          <ul> {/* Filter the books by the search input */}
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

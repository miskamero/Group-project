import React, { useState, useEffect } from 'react';
import secureLocalStorage from "react-secure-storage";
import Lainaukset from './Lainaukset';
import * as Action from '../services/services';

interface LainauksetProps {
  bookId: string;
}

import { Book } from '../services/services'; // Adjust the path as needed

const QRLainaus: React.FC<LainauksetProps> = ({ bookId }) => {
    
    // function that will get the name of the book from bookid. Action getBooks()


    const [book, setBook] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    useEffect(() => {
      const fetchBook = async () => {
        try {
          const response = await Action.getBooks();
          setBook(response.data); // Extract the data from the Axios response
          setLoading(false);
        } catch (error) {
          setError("Error fetching books");
          setLoading(false);
        }
      };
      fetchBook();

      borrowBookHandler("gr111111", bookId);
    }, []);
    

    const borrowBookHandler = async (userName: string, bookID: string) => {
      const result = await Action.borrowBook(userName, bookID);
      setError(result.message)
    };

  const getUsername = (): React.ReactNode => {
    const username = secureLocalStorage.getItem("username");
    if (username) {
      return <>{username}</>;
    }
    return "not logged in";
  }

  return (
    <div>
      <h1>Lainataan Kirja {bookId}</h1>
      <p>Kirja on lainattu käyttäjälle {getUsername()}</p>
      <h1>{error}</h1>
    </div>
  );
}

export default QRLainaus;

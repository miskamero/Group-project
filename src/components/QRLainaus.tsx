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
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
      const getUsername = () => {
        const username: string | undefined = secureLocalStorage.getItem('username') as string;
        setUserName(username);
      }
      getUsername();
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

      borrowBookHandler(userName, bookId);
    }, []);
    

    const borrowBookHandler = async (userName: string, bookID: string) => {
      const result = await Action.borrowBook(userName, bookID);
      setError(result.message)
    };

  return (
    <div>
      <h1>Lainataan Kirja {bookId}</h1>
      <p>Kirja on lainattu käyttäjälle {userName}</p>
      <h1>{error}</h1>
    </div>
  );
}

export default QRLainaus;

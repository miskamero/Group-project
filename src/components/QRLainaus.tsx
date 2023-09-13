import React, { useState, useEffect } from 'react';
import secureLocalStorage from "react-secure-storage";
import * as Action from '../services/services';

interface LainauksetProps {
  bookId: string;
}

import { Book } from '../services/services';

const QRLainaus: React.FC<LainauksetProps> = ({ bookId }) => {
    const [book, setBook] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
      const username: string | undefined = secureLocalStorage.getItem('username') as string;
      setUserName(username);
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

      borrowBookHandler(username, bookId);
    }, []);
    

    const borrowBookHandler = async (userName: string, bookID: string) => {
      const result = await Action.borrowBook(userName, bookID);
      // if the result is an error, display the error message
      if (result && result.success === false) {
        setError(result.message);
        console.log("error");
      };
    }

  return (
    <div>
      <h1>Lainataan Kirja {bookId}</h1>
      <p>Kirja on lainattu käyttäjälle {userName}</p>
      <h1>{error}</h1>
    </div>
  );
}

export default QRLainaus;

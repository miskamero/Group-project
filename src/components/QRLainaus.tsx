import React, { useState, useEffect } from 'react';
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import * as Action from '../services/services';
import '../QRscanner.scss';

interface LainauksetProps {
  bookId: string;
}

import { Book } from '../services/services';

const QRLainaus: React.FC<LainauksetProps> = ({ bookId }) => {
    const [book, setBook] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [result, setResult] = useState<string>("");
    const [userName, setUserName] = useState<string>('');

    const navigate = useNavigate(); // Move it here

    useEffect(() => {
      const username: string | undefined = secureLocalStorage.getItem('username') as string;
      setUserName(username);
      const fetchBook = async () => {
        try {
          const response = await Action.getBooks();
          setBook(response.data); // Extract the data from the Axios response
          setLoading(false);
        } catch (error) {
          setResult("Error fetching books");
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
        setResult(result.message);
        console.log("error");
        return;
      }
      else {
        setResult("Kirja on lainattu käyttäjälle " + userName);
        console.log("success");
        // Below code redirects to the home page using react router usenavigate
        setTimeout(() => {
          navigate("/");
        }, 2690);
      }
    }

  return (
    <div>
      <h1>Lainataan Kirja {bookId}</h1>
      <p>Kirja on lainattu käyttäjälle {userName}</p>
      <h1>{result}</h1>
      <button
        onClick={() => {
          navigate("/");
        }}
      >Takaisin etusivulle...</button>
    </div>
  );
}

export default QRLainaus;

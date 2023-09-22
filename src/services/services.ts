// services.js
import axios from "axios";
// import * as crypt from './crypt.ts'
import bcrypt from 'bcryptjs'


const UsersURL = "http://localhost:3002/lainaukset/";
const BooksURL = "http://localhost:3001/kirjat";

export interface UserInfo {
  id: string;
  password: string;
  tuoteet: string[];
}

export interface Book {
  nimi: string;
  kirjoittaja: string;
  kpl: number;
  id: string;
  kuva: string;
}

export const getUsers = async () => {
  const response = await axios.get(UsersURL);
  return response;
};

export const getBooks = async () => {
  const response = await axios.get(BooksURL);
  return response;
};

export const updateBookid = async (kirjaID: string, updatedBook: string) => {
  const response = await axios.put(
    `http://localhost:3001/kirjat/${kirjaID}`,
    updatedBook
  );
  return response;
};

export const updateUser = async (id:string, userName: string, tuoteet: string[]) => {
  const response = await axios.put(
    `http://localhost:3002/lainaukset/${id}`,
    { id: userName, tuoteet: tuoteet }
  );
  return response;
};


export const borrowBook = async (userName: string, bookID: string) => {
  try {
    // Fetch the user and book data first
    const [userResponse, bookResponse] = await Promise.all([
      axios.get(`${UsersURL}/${userName}`),
      axios.get(`${BooksURL}/${bookID}`),
    ]);

    const user = userResponse.data;
    const book = bookResponse.data;

    // Check if the book is already borrowed by the user
    if (user && user.tuoteet.includes(bookID)) {
      return { success: false, message: "Book already borrowed by the user" };
    }

    // Check if the book is found and available
    if (book && book.kpl > 0) {
      // Update the book's availability
      const updatedBook = {
        ...book,
        kpl: book.kpl - 1,
      };

      // Make an API request to update the book's information
      await axios.put(`${BooksURL}/${bookID}`, updatedBook);

      // Add the borrowed book to the user's lending information
      if (user) {
        const updatedUser = {
          ...user,
          tuoteet: [...user.tuoteet, bookID],
        };

        // Make an API request to update the user's lending information
        await axios.put(`${UsersURL}/${userName}`, updatedUser);

        return { success: true, message: "Book borrowed successfully" };
      }
    } else {
      return { success: false, message: "Book not found or not available" };
    }
  } catch (error) {
    return { success: false, message: "Error borrowing book" };
  }
};

export const returnBook = async (userName: string, bookID: string) => {
  try {
    // Fetch the user and book data first
    const [userResponse, bookResponse] = await Promise.all([
      axios.get(`${UsersURL}/${userName}`),
      axios.get(`${BooksURL}/${bookID}`),
    ]);

    const user = userResponse.data;
    const book = bookResponse.data;

    // Check if the book is borrowed by the user
    if (user && user.tuoteet.includes(bookID)) {
      // Update the book's availability
      const updatedBook = {
        ...book,
        kpl: book.kpl + 1,
      };

      // Make an API request to update the book's information
      await axios.put(`${BooksURL}/${bookID}`, updatedBook);

      // Remove the returned book from the user's lending information
      const updatedUser = {
        ...user,
        tuoteet: user.tuoteet.filter((id: string) => id !== bookID),
      };

      // Make an API request to update the user's lending information
      await axios.put(`${UsersURL}/${userName}`, updatedUser);

      return { success: true, message: "Book returned successfully" };
    } else {
      return { success: false, message: "Book not borrowed by the user" };
    }
  } catch (error: any) { // Adding ": any" as a quick fix, but you should use a specific error type
    return { success: false, message: "Error returning book: " + (error.message || "Unknown error") };
  }
};

export const addUser = async (id: string, password: string) => {
  // hash the password
  const hash_pass = await hash(password)
  const response = await axios.post(UsersURL, {
    id: id,
    password: hash_pass, 
    tuoteet: [],
  });
  // const response = await axios.post(UsersURL, { id, password, tuoteet: [] });
  return response;
}

export const addBook = async (nimi: string, kirjoittaja: string, kpl: number, kuva: string, amount: number ) => {
  let response;
  for (let i = 0; i < amount; i++) {
    response = await axios.post(BooksURL, { nimi, kirjoittaja, kpl, kuva });
  }
  // const response = await axios.post(BooksURL, { nimi, kirjoittaja, kpl, kuva });
  return response;
};

export const updateBook = async (kirjaID: string, name: string, author: string, amount: number, image: string) => {
  const response = await axios.put(
    `http://localhost:3001/kirjat/${kirjaID}`,
    { nimi: name, kirjoittaja: author, kpl: amount, kuva: image }
  );
  return response;
};

export const deleteBook = async (kirjaID: string) => {
  const response = await axios.delete(`http://localhost:3001/kirjat/${kirjaID}`);
  return response;
};

export const deleteUser = async (userName: string) => {
  const response = await axios.delete(`http://localhost:3002/lainaukset/${userName}`);
  return response;
};

export const hash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const compare = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}
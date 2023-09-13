// services.js
import axios from "axios";

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
}

export const getUsers = async () => {
  const response = await axios.get(UsersURL);
  return response;
};

export const getBooks = async () => {
  const response = await axios.get(BooksURL);
  return response;
};

export const updateBook = async (kirjaID: string, updatedBook: string) => {
  const response = await axios.put(
    `http://localhost:3001/kirjat/${kirjaID}`,
    updatedBook
  );
  return response;
};

export const updateUser = async (userName: string, updatedUser: string) => {
  const response = await axios.put(
    `http://localhost:3002/lainaukset/${userName}`,
    updatedUser
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
  const response = await axios.post(UsersURL, { id, password, tuoteet: [] });
  return response;
}

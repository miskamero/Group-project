// services.d.ts
import { AxiosResponse } from 'axios';

// Define TypeScript interfaces to describe data structures
interface Book {
  id: number;
  nimi: string;
  kirjoittaja: string;
  kpl: number;
}

interface UserInfo {
  id: string;
  tuoteet: string[];
}

declare module '../services/services' {
  // Declare the functions exported by your module
  export function getUsers(): Promise<AxiosResponse<UserInfo[]>>;
  export function getBooks(): Promise<AxiosResponse<Book[]>>;
  export function updateBook(
    kirjaID: string,
    updatedBook: Book
  ): Promise<AxiosResponse<Book>>;
  export function updateUser(
    userName: string,
    updatedUser: UserInfo
  ): Promise<AxiosResponse<UserInfo>>;
  export function borrowBook(
    userName: string,
    bookID: string
  ): Promise<{ success: boolean; message: string }>;

    export function returnBook(
    userName: string,
    bookID: string
    ): Promise<{ success: boolean; message: string }>;
}

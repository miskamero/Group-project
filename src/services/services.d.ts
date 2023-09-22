// services.d.ts
import { AxiosResponse } from 'axios';

// Define TypeScript interfaces to describe data structures
interface Book {
  id: number;
  nimi: string;
  kirjoittaja: string;
  kpl: number;
  kuva: string;
}

export interface UserInfo {
  id: string;
  password: string;
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

  export function addUser(
    id: string,
    password: string,
    tuoteet: string[],
    user: UserInfo
  ): Promise<AxiosResponse<UserInfo>>;
  export function login(
    id: string,
    password: string,
    user: UserInfo
  ): Promise<{ success: boolean; message: string }>;

  export function addBook(
    nimi: string,
    kirjoittaja: string,
    kpl: number,
    book: Book,
    kuva: string
  ): Promise<AxiosResponse<Book>>;
}

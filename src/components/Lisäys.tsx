
// need to do, /* Sakke */ Jooa
// Tee uusi function services.d.ts ja services.ts jossa on funktio joka lisää kirjan tietokantaan

import { useEffect, useState } from 'react';
import "../Lisäys_scss.scss";
import * as Action from '../services/services';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';

interface Book {
  id: string;
  nimi: string;
  kirjoittaja: string;
  kpl: number;
  kuva: string;
}
  
const Items = () => {
  const [books, setBooks] = useState<any>([]);
  const [newName, setNewName] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newImg, setNewImg] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [newId, setNewId] = useState(0);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  const handleNameChange = (event: any) => {
    setNewName(event.target.value);
  }

  const handleAuthorChange = (event: any) => {
    setNewAuthor(event.target.value);
  }

  const handleImgChange = (event: any) => {
    setNewImg(event.target.value);
  }

  const handleAmountChange = (event: any) => {
    setNewAmount(event.target.value);
  }

  const handleAdd = () => {
    Action.addBook(newName, newAuthor, 1, newImg, newAmount);
    setNewName("");
    setNewAuthor("");
    setNewImg("");
    setNewAmount(0);
    setNewId(newId + 1);
    setBooks(books.concat({ id: newId, nimi: newName, kirjoittaja: newAuthor, kpl: 1, kuva: newImg}));
  }

  const checkIfLoggedIn = () => {
    // Fetch the username from local storage when the component mounts
    const storedUsername: string | null = secureLocalStorage.getItem('username') as string;
    if (storedUsername) {
      setUserName(storedUsername);
    }
    // If the username is not in local storage, navigate to the login page
    if (storedUsername === null || storedUsername === undefined || storedUsername === "" ){
      navigate("/login");
    }
    if ( secureLocalStorage.getItem('username') != "admin") {
      navigate("/");
    }
  };

  // Call the checkIfLoggedIn function when the component mounts
  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="form">
        <form>
          Nimi:<br />
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleNameChange}
            value={newName}
            autoComplete="off"
          /><br />
          Kirjoittaja: <br />
          <input
            type="text"
            id="author"
            name="author"
            onChange={handleAuthorChange}
            value={newAuthor}
            autoComplete="off"
          /><br />
          Kuva <i>url</i>: <br />
          <input
            type="text"
            id="add-img"
            name="add-img"
            onChange={handleImgChange}
          /><br />
          Määrä: <br />
          <input
            type="number"
            id="amount"
            name="amount"
            onChange={handleAmountChange}
            value={newAmount}
            autoComplete="off"
          /><br />
        </form>
        <button id="add-button" type="button" onClick={handleAdd}>Lisää</button>
      </div>
      <Books />

      <Users />
    </div>
  )
}



const Users = () => {
  // can see users and delete them
  const [users, setUsers] = useState<any>([]);
  const [tuoteet, setTuoteet] = useState<any>([]);
  const [newName, setNewName] = useState("");

  const navigate = useNavigate(); // Move it here


  useEffect(() => {
    secureLocalStorage.setItem('admin', "false");
    Action.getUsers().then((response: any) => {
      setUsers(response.data);
    });
  }, []);

  // update user function 
  const updateUser = (id: string, tuoteet: string[]) => {
    var name = prompt("Muokkaa käyttäjän nimeä", id);

    // Check if the prompts returned non-null values before using them
    if (name !== null) {
      Action.updateUser(id, name, tuoteet);
      setUsers(users.map((user: any) => {
        if (user.id === id) {
          if (name !== null) {
            user.id = name;
          }
        }
        return user;
      }));
    } else {
      // Handle the case where the user clicked Cancel or the prompt failed
      // You can show an error message or handle it as needed.
      console.log("One of the prompts was canceled or failed.");
    }
  }

  const redirectToUser = (id: string) => {
    secureLocalStorage.setItem('username', id);
    secureLocalStorage.setItem('admin', "true");
    navigate("/");
  }


  return (
    <div>
      <div className="users">
        {users.map((user: any) => (
          <div className="user" key={user.id}>
            <h2>{user.id}</h2>
            <h3>{user.tuoteet}</h3>
            <button type="button" className="edit-button"
              onClick={() => {
                updateUser(user.id, user.tuoteet);
              }}
            >Muokkaa</button>
            <button type="button" className="delete-button"
              onClick={() => {
                Action.deleteUser(user.id).then((response: any) => {
                  setUsers(users.filter((u: any) => u.id !== user.id));
                  window.location.reload();
                });
              }}
            >Poista</button>

            <button
              onClick={() => {
                redirectToUser(user.id);
              }}
            >Siirry</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const Books = ({  }: any) => {
  const [books, setBooks] = useState<any>([]);
  const [uniqueBooksButton, setUniqueBooksButton] = useState(false);

    useEffect(() => {
    setInterval(() => {
      Action.getBooks().then((response: any) => {
        setBooks(response.data);
      });
  }, 500);
  }, []);

  const updateBook = (id: string, nimi: string, kirjoittaja: string, kpl: number, kuva: string) => {
    var name = prompt("Anna kirjan nimi", nimi);
    var author = prompt("Anna kirjan kirjoittaja", kirjoittaja);
    var amount = prompt("Anna kirjan määrä", kpl.toString());
    var img = prompt("Anna kirjan kuva url", kuva);

    // Check if the prompts returned non-null values before using them
    if (name !== null && author !== null && amount !== null && img !== null) {
      Action.updateBook(id, name, author, Number(amount), img);
      setBooks(books.map((book: Book) => {
        if (book.id === id) {
          if (name !== null && author !== null && amount !== null && img !== null) {
          book.nimi = name;
          book.kirjoittaja = author;
          book.kpl = Number(amount);
          book.kuva = img;
          }
        }
        return book;
      }));
    } else {
      // Handle the case where the user clicked Cancel or the prompt failed
      // You can show an error message or handle it as needed.
      console.log("One of the prompts was canceled or failed.");
    }
  }
    return(
      <div className="books">
        {books.map((book: Book) => (
          <div className="book" key={book.id}>
            <img src={book.kuva} alt="" style={image}/>
            <h2>{book.id}</h2>
            <h3>{book.nimi}</h3>
            <h4>{book.kirjoittaja}</h4>
            <h4>{book.kpl} kpl</h4>
            {/* edit button */}
            <button type="button" className="edit-button"
              onClick={() => {
                updateBook(book.id, book.nimi, book.kirjoittaja, book.kpl, book.kuva);
              }}
            >Muokkaa</button>
            {/* delete button */}
            <button type="button" className="delete-button"
              onClick={() => {
                Action.deleteBook(book.id).then((response: any) => {
                  setBooks(books.filter((b: Book) => b.id !== book.id));
                  // window.location.reload();
                });
              }}
            >Poista</button>
          </div>
        ))}
      </div>
    )
}


const image = {
  width: "77px",
  height: "auto",
  borderRadius: "10px",
}

export default Items;

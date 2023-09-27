import { useEffect, useState, useRef } from 'react';
import "../Lisäys_scss.scss";
import * as Action from '../services/services';
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';

import QRCode from "react-qr-code";
import { Printd } from 'printd'


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
  console.log(userName)

  window.onload = function() {
        secureLocalStorage.removeItem('admin');
  }
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
    Action.addBook(newName, newAuthor, newAmount, newImg, newAmount);
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
        <h2 className='formHeader'>Lisää kirja</h2>
        <form>
          <p>Nimi:</p>
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleNameChange}
            value={newName}
            autoComplete="off"
          /><br />
          <p>Kirjoittaja:</p>
          <input
            type="text"
            id="author"
            name="author"
            onChange={handleAuthorChange}
            value={newAuthor}
            autoComplete="off"
          /><br />
          <p>Kuva <i>url</i>:</p>
          <input
            type="text"
            id="add-img"
            name="add-img"
            onChange={handleImgChange}
            value={newImg}
          /><br />
          <p>Määrä:</p>
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
  const navigate = useNavigate(); // Move it here


  useEffect(() => {
    Action.getUsers().then((response: any) => {
      setUsers(response.data);
    });
  }, []);

  // update user function 
  const updateUser = (id: string) => {
    let name = prompt("Muokkaa käyttäjän nimeä", id);
    let password = prompt("Muokkaa käyttäjän salasanaa", "");
    // Check if the prompts returned non-null values before using them
    if (password === "") {
      password = null;
    }
    if (name !== null && password !== null) {
      Action.updateUser(id, name, password);
      setUsers(users.map((user: any) => {
        if (user.id === id) {
          if (name !== null && password !== null) {
            user.id = name;
            user.password = password;
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
      <h2 className='usersHeader'>Käyttäjät</h2>
      {/* Filter the shown users by the search input */}
      {/* Here is better code for the search input and it works better and modifies the search when the search input is modified */}
      <input type="text" id="userSearch" name="user-search" placeholder="Etsi käyttäjää" onChange={(event) => {
          const search = event.target.value;
          Action.getUsers().then((response: any) => {
            const filteredUsers = response.data.filter((user: any) => {
              return user.id.toLowerCase().includes(search.toLowerCase());
            });
            setUsers(filteredUsers);
          });
        }}
      /> 
        {users.map((user: any) => (
          <div className="user" key={user.id}>
            <h2>{user.id}</h2>
              {user.tuoteet.map((tuote: any) => (
                <div className="tuote" key={tuote.id}>
                  {tuote}
                </div>
              ))}
            <button type="button" className="edit-button"
              onClick={() => {
                updateUser(user.id);
              }}
            >Muokkaa</button>
            <button type="button" className="delete-button"
              onClick={() => {
                if (window.confirm("Haluatko varmasti poistaa käyttäjän " + user.id + "?" + "\nSinun pitää itse palauttaa kirjat käyttäjältä.") === true) {
                  Action.deleteUser(user.id).then((response: any) => {
                    setUsers(users.filter((u: any) => u.id !== user.id));
                    // Below is the code for returning the books that the user has borrowed. All the books are returned when the user is deleted.
                    window.location.reload();
                    console.log(response)
                  });
                } else {
                  console.log("Käyttäjää ei poistettu");
                  return;
                }
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

    useEffect(() => {
    setInterval(() => {
      Action.getBooks().then((response: any) => {
        setBooks(response.data);
      });
  }, 500);
  }, []);

  const updateBook = (id: string, nimi: string, kirjoittaja: string, kpl: number, kuva: string) => {
    let name = prompt("Anna kirjan nimi", nimi);
    let author = prompt("Anna kirjan kirjoittaja", kirjoittaja);
    let amount = prompt("Anna kirjan määrä", kpl.toString());
    let img = prompt("Anna kirjan kuva url", kuva);

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
        <div className="headerContainer">
          <h2 className='booksHeader'>Kirjat</h2>
        </div>
        {books.map((book: Book) => (
          <div className="book" key={book.id}>
            <h2>{book.id}</h2>
            <img src={book.kuva} alt="Kuva puuttuu"/>
            <h3>{book.nimi}</h3>
            <h4>{book.kirjoittaja}</h4>
            <h4>{book.kpl} kpl</h4>
            <div className="qr">
              <PrintableQR id={book.id} />
            </div>
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
                    console.log(response)
                  });
                }}
              >Poista</button>
            </div>
        ))} 
      </div>
    )
}

const QR = ({ id }: any) => {
  return (
    <div>
      <QRCode value={"http://localhost:5173/" + id} size={100} />
    </div>
  )
}

const PrintableQR = ({ id }: any) => {
  const componentRef = useRef(null);

  const handlePrint = () => {
    const printd = new Printd();
    const elementToPrint = componentRef.current;

    if (elementToPrint) {
      // Print the element with custom styles
      printd.print(elementToPrint, [`h1 { color: black; font-family: sans-serif; }`]);
    } else {
      console.error("Element not found or not yet rendered.");
    }
  };

  return (
    <div>
      <div ref={componentRef}>
        <QR id={id} />
      </div>
      <button onClick={handlePrint}>Lataa QR</button>
    </div>
  );
};


export default Items;

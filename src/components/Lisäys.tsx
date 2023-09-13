
// need to do, Sakke
// Tee uusi function services.d.ts ja services.ts jossa on funktio joka lisää kirjan tietokantaan

import { useEffect, useState } from 'react';
import "../Lisäys_scss.scss";
import kirjat from "../../kirjatdb.json";

interface Item {
  id: number;
  nimi: string;
  kirjoittaja: string;
  kpl: number;
  kuva: string | undefined;
}

interface FormProps {
  addItem: (newItem: Item) => void;
  jsonData: Item[];
  handleClick: () => void;
}

const Form: React.FC<FormProps> = ({ addItem, jsonData, handleClick }) => {
  const [newName, setNewName] = useState<string>("");
  const [newAuthor, setNewAuthor] = useState<string>("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newImg, setNewImg] = useState<string | undefined>(undefined);

  const lastItem = jsonData.slice(-1)[0];
  const newId = lastItem ? lastItem.id + 1 : 1;

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  }

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAuthor(event.target.value);
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAmount(parseInt(event.target.value, 10));
  }

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewImg(URL.createObjectURL(event.target.files[0]));
    }
  }

  const handleAdd = () => {
    if (newName.trim() === "" || newAuthor.trim() === "") {
      alert("Täytä kaikki tarvittavat kentät");
      return;
    }

    if (jsonData.some((item) => item.nimi === newName && item.kirjoittaja === newAuthor)) {
      alert(newName + " on jo lisätty");
      return;
    }

    const newItem: Item = {
      id: newId,
      nimi: newName,
      kirjoittaja: newAuthor,
      kpl: newAmount,
      kuva: newImg,
    }

    addItem(newItem);
    setNewName("");
    setNewAuthor("");
    setNewImg(undefined);
    handleClick();
  }

  return (
    <div>
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
          Kuva: <br />
          <input
            type="file"
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
        <p>Id: {newId}</p>
        <button id="add-button" type="button" onClick={handleAdd}>Lisää</button>
        <button id="cancel-button" type="button" onClick={handleClick}>Peru</button>
      </div>
    </div>
  )
}

const Items: React.FC = () => {
  const images = {
    width: "75px",
    height: "100px"
  }

  const [jsonData, setJsonData] = useState<Item[]>(kirjat.kirjat);

  const addItem = (newItem: Item) => {
    setJsonData([...jsonData, newItem]);
  }

  const [show, setShow] = useState<boolean>(false);

  const handleClick = () => {
    setShow((current) => !current);
  }

  return (
    <div>
      <div className={show ? "deactive" : ""}>
        <h2>Kirjat</h2>
        <button id="add" onClick={handleClick}>Lisää kirja</button>
      </div>

      {show ? <Form addItem={addItem} jsonData={jsonData} handleClick={handleClick} /> : null}

      <div className={show ? "deactive" : ""}>
        <h2>Kirjat</h2>
        {jsonData &&
          jsonData.map((item) => (
            <div key={item.id}>
              <img src={item.kuva} style={images} alt={item.nimi} />
              <p>{item.nimi}</p>
              <p>{item.kirjoittaja}</p>
              <p>{item.kpl}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Items;

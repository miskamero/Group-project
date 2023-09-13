import { useEffect, useState } from 'react';
import "./Lisäys_css.css";
import kirjat from "./kirjatdb.json";

const Form = ({addItem, jsonData, handleClick}) => {
 
  //antaa alku arvot
  const [newName, setNewName] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [newImg, setNewImg] = useState();
  //Löytää viimeisimmän id;n ja lisää siiden yhden
  const last  = jsonData.at(-1);
  const newId = last.id + 1;

  const handleNameChange = event => {
    setNewName(event.target.value);
  }

  const handleAuthorChange = event => {
    setNewAuthor(event.target.value);
  }

  const handleAmountChange = event => {
    setNewAmount(event.target.value);
  }

  const handleImgChange = event => {
    if (event.target.files && event.target.files[0]) {
    setNewImg(URL.createObjectURL(event.target.files[0]));
    }
  }

  const handleAdd = () => {

  //varmistaa että teksti ketät on täytetty
    if (newName.trim() === "" || newAuthor.trim() === "") {
      alert("Täytä kaikki tarvittavat kentät");
      return;
    } 
  //varmistaa että ei anna samaa nimeä ja kirjoittajaa eri kirjoille 
    if (jsonData.some(jsonData => jsonData.name === newName && jsonData.author === newAuthor)) {
      alert(newName + " on jo lisätty");
      return;
    }
  //luo sen uuden esineen käyttäjän antamilla tiedoilla
    const newItem = {
      id: newId,
      nimi: newName,
      kirjoittaja: newAuthor,
      kpl: newAmount,
      kuva: newImg,
    }

    addItem(newItem);
  //nollaa alku arvot
    setNewName("");
    setNewAuthor("");
    setNewImg();

  //piilottaa kyselyn lisäyksen jälkeen
    handleClick();
  }

  return (
    <div>
      <div className="form">
        <form>
          Nimi:<br/>
          <input 
          type="text"
          id="name"
          name="name"
          onChange={handleNameChange}
          value={newName}
          autoComplete="off"
          /><br/>
          Kirjoittaja: <br/>
          <input 
          type="text"
          id="author"
          name="author"
          onChange={handleAuthorChange}
          value={newAuthor}
          autoComplete="off"
          /><br/>
          Kuva: <br/>
          <input
          type="file"
          id="add-img"
          name="add-img"
          onChange={handleImgChange}
          /><br/>
          Määrä: <br/>
          <input
          type="number"
          id="amount"
          name="amount"
          onChange={handleAmountChange}
          value={newAmount}
          autoComplete="off"
          /><br/>
        </form>
         <p>Id: {newId}</p>
        <button id="add-button" type="submit" onClick={handleAdd}>Lisää</button>
        <button id="cancel-button" type="submit" onClick={handleClick}>Peru</button>
      </div>
    </div>
  )
}

const Items = () => {

  const images = {
    width: "75px",
    height: "100px"
  }
 //paljastaa json tiedot
  const [jsonData, setJsonData] = useState(kirjat.kirjat);

 console.log(kirjat)
 //lisää uuden kirjan arrayhin
 const addItem = (newItem) => {
  setJsonData([...jsonData, newItem]);
 }
 //piilottaa ja näyttää kyselyn
 const [show, setShow] = useState(false);

  const handleClick = event => {
    setShow(current => !current);
  }

  return (
    <div>
      <div className={show ? "deactive" : ""}>
      <h2>Kirjat</h2>

      <button id="add" onClick={handleClick}>Lisää kirja</button>
      </div>

      {show ? <Form addItem={addItem} jsonData={jsonData} handleClick={handleClick}/> : null}

       <div className={show ? "deactive" : ""}>
      <h2>Kirjat</h2>
      {jsonData &&
        jsonData.map((item) => (
          <div key={item.id}>
            <img src={item.kuva} style={images}/>
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
import { useEffect, useState } from 'react';
import "./App.scss";
import kirjat from "./kirjatdb.json";

const Form = ({addItem, jsonData, handleClick}) => {
 
  //antaa alku arvot
  const [newName, setNewName] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newAmount, setNewAmount] = useState(1);
  const [newImg, setNewImg] = useState("");

  //Löytää viimeisimmän id;n ja lisää siihen yhden
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
    setNewImg(event.target.value);
  }

  //lisää kirjan sivulle ja serverille
  const handleAdd = async (event) => {

   event.preventDefault();

  //tekee kpl numeron stringin sijaan
   const amount = parseInt(newAmount, 10);

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
  //varmistaa että laitettu kpl määrä on sopiva numero
    if (isNaN(amount)) {
      alert("Virheinen määrä. Laita sopiva numero.");
      return;
    }

    //varmistaa että kuvan URL on toimiva jos URL kenttään laitetaan jotain
    if (newImg.trim() != "") {

      const checkURL = (url) => {

        return new Promise((resolve) => {
          const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
      }

      const valid = await checkURL(newImg);

      if (!valid) {
        alert("Virheellinen URL.");
        return;
    }
  }

  //luo sen uuden esineen käyttäjän antamilla tiedoilla
    const newItem = {
      id: newId,
      nimi: newName,
      kirjoittaja: newAuthor,
      kpl: amount,
      kuva: newImg || null,
    }

    //yhdistää serveriin
    try {
      const response = await fetch("http://localhost:8000/api/books/add", {
        method: "POST",
        headers: {
           "Content-Type": "application/json",
        },
            body: JSON.stringify(newItem),
        });
  
        //lisää kirjan tai palauttaa error viestin
      if (response.ok) {
        const added = await response.json();
        addItem(added);
        handleClick();
      } else {
        alert("Kirjan lisäys epäonnistui. Koita uudelleen.");
      }
    } catch (error) {
      console.error("Virhe kirjan lisäyksessä:", error);
      alert("Virhe tapahtui kirjaa lisätessä.");
    }

  } 
  
  return (
    <div>
      <div className="form">
        <form id="kysely">
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
          Kuva (URL): <br/>
          <input
          type="url"
          id="add-img"
          name="add-img"
          onChange={handleImgChange}
          autoComplete="off"
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
          <p>Id: {newId}</p><br/>
          <button id="add-button" type="submit" onClick={handleAdd}>Lisää</button>
          <button id="cancel-button" type="button" onClick={handleClick}>Peru</button>
        </form>
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
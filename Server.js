const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, "..", "src", "kirjatdb.json");

//luo reitin pyynnöille
app.post("/api/books/add", (req, res) => {
  try {
    
    //lukee json datan
    const data = fs.readFileSync(dataPath);
    const kirjatdb = JSON.parse(data);

    const newItem = req.body;

    //luo uuden id:n jotta ei varmasti tule kahta samaa id:tä
    const newId = kirjatdb.kirjat.length + 1;

    //lisää kirjan
    newItem.id = newId;
    kirjatdb.kirjat.push(newItem);

    //säästää datan
    fs.writeFileSync(dataPath, JSON.stringify(kirjatdb, null, 2));

    //antaa error viestin jos jotain meni pieleen
    res.json(newItem);
  } catch (error) {
    console.error("Virhe kirjaa lisätessä:", error);
    res.status(500).json({ error: "Virhe tapahtui kirjaa lisätessä.", message: error.message });
  }
});

//aloittaa serverin tietyllä portilla
app.listen(port, () => {
  console.log("Serveri on portilla", {port});
});

module.exports = app;

# Projektin Dokumentaatio

Projekti käyttää Typescriptiä, Sass:ia ja Vitejs:ia ja perustuu Reactiin.

Projekti on rakennettu Nodejs versiolla 18.15.0.

## Käyttö:

`npm i`

`npm run start`

## Komponentit:

`Lainaukset.tsx:`

Lainaukset komponentissa on lainaus sivun pääsivu. Jossa käyttäjä voi lainata, ja palauttaa kirjoja.

`QRlainaus.tsx:`

QRlainaus komponentissa lainataan kirja URL:in mukaan "localhost:5173/ 'Kirjan ID'". Tätä komponenttia käytetään QR-koodin lukemisessa. QR-koodiin tulee nettisivun nimi + / kirjan id . Jonka avulla se kirja lainautuu.

`Kirjautuminen.tsx` ja `Rekisteröinti.tsx:`

Log in ja Sign up sivusto "localhost:5173/login" tai "localhost:5173/signup"

`Lisäys.tsx:`

Lisäys komponentissa on admin sivu, jonka avulla voi nähdä toisten tilien tiedot "localhost:5173/admin"

`services` tiedostot:

Services tiedostoja käytetään tietokannan manipuloimiseen. Sevices.d.ts on "declare" tiedosto services.ts:lle. Eli siellä declerataan services.ts tiedoston muuttojat ja funktiot.

`Services.ts` funktiot:

- `getUsers`
    Etsii kaikki ja palauttaa kaikki tiedot lainaukset.json tiedostosta.

- `getBooks`
    Etsii kaikki ja palauttaa kaikki tiedot kirjatdb.json tiedostosta.

- `updateBook`
- `updateUser`

- `borrowBook (userName: string, bookID: string)`
    Ottaa tili id:n ja kirjan id ja lisää sen, kyseisen idn "tuoteet" listaan. Antaa kyseiset virheet jos ei voi lainata. Esim jos kirja on jo varattu.

- `returnBook (userName: string, bookID: string)`
    Ottaa tili id:n ja kirjan id ja poistaa kirjan id:n, kyseisen id:n "tuoteet" listasta, jos voi.

- `addUser (id: string, password: string)`
    Tätä funktiota käytetään Rekisteröinti sivustolla, joka luo tilin tietokantaan.

- `hash (password: string)`
    Kryptaa salasanan. Tätä käytetään tilin luonnissa.

- `compare (password: string, hash: string)`
    Palauttaa true jos "password" ja "hash" on sama. Tätä käytetään kirjautumisessa.

Käyttö esimerkki:

```javascript
import * as Action from '../../services/services';

  const ReturnBook = async (userName: string, bookID: string) => {
    const result = await Action.returnBook(userName, bookID);
    if (result.success === false) {
      displayError(result.message);
      console.log("error");
    }
  };

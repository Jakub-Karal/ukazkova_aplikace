const express = require("express");// Načte knihovnu Express (pro vytvoření serveru).
const app = express(); // Vytvoří nový Express server a uloží ho do proměnné app.
const port = 8888; // Nastaví číslo portu, na kterém bude server naslouchat (např. http://localhost:8888).

const transactionController = require("./controller/transaction");
const categoryController = require("./controller/category"); //  Načte routery (směrovače) z tvých souborů. Ty zpracovávají /transaction a /category požadavky.

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Umožní serveru zpracovávat data z těla požadavků: json() pro JSON, urlencoded() pro formuláře

app.get("/", (req, res) => {
  res.send("Hello World!");
}); // Když někdo zadá /, server odpoví textem "Hello World!".

app.use("/transaction", transactionController);
app.use("/category", categoryController); //  Připojí routery: /transaction → směruje na kód v transactionController, /category → směruje na categoryController

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); // Spustí server na zvoleném portu a vypíše info do konzole.

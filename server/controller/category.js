const express = require("express"); // Načte knihovnu Express – používá se pro webový server.
const router = express.Router(); // Vytvoří router – objekt, který zpracovává různé cesty (např. /create, /list).

const GetAbl = require("../abl/category/getAbl");
const ListAbl = require("../abl/category/listAbl");
const CreateAbl = require("../abl/category/createAbl");
const UpdateAbl = require("../abl/category/updateAbl");
const DeleteAbl = require("../abl/category/deleteAbl"); 

/* Načte funkce z jiných souborů (z abl složky), každá řeší jednu akci:
GetAbl – načtení jedné kategorie
ListAbl – seznam všech kategorií
CreateAbl – vytvoření nové kategorie
UpdateAbl – úprava kategorie
DeleteAbl – smazání kategorie */

router.get("/get", GetAbl);
router.get("/list", ListAbl); // Když přijde požadavek typu GET: /get → spustí GetAbl, /list → spustí ListAbl
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl); // Když přijde požadavek typu POST: /create → spustí CreateAbl, /update → spustí UpdateAbl, /delete → spustí DeleteAbl

module.exports = router; // Umožní použít tento router v jiném souboru, např. v app.js pomocí: "app.use("/category", categoryController);"

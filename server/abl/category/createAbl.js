const Ajv = require("ajv"); // Načte knihovnu AJV pro kontrolu dat.
const ajv = new Ajv(); // Vytvoří instanci validátoru.

const categoryDao = require("../../dao/category-dao.js"); // Načte pomocníka pro práci s daty (uložení, načtení kategorií).

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
}; // Říká, že vstupní data musí být objekt, musí obsahovat name (jako text), a nesmí obsahovat nic navíc.

async function CreateAbl(req, res) { // Hlavní funkce, která zpracuje požadavek z webu (např. POST /create).
  try {
    let category = req.body; // Získá data z požadavku (např. { name: "Potraviny" }).

    const valid = ajv.validate(schema, category);
    if (!valid) { // Ověří, jestli data odpovídají schema.
      res.status(400).json({
        code: "dtoInIsNotValid",
        category: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    } // Pokud data nejsou v pořádku, vrátí chybu 400 a popíše proč.

    try {
      category = categoryDao.create(category); // Pokusí se uložit kategorii do souboru přes DAO.
    } catch (e) {
      res.status(400).json({
        ...e,
      });
      return;
    } // Pokud se ukládání nepovede, vrátí chybu.

    res.json(category); // Vrátí nově vytvořenou kategorii jako odpověď.
  } catch (e) {
    res.status(500).json({ category: e.category });
  }
} // Pokud dojde k jiné chybě, pošle chybu 500 (chyba na serveru).

module.exports = CreateAbl; // Umožní použít funkci CreateAbl jinde (např. v controller/category.js).

/* Tato funkce zajišťuje:
ověření vstupu,
uložení dat,
správnou odpověď nebo chybu.
Je to hlavní logika pro vytvoření jedné nové kategorie. */

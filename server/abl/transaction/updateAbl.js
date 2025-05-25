const Ajv = require("ajv");
const addFormats = require("ajv-formats").default; // Načteš knihovnu AJV pro validaci dat a rozšíření, které umí ověřovat formáty jako např. datum.
const ajv = new Ajv();
addFormats(ajv); // Vytvoříš validátor a přidáš podporu formátů (např. format: "date").

const transactionDao = require("../../dao/transaction-dao.js");
const categoryDao = require("../../dao/category-dao.js"); // Načteš pomocné moduly pro práci s uloženými transakcemi a kategoriemi.

const schema = { // Definuješ strukturu vstupních dat – transakce:
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    counterparty: { type: "string" },
    amount: { type: "number" },
    date: { type: "string", format: "date" },
    note: { type: "string" },
    categoryId: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
}; // Říká: objekt musí mít id (32 znaků) a může mít další uvedené vlastnosti. Nic navíc nesmí být obsaženo.

async function UpdateAbl(req, res) {
  try {
    let transaction = req.body; // Funkce pro aktualizaci transakce. Načítáš vstupní data z těla požadavku.

    const valid = ajv.validate(schema, transaction);
    if (!valid) { // Ověřuješ, jestli data odpovídají schématu.
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    } // Pokud ne, odpovíš chybou 400 + popis chyby.

    if (new Date(transaction.date) >= new Date()) { // Ověřuješ, že datum není v budoucnosti.
      res.status(400).json({
        code: "invalidDate",
        message: `date must be current day or a day in the past`,
        validationError: ajv.errors,
      });
      return;
    } // Pokud ano, odpovíš chybou 400.

    const updatedTransaction = transactionDao.update(transaction); // Pokusíš se aktualizovat transakci ve „skladu“ (např. souboru nebo databázi).

    const category = categoryDao.get(updatedTransaction.categoryId);
    if (!category) { // Zkontroluješ, jestli zadaná kategorie existuje.
      res.status(400).json({
        code: "categoryDoesNotExist",
        message: `Category with id ${updatedTransaction.categoryId} does not exist`,
        validationError: ajv.errors,
      });
      return;
    } // Pokud neexistuje, odpovíš chybou.

    if (!updatedTransaction) {
      res.status(404).json({
        code: "transactionNotFound",
        message: `Transaction ${transaction.id} not found`,
      });
      return;
    } // Pokud se transakce vůbec nenašla (např. ID neexistuje), odpovíš chybou 404.

    updatedTransaction.category = category;
    res.json(updatedTransaction); // Do odpovědi přidáš celou kategorii (pro zobrazení) a vrátíš aktualizovanou transakci.
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
} // Když nastane jiná neočekávaná chyba, vrátíš chybu 500 (server error).

module.exports = UpdateAbl; //  Exportuješ funkci, aby ji mohl použít tvůj controller/transaction.js.

const Ajv = require("ajv");
const ajv = new Ajv();
const categoryDao = require("../../dao/category-dao.js");
const transactionDao = require("../../dao/transaction-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    const reqParams = req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        category: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check there is no transaction related to given category
    const transactionList = transactionDao.listByCategoryId(reqParams.id);
    if (transactionList.length) {
      res.status(400).json({
        code: "categoryWithTransactions",
        message: "category has related transactions and cannot be deleted",
        validationError: ajv.errors,
      });
      return;
    }

    // remove transaction from persistant storage
    categoryDao.remove(reqParams.id);

    // return properly filled dtoOut
    res.json({});
  } catch (e) {
    res.status(500).json({ category: e.category });
  }
}

module.exports = DeleteAbl;

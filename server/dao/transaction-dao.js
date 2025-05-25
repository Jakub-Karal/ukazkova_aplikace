const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const transactionFolderPath = path.join(
  __dirname,
  "storage",
  "transactionList"
);

// Method to read an transaction from a file
function get(transactionId) {
  try {
    const filePath = path.join(transactionFolderPath, `${transactionId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadTransaction", message: error.message };
  }
}

// Method to write an transaction to a file
function create(transaction) {
  try {
    transaction.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(transactionFolderPath, `${transaction.id}.json`);
    const fileData = JSON.stringify(transaction);
    fs.writeFileSync(filePath, fileData, "utf8");
    return transaction;
  } catch (error) {
    throw { code: "failedToCreateTransaction", message: error.message };
  }
}

// Method to update transaction in a file
function update(transaction) {
  try {
    const currentTransaction = get(transaction.id);
    if (!currentTransaction) return null;
    const newTransaction = { ...currentTransaction, ...transaction };
    const filePath = path.join(transactionFolderPath, `${transaction.id}.json`);
    const fileData = JSON.stringify(newTransaction);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newTransaction;
  } catch (error) {
    throw { code: "failedToUpdateTransaction", message: error.message };
  }
}

// Method to remove an transaction from a file
function remove(transactionId) {
  try {
    const filePath = path.join(transactionFolderPath, `${transactionId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveTransaction", message: error.message };
  }
}

// Method to list transactions in a folder
function list(filter = {}) {
  try {
    const files = fs.readdirSync(transactionFolderPath);
    let transactionList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(transactionFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    const filterDate = filter.date
      ? new Date(filter.date).getMonth()
      : new Date().getMonth();
    transactionList = transactionList.filter(
      (item) => new Date(item.date).getMonth() === filterDate
    );
    transactionList.sort((a, b) => new Date(a.date) - new Date(b.date));

    return transactionList;
  } catch (error) {
    throw { code: "failedToListTransactions", message: error.message };
  }
}

// Method to list transactions by categoryId
function listByCategoryId(categoryId) {
  const transactionList = list();
  return transactionList.filter((item) => item.categoryId === categoryId);
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  listByCategoryId,
};

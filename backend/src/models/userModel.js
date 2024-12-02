const db = require("../utils/db");

const findByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const create = async ({ email, password, name, lastname, sex, age }) => {
  const query = `
    INSERT INTO users (email, password, name, lastname, sex, age)
    VALUES (?, ?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.run(query, [email, password, name, lastname, sex, age], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, email, name, lastname, sex, age });
      }
    });
  });
};

module.exports = {
  findByEmail,
  create,
};
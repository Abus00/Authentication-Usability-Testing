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

const create = async ({ email, password }) => {
  const query = `
    INSERT INTO users (email, password)
    VALUES (?, ?)`;
  return new Promise((resolve, reject) => {
    db.run(query, [email, password], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, email, password });
      }
    });
  });
};

const update = async (user) => {
  const query = `
    UPDATE users
    SET name = ?, lastname = ?, sex = ?, age = ?
    WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.run(query, [user.name, user.lastname, user.sex, user.age, user.email], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

module.exports = {
  findByEmail,
  create,
  update,
};
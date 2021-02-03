const db = require('../db');
const argon2 = require('argon2');

const hashPassword = async (password) => {
  return argon2.hash(password);
};

module.exports.verifyPassword = async (encrypted_password, password) => {
  return argon2.verify(encrypted_password, password);
};

module.exports.create = async (attributes) => {
  const { firstname, lastname, email, password } = attributes;

  const encrypted_password = await hashPassword(password);

  const result = await db.query(
    'INSERT INTO candidate(firstname, lastname, email, encrypted_password) VALUES(?,?,?,?)',
    [firstname, lastname, email, encrypted_password]
  );

  if (result) {
    return {
      id: result.insertId,
      firstname,
      lastname,
      email,
    };
  }
  return false;
};

module.exports.findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM candidate WHERE email = ?', [
    email,
  ]);

  if (result.length) {
    return result[0];
  }
  return false;
};

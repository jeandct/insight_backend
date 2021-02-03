const argon2 = require('argon2');
const db = require('../db');
const { ValidationError } = require('../error-types');

const hashPassword = async (password) => {
  return argon2.hash(password);
};

module.exports.verifyPassword = async (encrypted_password, password) => {
  return argon2.verify(encrypted_password, password);
};

const emailAlreadyExists = async (email) => {
  const lowerCaseEmail = email.toLowerCase();
  const rows = await db.query('SELECT * FROM candidate WHERE email = ?', [
    lowerCaseEmail,
  ]);
  if (rows.length) {
    return true;
  }
  return false;
};

const validate = async (attributes) => {
  const {
    firstname,
    lastname,
    email,
    password,
    password_confirmation,
  } = attributes;
  if (firstname && lastname && email && password && password_confirmation) {
    if (password === password_confirmation) {
      const emailExists = await emailAlreadyExists(email);
      // if (emailExists) throw new ValidationError();
      if (emailExists) return false;
      return true;
    }
  }
  throw new ValidationError();
};

module.exports.create = async (attributes) => {
  const checkCredentials = await validate(attributes);
  if (checkCredentials) {
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

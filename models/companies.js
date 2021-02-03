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
  const rows = await db.query('SELECT * FROM company WHERE email = ?', [
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
    company,
    email,
    password,
    password_confirmation,
  } = attributes;
  if (
    firstname &&
    lastname &&
    email &&
    company &&
    password &&
    password_confirmation
  ) {
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
    console.log(attributes);
    const { firstname, lastname, email, company, password } = attributes;

    const encrypted_password = await hashPassword(password);

    const result = await db.query(
      'INSERT INTO company(firstname, lastname, email, company, encrypted_password) VALUES(?,?,?,?,?)',
      [firstname, lastname, email, company, encrypted_password]
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
  const result = await db.query('SELECT * FROM company WHERE email = ?', [
    email,
  ]);

  if (result.length) {
    return result[0];
  }
  return false;
};

module.exports.findOne = async (id) => {
  const result = await db.query('SELECT * FROM company WHERE id = ?', [id]);

  if (result.length) {
    return result[0];
  }
  return false;
};

module.exports.upload = async (id, file) => {
  const result = await db.query('UPDATE company SET cv = ? WHERE id = ?', [
    file,
    id,
  ]);

  if (result) {
    return true;
  }
  return false;
};

module.exports.createOffer = async (attributes, id) => {
  const { title, location, text } = attributes;

  const offer = await db.query(
    'INSERT INTO offer (company_id, title, location, text) VALUES(?, ?,?,?)',
    [id, title, location, text]
  );

  if (offer) {
    return { id: offer.insertId, company_id: id, title, location, text };
  }
  return false;
};

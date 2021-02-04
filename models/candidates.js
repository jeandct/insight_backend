const argon2 = require('argon2');
const db = require('../db');
const { ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSqlSet');
const definedAttributesToSqlWhere = require('../helpers/definedAttributesToSqlWhere');

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

module.exports.findOne = async (id) => {
  const result = await db.query('SELECT * FROM candidate WHERE id = ?', [id]);

  if (result.length) {
    return result[0];
  }
  return false;
};

module.exports.upload = async (id, file) => {
  const result = await db.query('UPDATE candidate SET cv = ? WHERE id = ?', [
    file,
    id,
  ]);

  if (result) {
    return true;
  }
  return false;
};

module.exports.getOffers = async () => {
  const offers = await db.query(
    'SELECT offer.*, company.company FROM offer JOIN company ON company.id = offer.company_id',
    []
  );

  if (offers.length) {
    return offers;
  }
  return null;
};

module.exports.getOffersByQuery = async (attributes) => {
  const offers = await db.query(
    `SELECT offer.*, company.company FROM offer JOIN company ON company.id = offer.company_id WHERE ${definedAttributesToSqlWhere(
      attributes
    )}`,
    { ...attributes }
  );

  console.log(offers);

  if (offers.length) {
    return offers;
  }
  return null;
};

const checkOffer = async (id, offer_id) => {
  const check = await db.query(
    'SELECT * FROM offer_has_candidate WHERE candidate_id = ? AND offer_id = ?',
    [id, offer_id]
  );

  if (check.length) {
    return false;
  }
  return true;
};

module.exports.applyOffer = async (id, offer_id) => {
  const candidateCanApply = await checkOffer(id, offer_id);
  console.log(candidateCanApply);

  if (candidateCanApply) {
    const result = await db.query(
      'INSERT INTO offer_has_candidate (offer_id, candidate_id) VALUES(?, ?)',
      [offer_id, id]
    );

    if (result) {
      return {
        offer_id,
        candidate_id: id,
      };
    }
  }
  return false;
};

module.exports.getApplies = async (id) => {
  const applies = await db.query(
    'SELECT * from offer_has_candidate as applies JOIN offer ON applies.offer_id = offer.id WHERE applies.candidate_id = ?',
    [id]
  );

  if (applies.length) {
    return applies;
  }
  return false;
};

module.exports.acceptMeeting = async (attributes, candidate_id, offer_id) => {
  console.log(attributes, candidate_id, offer_id);
  const result = await db.query(
    `UPDATE offer_has_candidate SET ${definedAttributesToSqlSet(
      attributes
    )} WHERE offer_has_candidate.offer_id = :offer_id AND offer_has_candidate.candidate_id = :candidate_id`,
    { ...attributes, offer_id, candidate_id }
  );

  if (result.affectedRows > 0) {
    return true;
  }
  return false;
};

module.exports.getMeetings = async (id) => {
  const meetings = await db.query(
    'SELECT applies.*, offer.*, company.company FROM offer_has_candidate as applies JOIN offer ON applies.offer_id = offer.id JOIN company ON company.id = offer.company_id WHERE applies.candidate_id = ?',
    [id]
  );

  return meetings;
};

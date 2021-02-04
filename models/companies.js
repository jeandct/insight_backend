const argon2 = require('argon2');
const db = require('../db');
const { ValidationError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSqlSet');

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

module.exports.findOneOffer = async (id) => {
  const result = await db.query(
    'SELECT offer.*, company.company FROM offer JOIN company ON company.id = offer.company_id WHERE offer.id = ?',
    [id]
  );

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

module.exports.getCollection = async (id) => {
  const offers = await db.query('SELECT * FROM offer WHERE company_id = ?', [
    id,
  ]);

  if (offers.length) {
    return offers;
  }
  return null;
};

module.exports.updateOffer = async (attributes, offer_id) => {
  const id = parseInt(offer_id, 10);
  const res = await db.query(
    `UPDATE offer SET ${definedAttributesToSqlSet(attributes)} where id = :id`,
    { ...attributes, id }
  );

  console.log(res);

  if (res.affectedRows > 0) {
    const updatedOffer = await this.findOneOffer(id);
    return updatedOffer;
  }
  return null;
};

module.exports.deleteOffer = async (offer_id) => {
  const id = parseInt(offer_id, 10);
  const res = await db.query(`DELETE FROM offer WHERE id = ?`, [id]);

  if (res) {
    return true;
  }
  return false;
};

module.exports.getApplies = async (id) => {
  const applies = await db.query(
    'SELECT applies.*, offer.*, candidate.firstname, candidate.lastname, candidate.cv FROM offer_has_candidate AS applies JOIN offer ON applies.offer_id = offer.id JOIN candidate ON candidate.id = applies.candidate_id WHERE offer.company_id = ?',
    [id]
  );

  if (applies.length) {
    return applies;
  }
  return false;
};

module.exports.findOneCandidate = async (id) => {
  const result = await db.query('SELECT * FROM candidate WHERE id = ?', [id]);

  if (result.length) {
    return result[0];
  }
  return false;
};

// module.exports.meetingProposal = async (attributes, offer_id) => {
//   const { meeting_date, candidate_id } = attributes;

//   const formated_date = new Date(meeting_date);

//   const result = await db.query(
//     'UPDATE offer_has_candidate SET meeting_date = ? WHERE offer_has_candidate.offer_id = ? AND offer_has_candidate.candidate_id = ?',
//     [formated_date, offer_id, candidate_id]
//   );

//   if (result.affectedRows > 0) {
//     return { offer_id, candidate_id, meeting_date };
//   }
//   return false;
// };
module.exports.meetingProposal = async (attributes, offer_id) => {
  const { meeting_date, candidate_id } = attributes;

  const formated_date = new Date(meeting_date);

  const result = await db.query(
    `UPDATE offer_has_candidate SET ${definedAttributesToSqlSet(
      attributes
    )} WHERE offer_has_candidate.offer_id = :offer_id AND offer_has_candidate.candidate_id = :candidate_id`,
    { ...attributes, meeting_date: formated_date, offer_id, candidate_id }
  );

  if (result.affectedRows > 0) {
    return { offer_id, candidate_id, meeting_date };
  }
  return false;
};

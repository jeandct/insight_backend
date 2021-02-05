const omitBy = require('lodash/omitBy');

const definedAttributesToSqlWhere = (attributes) =>
  Object.keys(omitBy(attributes, (item) => typeof item === 'undefined'))
    .map((k) => `offer.${k} = :${k}`)
    .join(' AND ');

// console.log(definedAttributesToSqlWhere({ title: 'Dev', location: 'Lyon' }));

module.exports = definedAttributesToSqlWhere;

const { query } = require('../lib/db');
const SQL = require('@nearform/sql');

function addUser(email, passwordHash, firstName, lastName, phoneNumber) {
  return query(SQL`INSERT INTO users (email, password_hash, firstName, lastName, phoneNumber) VALUES (${email}, ${passwordHash}, ${firstName}, ${lastName}, ${phoneNumber})`)
}
exports.addUser = addUser;

function getUsers() {
  return query(SQL`SELECT * FROM users`)
}
exports.getUsers = getUsers;

async function getUserByEmail(email) {
  const rows = await query(SQL`SELECT * FROM users WHERE email=${email}`);
  return rows[0];
}
exports.getUserByEmail = getUserByEmail;

async function getUserById(userId) {
  const sql = SQL`SELECT * FROM users WHERE id = ${userId}`;
  const rows = await query(sql);
  return rows[0];
}
exports.getUserById = getUserById;

function updateUser(userId, firstName, lastName, phoneNumber, bio) {
  return query(SQL`UPDATE users SET firstName = ${firstName}, lastName = ${lastName}, phoneNumber = ${phoneNumber}, bio = ${!bio ? '': bio}  WHERE id = ${userId}`)  
}
exports.updateUser = updateUser;

function deleteUser(id) {
  const sql = SQL`DELETE FROM users WHERE id = ${id}`;
  return query(sql);
}
exports.deleteUser = deleteUser;
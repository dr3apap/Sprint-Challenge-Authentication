const db = require("../database/dbConfig");

async function add(user) {
  const [id] = await db("users").insert(user, "id");
  return db("users")
    .where("id", id)
    .first();
}

function findBy(filter) {
  return db("users").where(filter);
}

function findById() {}

module.exports = {
  add,
  findBy,
  findById,
};

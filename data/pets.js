const { query } = require('../lib/db');
const SQL = require('@nearform/sql');

function getPets(queryParams) {
  const sql = SQL`SELECT * FROM pets`;

  if (!queryParams.petType && !queryParams.adoptionStatus && !queryParams.height && !queryParams.weight && !queryParams.name )
    return query(sql);

  let shouldAddAND = false;
  sql.append(SQL` WHERE `)

  if (queryParams.petType)  {
    if (shouldAddAND) {
      sql.append(SQL` AND pet_type = ${queryParams.petType}`)
    } else {
      sql.append(SQL`pet_type = ${queryParams.petType}`)
      shouldAddAND = true;
    }
  }
  if (queryParams.adoptionStatus) {
    if (shouldAddAND) {
      sql.append(SQL` AND adoption_status = ${queryParams.adoptionStatus}`)
    } else {
      sql.append(SQL`adoption_status = ${queryParams.adoptionStatus}`)
      shouldAddAND = true;
    }
  }
  if (queryParams.height) {
    if (shouldAddAND) {
      sql.append(SQL` AND pet_height = ${queryParams.height}`)
    } else {
      sql.append(SQL`pet_height  = ${queryParams.height}`)
      shouldAddAND = true;
    }
  }
  if (queryParams.weight) {
    if (shouldAddAND) {
      sql.append(SQL` AND pet_weight = ${queryParams.weight}`)
    } else {
      sql.append(SQL`pet_weight  = ${queryParams.weight}`)
      shouldAddAND = true;
    }
  }
  if (queryParams.name) {
    if (shouldAddAND) {
      sql.append(SQL` AND name = ${queryParams.name}`)
    } else {
      sql.append(SQL`name  = ${queryParams.name}`)
      shouldAddAND = true;
    }
  }
  return query(sql);
}

exports.getPets = getPets;

function createPet(petItem) {
  return query(SQL`INSERT INTO pets (name, pet_type, adoption_status, picture_url, pet_height, pet_weight, color, bio, hypoallergenic, dietary_restrictions, breed) VALUES (${petItem.name}, ${petItem.type}, ${petItem.adoptionStatus}, ${petItem.picture}, ${petItem.height}, ${petItem.weight}, ${petItem.color}, ${petItem.bio}, ${petItem.hypoallergenic}, ${petItem.dietaryRestrictions}, ${petItem.breed} )`);
}
exports.createPet = createPet;

function updatePet(id, adoptionStatus, userId) {
  return query(SQL`UPDATE pets SET adoption_status = ${adoptionStatus}, userId = ${userId} WHERE id = ${id}`)  
}
exports.updatePet = updatePet;

function editPet(id, petItem){
  return query(SQL`UPDATE pets SET name = ${petItem.name}, pet_type = ${petItem.type}, pet_height = ${petItem.height}, pet_weight = ${petItem.weight}, color = ${petItem.color}, bio = ${petItem.bio}, dietary_restrictions = ${petItem.dietaryRestrictions} , breed = ${petItem.breed} WHERE id = ${id}`)
}
exports.editPet = editPet;

async function getPetById(id) {
  const sql = SQL`SELECT * FROM pets WHERE id = ${id}`;
  const rows = await query(sql);
  return rows[0];
}
exports.getPetById = getPetById;

async function getPetsByUserId(userId) {  
  return query(SQL`SELECT * FROM pets WHERE userId = ${userId}`);
}
exports.getPetsByUserId = getPetsByUserId;

function deletePet(id) {
  const sql = SQL`DELETE FROM pets WHERE id = ${id}`;
  return query(sql);
}
exports.deletePet = deletePet;
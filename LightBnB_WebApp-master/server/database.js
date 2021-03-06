const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  let user;
  for (const userId in users) {
    user = users[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      break;
    } else {
      user = null;
    }
  }
  return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

const properties = require('./json/properties.json');
const users = require('./json/users.json');



const { Pool } = require('pg');
//Pool is the preferred way to manage client connections becacuse POOL will
//manage multiple clinet connection for us
const pool = new Pool({
  user: 'luiscontreras',
  password: '1234',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query (
    `
    SELECT * FROM users
    WHERE email = $1
    `
  , [email])
  .then( res => {
    if(res) {
     
      return res.rows[0];
    }
    return null;
  }); 

  
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query (
    `
    SELECT name FROM users
    WHERE id = $1
    `
  , [id])
  .then( res => res.rows); 
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {

  
  return pool.query (
    `
    INSERT INTO users (name, email, password) 
    VALUES ($1,$2,$3)
    ;
    `
    ,[user.name,user.email,user.password])
    
  .then(res => 
    res.rows[0]
  
   ); 
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  return pool.query (
    `
SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
FROM property_reviews
JOIN properties ON properties.id = property_id
JOIN reservations ON reservations.id = reservation_id
WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date
LIMIT $2;
    `
    ,[guest_id,limit])
    
  .then(res => res.rows); 
  
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
   LEFT JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if(options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length} `;
   
  }

  if(options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night*100}`);
    queryString += `AND cost_per_night > $${queryParams.length} `;
    
  }

  if(options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night*100}`);
    queryString += `AND cost_per_night < $${queryParams.length} `;
    
  }

  if(options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `AND rating >= $${queryParams.length} `;
    
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id, property_reviews.rating
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  
  // 5
  
  
  
  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
const propertyParams = [];
propertyParams.push(`${property.title}`);
propertyParams.push(`${property.description}`);
propertyParams.push(`${property.owner_id}`);
propertyParams.push(`${property.cover_photo_url}`);
propertyParams.push(`${property.thumbnail_photo_url}`);
propertyParams.push(`${property.cost_per_night}`);
propertyParams.push(`${property.parking_spaces}`);
propertyParams.push(`${property.number_of_bathrooms}`);
propertyParams.push(`${property.number_of_bedrooms}`);
propertyParams.push(true);
propertyParams.push(`${property.province}`);
propertyParams.push(`${property.city}`);
propertyParams.push(`${property.country}`);
propertyParams.push(`${property.street}`);
propertyParams.push(`${property.post_code}`);

const queryString = `
INSERT INTO properties (title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
VALUES (
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
);
`

return pool.query(queryString,propertyParams)
.then(res => res.rows);

}
exports.addProperty = addProperty;
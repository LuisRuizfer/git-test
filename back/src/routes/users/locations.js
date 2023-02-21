//Imports
const route = require('express').Router();
const { createLocation, getAllLocations } = require('../../controllers/users/locations');


//Routes
route.get('/api/locations', getAllLocations);
route.post('/api/locations', createLocation);

module.exports = route;

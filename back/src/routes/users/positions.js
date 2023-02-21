//Imports
const route = require('express').Router();
const { createPosition, getAllPositions } = require('../../controllers/users/positions');


//Routes
route.get('/api/positions', getAllPositions);
route.post('/api/positions', createPosition);

module.exports = route;

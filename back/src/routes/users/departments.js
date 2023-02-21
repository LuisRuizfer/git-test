//Imports
const route = require('express').Router();
const { getAllDepartments, createDepartament } = require('../../controllers/users/departments');


//Routes
route.get('/api/departments', getAllDepartments);
route.post('/api/departments', createDepartament);

module.exports = route;

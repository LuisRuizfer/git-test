//Imports
const route = require('express').Router();
const { createManyAssignments, getMaterialAssignmentLog, getAssignmentsByUser } = require('../../controllers/materiales/material_assignment');

//Routes
route.post('/api/material-assignment', createManyAssignments);          //! Creates a many assignments
route.get('/api/material-assignment/:id', getMaterialAssignmentLog);    //! Gets log of assignments of a material by it's id
route.get('/api/material-assignment-user/:id', getAssignmentsByUser);   //! Gets assignments log by user

module.exports = route;
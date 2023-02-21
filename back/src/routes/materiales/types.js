//Imports
const route = require('express').Router();
const { createNewType, getTypeById, getAllTypes, editTipo } = require('../../controllers/materiales/types');

//Routes
route.post('/api/tipos', createNewType);    //! Creates a new type (Checked)
route.put('/api/tipos/:id', editTipo);      //! Edits an existing type (Checked)
route.get('/api/tipos', getAllTypes);       //! Gets all types (Checked)
route.get('/api/tipos/:id', getTypeById);   //! Gets type by id (Checked)

module.exports = route;
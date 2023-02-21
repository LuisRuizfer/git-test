//Imports
const route = require('express').Router();
const { createMaterialGroup, editMaterialGroup, getAllMaterialsGroup, getMaterialGroupById, getMaterialGroupName } = require('../../controllers/materiales/materials_group');

//Routes
route.post('/api/material-group', createMaterialGroup);         //! Creates a new material group (Checked)
route.put('/api/material-group/:id', editMaterialGroup);        //! Edits a material group (Checked)
route.get('/api/material-group', getAllMaterialsGroup);         //! Gets all material groups (Checked)
route.get('/api/material-group/:id', getMaterialGroupById);     //! Gets material group by ID (Checked)
route.get('/api/material-group-name/', getMaterialGroupName);   //! Gets products name (Checked)

module.exports = route;
//Imports
const route = require('express').Router();
const {
    getAllMaterialsUnique,
    getUserMaterialsUnique,
    getTypeMaterialsUnique,
    createManyMaterialsUnique,
    getAllDataMaterialsUnique,
    getMaterialById,
    createNewMaterialUnique,
    createCodeAndSerial,
    sendToTrashOrStorage } = require('../../controllers/materiales/materials_unique');

//Routes GET
route.get('/api/material-unique', getAllMaterialsUnique);               //! Gets all materials unique (Checked)
route.get('/api/material-unique-user/:id', getUserMaterialsUnique);     //! Gets all materials unique assigned to a worker (Checked)
route.get('/api/material-unique-type/:id', getTypeMaterialsUnique);     //! Gets all materials unique by type (Checked)
route.get('/api/material-unique-id/:id', getMaterialById);              //! Gets material unique info by its id (Checked)
route.get('/api/material-data', getAllDataMaterialsUnique);             //! Gets all data materials (Checked)

// Routes POST
route.post('/api/material-unique-invoice', createManyMaterialsUnique);  //! Creates a new material unique from INVOICE (Checked)
route.post('/api/material-unique', createNewMaterialUnique);            //! Creates an existing material unique (Checked)

route.put('/api/material-unique/:id', createCodeAndSerial)              //! Generates a new code and updates the serial number
route.put('/api/material-unique-send/:id', sendToTrashOrStorage)        //! Sends a material unique to trash or storage

module.exports = route;
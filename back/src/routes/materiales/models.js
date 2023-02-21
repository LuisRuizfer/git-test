//Imports
const route = require('express').Router();
const { createModel, updateModel, getAllModels, getModelById, getModelsByBrand } = require('../../controllers/materiales/models');

//Routes
route.post('/api/modelos', createModel);                //! Creates a new model (Checked)
route.put('/api/modelos/:id', updateModel);             //! Edits an existing model (Checked)
route.get('/api/modelos', getAllModels);                //! Gets all models (Checked)
route.get('/api/modelos/:id', getModelById);            //! Gets model by its id (Checked)
route.get('/api/modelos-marca/:id', getModelsByBrand);  //! Gets model by brand (Checked)


module.exports = route;
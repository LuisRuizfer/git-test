//Imports
const route = require('express').Router();
const { createMarca, editMarca, getAllMarcas, getMarcaById } = require('../../controllers/materiales/marcas');

//Routes
route.get('/api/marcas', getAllMarcas);         //! Get's all brands from database (Checked)
route.post('/api/marcas', createMarca);         //! Create Marca (Checked)
route.put('/api/marcas/:id', editMarca);        //! Edit Marca (Checked)
route.get('/api/marcas/:id', getMarcaById);     //! Gets brand by its id (Checked)

module.exports = route;
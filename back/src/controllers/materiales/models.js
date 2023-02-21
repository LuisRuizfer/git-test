//Imports
const { createNewModel, editModel, getModels, getModel, getModelsFromBrand } = require('../../models/materiales/models')

//! Creates a new model (Checked)
const createModel = async (req, res) => {
    try {
        const { name, id_marca } = req.body
        const model = await createNewModel(name, id_marca)
        if (model.affectedRows !== 0) {
            return res.status(200).json({ message: 'Modelo creado correctamente' });
        } else {
            return res.status(500).json({ message: 'Modelo no se ha creado correctamente' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al crear modelo' });
    }
}

//! Edits an existing model (Checked)
const updateModel = async (req, res) => {
    try {
        const { id } = req.params
        const { id_marca, name } = req.body;
        const model = await editModel(id, id_marca, name)
        if (model.affectedRows !== 0) {
            return res.status(200).json({ message: 'Modelo editado correctamente' });
        } else {
            return res.status(500).json({ message: 'error al editar modelo' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al editar modelo' });
    }
}

//! Gets all models (Checked)
const getAllModels = async (req, res) => {
    try {
        const allModels = await getModels()
        if (allModels.length > 0) {
            return res.status(200).json(allModels);
        } else {
            return res.status(500).json({ message: 'error al traer los modelos' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al traer los modelos' });
    }
}

//! Gets model by its id (Checked)
const getModelById = async (req, res) => {
    try {
        const { id } = req.params
        const model = await getModel(parseInt(id))
        if (model.length > 0) {
            return res.status(200).json(model);
        } else {
            return res.status(500).json({ message: 'Error al traer un modelo por id' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer un modelo por id' })
    }
}

//! Gets all models of a brand  (Checked)
const getModelsByBrand = async (req, res) => {
    try {
        const { id } = req.params
        const allModelsFromBrand = await getModelsFromBrand(parseInt(id))
        if (allModelsFromBrand.length > 0) {
            return res.status(200).json(allModelsFromBrand);
        } else {
            return res.status(500).json({ message: 'No hay modelos para esta marca' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al traer los modelos' });
    }
}

module.exports = { createModel, updateModel, getAllModels, getModelById, getModelsByBrand };
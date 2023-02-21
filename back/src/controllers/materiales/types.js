//Imports
const { createType, updateType, getTypes, getType } = require('../../models/materiales/types')

//! Creates a new type (Checked)
const createNewType = async (req, res) => {
    try {
        const { name } = req.body
        const type = await createType(name)
        if (type.affectedRows !== 0) {
            return res.status(200).json({ message: 'tipo creado correctamente' });
        } else {
            return res.status(500).json({ message: 'error al crear tipo' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al crear tipo' });
    }
}

//! Edits an existing type (Checked)
const editTipo = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const type = await updateType(id, name)
        if (type) {
            return res.status(200).json({ message: 'tipo editado correctamente' });
        } else {
            return res.status(500).json({ message: 'error al editar tipo' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al editar tipo' });
    }
}

//! Gets all types (Checked)
const getAllTypes = async (req, res) => {
    try {
        const types = await getTypes()
        if (types.length > 0) {
            return res.status(200).json(types);
        } else {
            return res.status(500).json({ message: 'error al traer las tipos' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al traer las tipos' });
    }
}

//! Gets type by id (Checked)
const getTypeById = async (req, res) => {
    try {
        const { id } = req.params
        const type = await getType(id)
        if (type.length > 0) {
            return res.status(200).json(type);
        } else {
            return res.status(500).json({ message: 'Error al traer un tipo por id' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer un tipo por id' })
    }
}

module.exports = { createNewType, editTipo, getAllTypes, getTypeById };
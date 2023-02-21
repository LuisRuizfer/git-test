//Imports
const { createNewMaterialGroup, setMaterialGroup, getAllGroups, getGroupById, getProductFullName } = require('../../models/materiales/materials_group')

//! Creates a new material group (Checked)
const createMaterialGroup = async (req, res) => {
    try {
        const { type, brand, model, comments } = req.body
        const materialGroup = await createNewMaterialGroup(type, brand, model, comments)
        if (materialGroup.affectedRows !== 0) {
            return res.status(200).json({ message: 'Grupo de materiales creado correctamente' });
        } else {
            return res.status(500).json({ message: 'Error al crear un nuevo grupo de materiales' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al crear un grupo de material' });
    }
}

//! Edits a material group (Checked)
const editMaterialGroup = async (req, res) => {
    try {
        const { id } = req.params
        const { type, brand, model, comment } = req.body
        const materialGroup = await setMaterialGroup(type, brand, model, comment, id)
        if (materialGroup.affectedRows !== 0) {
            return res.status(200).json({ message: 'Grupo de material editado correctamente' });
        } else {
            return res.status(500).json({ message: 'Error al editar un grupo de material' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al editar un grupo de material' });
    }
}

//! Gets all material groups (Checked)
const getAllMaterialsGroup = async (req, res) => {
    try {
        const allMaterialGroups = await getAllGroups()
        if (allMaterialGroups.length > 0) {
            return res.status(200).json(allMaterialGroups);
        } else {
            return res.status(500).json({ message: 'error al traer los grupos de materiales' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'error al traer los grupos de materiales' });
    }
}

//! Gets material group by ID (Checked)
const getMaterialGroupById = async (req, res) => {
    try {
        const { id } = req.params
        const materialGroup = await getGroupById(id)
        if (materialGroup.length > 0) {
            return res.status(200).json(materialGroup);
        } else {
            return res.status(500).json({ message: 'Error al traer un grupo de material por id' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer un grupo de material por id' })
    }
}

//! Gets Products Full Name
const getMaterialGroupName = async (req, res) => {
    try {
        const materialGroup = await getProductFullName()
        if (materialGroup.length > 0) {
            return res.status(200).json(materialGroup);
        } else {
            return res.status(500).json({ message: 'Error al traer los nombres de los productos' })
        }
    } catch (error) {

    }
}

module.exports = { createMaterialGroup, editMaterialGroup, getAllMaterialsGroup, getMaterialGroupById, getMaterialGroupName };
// Imports
const { getDepartments, insertDepartaments } = require('../../models/users/departments')

//! Gets all workers (Checked)
const getAllDepartments = async (req, res) => {
    try {
        const departments = await getDepartments()
        if (departments.length > 0) {
            return res.status(200).json(departments);
        } else {
            return res.status(500).json({ message: 'No hay departamentos registrados' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer los departamentos' });
    }
}

//! Creates a new departament.
const createDepartament = async (req, res) => {
    try {
        const { nombre } = req.body;
        const departament = await insertDepartaments(nombre)
        if (departament.affectedRows !== 0) {
            return res.status(200).json({ departament, message: 'Departamento creado correctamente' });
        } else {
            return res.status(500).json({ message: 'Error al crear el departamento' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el departamento' });
    }
}

module.exports = { getAllDepartments, createDepartament }

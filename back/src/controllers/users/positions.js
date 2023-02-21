// Imports
const { getPositions, insertPositions } = require('../../models/users/positions')

//! Gets all positions.
const getAllPositions = async (req, res) => {
    try {
        const positions = await getPositions()
        if (positions.length > 0) {
            return res.status(200).json(positions);
        } else {
            return res.status(500).json({ message: 'No hay posiciones.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer las posiciones.' });
    }
}

//! Creates a new position.
const createPosition = async (req, res) => {
    try {
        const { nombre } = req.body;
        const position = await insertPositions(nombre)
        if (position.affectedRows !== 0) {
            return res.status(200).json({ position, message: 'Posición creada correctamente' });
        } else {
            return res.status(500).json({ message: 'Error al crear posición' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear posición' });
    }
}


module.exports = { getAllPositions, createPosition }

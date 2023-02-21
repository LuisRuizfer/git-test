// Imports
const { getLocations, insertLocations } = require('../../models/users/locations');

//! Gets all locations.
const getAllLocations = async (req, res) => {
    try {
        const locations = await getLocations()
        if (locations.length > 0) {
            return res.status(200).json(locations);
        } else {
            return res.status(500).json({ message: 'No hay localizaciones.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al traer las localizaciones.' });
    }
}

//! Creates a new location.
const createLocation = async (req, res) => {
    try {
        const { nombre } = req.body;
        const location = await insertLocations(nombre)
        if (location.affectedRows !== 0) {
            return res.status(200).json({ location, message: 'Localización creada correctamente' });
        } else {
            return res.status(500).json({ message: 'Error al crear la localización' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear marca' });
    }
}

module.exports = { getAllLocations, createLocation }

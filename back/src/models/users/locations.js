// Imports
const pool = require('../../config/db');

//! Gets all locations.
const getLocations = async () => {
    try {
        const locations = await pool.query(`SELECT * FROM ga_orion.edificios_plantas ORDER BY nombre asc`)
        return locations
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets all locations.
const insertLocations = async (nombre) => {
    try {
        const locations = await pool.query(`INSERT INTO ga_orion.edificios_plantas 
            (nombre) VALUES (?)`, [nombre])
        return locations;
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = { getLocations, insertLocations }

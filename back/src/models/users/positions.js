// Imports
const pool = require('../../config/db');

//! Gets all positions.
const getPositions = async () => {
    try {
        const positions = await pool.query(`SELECT * FROM ga_orion.posiciones ORDER BY nombre asc`)
        return positions
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets all positions.
const insertPositions = async (nombre) => {
    try {
        const positions = await pool.query(`INSERT INTO ga_orion.posiciones 
            (nombre) VALUES (?)`, [nombre])
        return positions;
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = { getPositions, insertPositions }

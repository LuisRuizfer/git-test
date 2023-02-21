// Imports
const pool = require('../../config/db');

//! Creates a new type (Checked)
const createType = async (name) => {
    try {
        const type = await pool.query(`INSERT INTO ga_orion.tipos ( name ) values ( ? )`, [name])
        return type
    } catch (error) {
        console.log(error.stack);
    }
}

//! Edits an existing type (Checked)
const updateType = async (id, name) => {
    try {
        const type = await pool.query(`UPDATE ga_orion.tipos SET name= ? WHERE id= ? `, [name, id])
        return type
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets all types (Checked)
const getTypes = async () => {
    try {
        const type = await pool.query(`SELECT * FROM ga_orion.tipos ORDER BY name asc`)
        return type
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets type by id (Checked)
const getType = async (id) => {
    try {
        const type = await pool.query(`SELECT * FROM ga_orion.tipos WHERE id= ?`, [id])
        return type
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = { createType, updateType, getTypes, getType }
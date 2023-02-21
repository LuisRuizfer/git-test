// Imports
const pool = require('../../config/db');

//! Gets all workers
const getDepartments = async () => {
    try {
        const departments = await pool.query(`SELECT * FROM ga_orion.departamentos ORDER BY nombre asc`)
        return departments
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets all departaments.
const insertDepartaments = async (nombre) => {
    try {
        const departaments = await pool.query(`INSERT INTO ga_orion.departamentos
            (nombre) VALUES (?)`, [nombre])
        return departaments;
    } catch (error) {
        console.log(error.stack);
    }
}


module.exports = { getDepartments, insertDepartaments }

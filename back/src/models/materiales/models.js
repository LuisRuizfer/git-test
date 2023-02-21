// Imports
const pool = require("../../config/db");

//! Creates a new model (Checked)
const createNewModel = async (name, id_marca) => {
    try {
        const model = await pool.query(`INSERT INTO ga_orion.modelos (name, id_marca) VALUES (?, ?) `, [name, id_marca])
        return model
    } catch (error) {
        console.log(error.stack);
    }
}

//! Edits an existing model (Checked)
const editModel = async (id, id_marca, name) => {
    try {
        const model = await pool.query(`UPDATE ga_orion.modelos SET name= ?, id_marca= ? WHERE id= ? `, [name, id_marca, id])
        return model
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets all models (Checked)
const getModels = async () => {
    try {
        const allModels = await pool.query(`SELECT * FROM ga_orion.modelos ORDER BY name asc`)
        return allModels
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets model by id (Checked)
const getModel = async (id) => {
    try {
        const model = await pool.query(`SELECT * FROM ga_orion.modelos WHERE id= ?`, [id])
        return model
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets all models from a brand (Checked)
const getModelsFromBrand = async (id) => {
    try {
        const models = await pool.query(`SELECT * FROM ga_orion.modelos WHERE id_marca= ? ORDER BY name asc`, [id])
        return models
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = { createNewModel, editModel, getModels, getModel, getModelsFromBrand }
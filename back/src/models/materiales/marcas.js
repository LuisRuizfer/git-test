const pool = require('../../config/db')

//! Get's all brands from database (Checked)
const getAllBrands = async () => {
    try {
        const allBrands = await pool.query(`SELECT * FROM ga_orion.marcas ORDER BY name asc`)
        return allBrands
    } catch (error) {
        console.log(error.stack);
    }
}

//! Creates a new brand (Checked) 
const createBrand = async (name) => {
    try {
        const brandCreated = await pool.query(`INSERT INTO ga_orion.marcas (name) VALUES (?) `, [name])
        return brandCreated;
    } catch (error) {
        console.log(error.stack);
    }
}

//! Edits an existing brand (Checked)
const editBrand = async (id, name) => {
    try {
        const updatedBrand = await pool.query(`UPDATE ga_orion.marcas SET name= ? WHERE id= ? `, [name, id])
        return updatedBrand
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets a brand by it's ID (Checked)
const getBrandById = async (id) => {
    try {
        const brand = await pool.query(`SELECT * FROM ga_orion.marcas WHERE id= ?`, [id]) 
        return brand       
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = { getAllBrands, createBrand, editBrand, getBrandById }
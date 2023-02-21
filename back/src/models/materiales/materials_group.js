// Imports
const pool = require("../../config/db");

//! Creates a new material group (Checked)
const createNewMaterialGroup = async (type, brand, model, comments) => {
    try {
        const materialGroup = await pool.query(`INSERT INTO ga_orion.material_group ( tipo, marca, modelo, comments ) values ( ?, ?, ?, ? )`, [type, brand, model, comments])
        return materialGroup;
    } catch (error) {
        console.log(error.stack);
    }
}

//! Edits a material group (Checked)
const setMaterialGroup = async (type, brand, model, comment, id_material_group) => {
    try {
        const materialGroup = await pool.query(`UPDATE ga_orion.material_group SET tipo= ?, marca= ?, modelo= ?, comments= ? WHERE id= ?`, [type, brand, model, comment, id_material_group])
        return materialGroup;
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets All Material Groups (Checked)
const getAllGroups = async () => {
    try {
        const allGroups = await pool.query(`SELECT * FROM ga_orion.material_group`)
        return allGroups
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets material group by ID (Checked)
const getGroupById = async (id) => {
    try {
        const materialGroup = await pool.query(`SELECT * FROM ga_orion.material_group WHERE id= ?`, [id])
        return materialGroup
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets Products Full Name
const getProductFullName = async (id) => {
    try {
        const products = await pool.query(`
        SELECT g.id, CONCAT(t.name, ' ', m.name, ' ', mo.name) AS product_name
        FROM ga_orion.material_group AS g
        JOIN ga_orion.tipos AS t ON g.tipo = t.id
        JOIN ga_orion.marcas AS m ON g.marca = m.id
        JOIN ga_orion.modelos AS mo ON g.modelo = mo.id
        `)
        return products
    } catch (error) {
        console.log(error.stack);
    }
}

// Gets material group by it's values
//* NO SE ESTÁ USANDO AHORA MISMO
const getGroupByValues = async (type, brand, model) => {
    try {
        const materialGroup = await pool.query(`SELECT * FROM ga_orion.material_group WHERE tipo= ? AND marca= ? AND modelo= ? `, [type, brand, model])
        return materialGroup
    } catch (error) {
        console.log(error.stack);

    }
}

module.exports = { createNewMaterialGroup, setMaterialGroup, getAllGroups, getGroupById, getProductFullName }
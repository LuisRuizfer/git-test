// Imports
const pool = require("../../config/db");

//! Gets all materials unique (Checked)
const getUniqueMaterials = async () => {
    try {
        const uniqueMaterials = await pool.query(`SELECT * FROM ga_orion.material_uniq ORDER BY id_trabajador`)
        return uniqueMaterials
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets all data materials
const getAllDataMaterials = async () => {
    try {
        const dataMaterials = await pool.query(`
        SELECT g.id as 'id_MG', b.name as marca, t.name as tipo, m.name as modelo, u.id as material_id, u.id_trabajador, u.created_at AS creationDate, u.serial_number,
        u.precio, u.ga_code, w.nombre, w.apellidos, d.nombre as departamento, b.id as id_marca, t.id as id_tipo, m.id as id_modelo, tel.imei
        FROM ga_orion.material_group AS g 
        JOIN ga_orion.marcas AS b ON g.marca=b.id 
        JOIN ga_orion.tipos AS t ON g.tipo=t.id 
        JOIN ga_orion.modelos AS m ON g.modelo=m.id 
        JOIN ga_orion.material_uniq AS u ON g.id=u.id_material_group 
        JOIN ga_orion.trabajador AS w ON u.id_trabajador=w.id 
        JOIN ga_orion.departamentos AS d ON w.id_departamento=d.id
		LEFT JOIN ga_orion.telefonia AS tel ON tel.id_material_unique=u.id
        ORDER BY u.created_at desc, if(u.ga_code is null, 0,1), u.ga_code
            `)
        return dataMaterials
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets all materials unique by type (Checked)
const getUniqueMaterialsByType = async (id) => {
    try {
        const uniqueMaterials = await pool.query(`
            SELECT u.id, u.ga_code, g.tipo, g.marca, g.modelo FROM ga_orion.material_uniq AS u
            JOIN ga_orion.material_group AS g
            ON u.id_material_group = g.id
            WHERE g.tipo = ?`, [id]);
        return uniqueMaterials;
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets material unique info by its id (Checked)
const getUniqueMaterialById = async (id) => {
    try {
        const uniqueMaterials = await pool.query(`
        SELECT u.id_factura, u.id_trabajador, u.precio, u.ga_code, t.name AS tipo, b.name AS marca, 
            m.name AS modelo, u.created_by, u.created_at, u.serial_number, t.id as id_tipo, 
            f.file as invoice, f.comments as invoice_comments, TELF.imei
            FROM ga_orion.material_uniq AS u
            JOIN ga_orion.material_group AS g ON u.id_material_group = g.id
            JOIN ga_orion.tipos AS t ON g.tipo = t.id
            JOIN ga_orion.marcas AS b ON g.marca = b.id
            JOIN ga_orion.modelos AS m ON g.modelo = m.id
            JOIN ga_orion.factura AS f ON u.id_factura = f.id
            LEFT JOIN ga_orion.telefonia AS TELF ON u.id = TELF.id_material_unique
            WHERE u.id = ? `, [id]);
        return uniqueMaterials;
    } catch (error) {
        console.log(error.stack);
    }
}
//! Creates a new material unique
const newMaterialUnique = async (id_material_group, id_factura, precio, assigner) => {
    try {
        const ga_code = null;
        const id_worker_storage = 1
        const uniqueMaterial = await pool.query(`
            INSERT INTO ga_orion.material_uniq ( id_material_group, id_factura, id_trabajador, precio, ga_code, created_by ) 
            VALUES ( ?, ?, ?, ?, ?, ? )`, [id_material_group, id_factura, id_worker_storage, precio, ga_code, assigner])
        return uniqueMaterial
    } catch (error) {
        console.log(error.stack);
    }
}

//! Assigns the material unique to a worker
const updateMaterialUnique = async (id, id_trabajador) => {
    try {
        const updatedMaterial = await pool.query(`
        UPDATE ga_orion.material_uniq SET id_trabajador= ? WHERE id= ?`, [id_trabajador, id])
        return updatedMaterial
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets material unique by its GA_CODE
const getUniqueMaterialByGACode = async (ga_code) => {
    try {
        const uniqueMaterials = await pool.query(`SELECT * FROM ga_orion.material_uniq WHERE ga_code = ?`, [ga_code])
        return uniqueMaterials
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets material unique by its Serial Number
const getUniqueMaterialBySerial = async (serial_number) => {
    try {
        const uniqueMaterials = await pool.query(`SELECT * FROM ga_orion.material_uniq WHERE serial_number = ?`, [serial_number])
        return uniqueMaterials
    } catch (error) {
        console.log(error.stack);
    }
}

//! Creates a material unique manually
const createMaterialUnique = async (id_material_group, id_factura, id_trabajador, precio, ga_code, serial_number, created_by) => {
    try {
        const materialUnique = await pool.query(`INSERT INTO ga_orion.material_uniq ( id_material_group, id_factura, id_trabajador, precio, ga_code, serial_number, created_by ) values ( ?, ?, ?, ?, ?, ?, ? )`, [id_material_group, id_factura, id_trabajador, precio, ga_code, serial_number, created_by])
        return materialUnique;
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets all materials unique assigned to a worker
const getWorkersMaterials = async (id) => {
    try {
        const uniqueMaterials = await pool.query(`
            SELECT u.ga_code, t.name AS tipo, b.name AS marca, m.name AS modelo, u.id, u.serial_number, t.id AS id_tipo, tel.imei, u.precio
            FROM ga_orion.material_uniq AS u
            JOIN ga_orion.material_group AS g ON u.id_material_group = g.id
            JOIN ga_orion.tipos AS t ON g.tipo = t.id
            JOIN ga_orion.marcas AS b ON g.marca = b.id
            JOIN ga_orion.modelos AS m ON g.modelo = m.id
            LEFT JOIN ga_orion.telefonia AS tel ON tel.id_material_unique=u.id
            where id_trabajador= ?`, [id])
        return uniqueMaterials
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets last unique material added based on type
const getLastMaterialByGAType = async (ga_code) => {
    try {
        const lastMaterial = await pool.query(`
            SELECT ga_code FROM ga_orion.material_uniq 
            WHERE ga_code LIKE ?
            ORDER BY ga_code desc
            LIMIT 1`, [ga_code])
        return lastMaterial
    } catch (error) {
        console.log(error.stack);
    }
}

//! Inserts Existing Material's code
const insertExistingMaterialCode = async (tableName, id, material_id) => {
    try {
        const insertCode = await pool.query(`
        INSERT INTO ga_orion.${tableName} (id, id_material_unique) values ( ? , ? )
        `, [id, material_id])
        return insertCode
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = {
    getUniqueMaterials,
    getUniqueMaterialsByType,
    newMaterialUnique,
    getAllDataMaterials,
    updateMaterialUnique,
    getUniqueMaterialById,
    createMaterialUnique,
    getUniqueMaterialByGACode,
    getWorkersMaterials,
    getLastMaterialByGAType,
    getUniqueMaterialBySerial,
    insertExistingMaterialCode
}

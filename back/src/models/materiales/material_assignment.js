//Imports
const pool = require("../../config/db");

//! Creates a new material unique
const firstMaterialAssignment = async (id_material_unico, email) => {
    try {
        const id_worker_storage = 1
        const id_worker_invoice = 2
        const notas = null
        const uniqueMaterial = await pool.query(`
            INSERT INTO ga_orion.asignacion_material ( id_trabajador_origen, id_trabajador_destino, id_material_unico, notas, assigner ) 
            VALUES ( ?, ?, ?, ?, ? )`, [id_worker_invoice, id_worker_storage, id_material_unico, notas, email])
        return uniqueMaterial
    } catch (error) {
        console.log(error.stack);
    }
}

//! Creates assignments
const createAssignment = async (id_trabajador_origen, id_material_unico, assigner, id_trabajador_destino, notas) => {
    try {
        const newAssignment = await pool.query(`
        INSERT INTO ga_orion.asignacion_material ( id_trabajador_origen, id_trabajador_destino, id_material_unico, notas, assigner ) 
        VALUES ( ?, ?, ?, ?, ? )
        `, [id_trabajador_origen, id_trabajador_destino, id_material_unico, notas, assigner])
        return newAssignment
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets log of assignments of a material by it's id
const getLogByMaterial = async (id) => {
    try {
        const log = await pool.query(`
            SELECT a.notas, a.assigner, a.created_at as fecha, CONCAT(t_o.nombre, ' ', t_o.apellidos) as origen, CONCAT(td.nombre, ' ', td.apellidos) as destino
            FROM ga_orion.asignacion_material as a
            JOIN ga_orion.trabajador as t_o on a.id_trabajador_origen = t_o.id
            JOIN ga_orion.trabajador as td on a.id_trabajador_destino = td.id
            WHERE id_material_unico = ?
            ORDER BY created_at desc
        `, [id])
        return log
    } catch (error) {
        console.log(error.stack);
    }
}

//! Gets assignments log by user
const getLogByUser = async (id) => {
    try {
        const log = await pool.query(`
            SELECT a.notas, a.assigner, a.created_at as fecha,a.id_material_unico as material, mu.ga_code, mu.id_material_group as mu_mg,
            marcas.name as marca, tipos.name as tipo, modelos.name as modelo,
            CONCAT(t_o.nombre, ' ', t_o.apellidos) as origen, CONCAT(td.nombre, ' ', td.apellidos) as destino, tel.imei, mu.serial_number
            FROM ga_orion.asignacion_material as a
            JOIN ga_orion.trabajador as t_o on a.id_trabajador_origen = t_o.id
            JOIN ga_orion.trabajador as td on a.id_trabajador_destino = td.id
            JOIN ga_orion.material_uniq as mu on  mu.id = a.id_material_unico
            JOIN ga_orion.material_group as MG on MG.id = mu.id_material_group
            JOIN ga_orion.marcas as marcas on MG.marca=marcas.id 
            JOIN ga_orion.tipos as tipos on MG.tipo=tipos.id 
            JOIN ga_orion.modelos as modelos on MG.modelo=modelos.id
            LEFT JOIN ga_orion.telefonia AS tel ON tel.id_material_unique=mu.id
            WHERE id_trabajador_destino = ? OR id_trabajador_origen = ?
            ORDER BY a.created_at desc
        `, [id, id])
        return log
    } catch (error) {
        console.log(error.stack);
    }
}

module.exports = { firstMaterialAssignment, createAssignment, getLogByMaterial, getLogByUser }

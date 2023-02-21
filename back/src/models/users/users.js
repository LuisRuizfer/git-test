// Imports
const pool = require('../../config/db');

//! Gets all workers.
const getWorkers = async () => {
    try {
        const type = await pool.query(`
        SELECT t.id, t.nombre, t.apellidos, p.nombre AS posicion, p.id AS id_posicion, t.responsable, d.nombre AS departamento,
         d.id AS id_departamento, e.nombre AS ubicacion, e.id as id_ubicacion, t.activo, t.email, t.manager, t.role
        FROM ga_orion.trabajador AS t
        JOIN ga_orion.posiciones AS p ON t.id_posicion = p.id
        JOIN ga_orion.departamentos AS d ON t.id_departamento = d.id
        JOIN ga_orion.edificios_plantas AS e ON t.id_edificio_planta = e.id
        ORDER BY t.nombre asc
        `)
        return type
    } catch (error) {
        console.log(error.stack);
    }
}

//! Get worker by its ID.
const getWorker = async (id) => {
    try {
        const worker = await pool.query(`
        SELECT t.nombre, t.apellidos, p.nombre AS posicion, d.nombre AS departamento, 
        e.nombre AS ubicacion, t.activo, t.email
        FROM ga_orion.trabajador AS t
        JOIN ga_orion.posiciones AS p ON t.id_posicion = p.id
        JOIN ga_orion.departamentos AS d ON t.id_departamento = d.id
        JOIN ga_orion.edificios_plantas AS e ON t.id_edificio_planta = e.id
        WHERE t.id = ?
        `, [id])
        return worker
    } catch (error) {
        console.log(error.stack);
    }
}

//! Get worker by EMAIL.
const getWorkerByEmail = async (email) => {
    try {
        const worker = await pool.query(` SELECT * FROM ga_orion.trabajador WHERE email = ? `, [email])
        return worker
    } catch (error) {
        console.log(error.stack);
    }
}

//! Sets specified worker to active = 0
const deactivateUser = async (id) => {
    try {
        const disableUser = await pool.query(`
            UPDATE ga_orion.trabajador SET activo= 0 WHERE id= ?`, [id])
        return disableUser
    } catch (error) {
        console.log(error.stack);
    }
}

const insertUser = async (name, lastname, position, department, location, responsable, active, user_email, isManager) => {
    try {
        const user = await pool.query(`INSERT INTO ga_orion.trabajador (nombre, apellidos, id_posicion, id_departamento, 
            id_edificio_planta, responsable, activo, email, manager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, lastname, position, department, location, responsable, active, user_email, isManager])
        return user
    } catch (error) {
        console.log(error);
        return error
    }
}
const putEditUser = async (nombre, apellidos, id_posicion, id_departamento, id_edificio_planta, responsable, manager, email, id) => {
    try {
        const updatedUser = await pool.query(`UPDATE ga_orion.trabajador SET nombre = ?, apellidos = ?, id_posicion = ?,  
            id_departamento = ?, id_edificio_planta = ?, responsable = ?, manager = ?, email = ? WHERE id = ?`,
            [nombre, apellidos, id_posicion, id_departamento, id_edificio_planta, responsable, manager, email, id])
        return updatedUser
    } catch (error) {
        console.log(error);
        return error
    }
}

const findUser = async (email) => {
    const response = await pool.query(`SELECT * FROM ga_orion.trabajador WHERE email = ? `, [email])
    return response
}

module.exports = { getWorkers, getWorker, deactivateUser, insertUser, putEditUser, getWorkerByEmail }

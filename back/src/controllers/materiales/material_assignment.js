//Imports
const { updateMaterialUnique, getLastMaterialByGAType, getUniqueMaterialByGACode } = require('../../models/materiales/materials_unique');
const { createAssignment, getLogByMaterial, getLogByUser } = require('../../models/materiales/material_assignment')

const pool = require("../../config/db");

//! Creates a new material group (Checked)
const createManyAssignments = async (req, res) => {
    try {
        const { assigner, to_storage, to_worker, worker } = req.body;
        // Checks if there is data to be added to worker and/or to storage
        let checkIfStorage = to_storage.length > 0 && true;
        let checkIfWorker = to_worker.length > 0 && true;
        // Initializes the counter to 0 if there are inserts for storage and/or worker
        let counter = 0;
        // Checks if at least to_worker or to_storage or both have any data to insert
        if ((checkIfStorage && checkIfWorker) || checkIfStorage || checkIfWorker) {
            const join = [...to_storage, ...to_worker];
            pool.getConnection(function (err, connection) {
                connection.beginTransaction(err => {
                    join.forEach(async ({ id_trabajador, material_id, toStorage, ga_code, serial_number, id_tipo, imei, comment }) => {
                        const id_trabajador_destino = (toStorage !== undefined) ? 1 : worker;
                        let code;
                        if (ga_code === undefined || ga_code === null) {
                            let prefix = [7, 24, 26, 27, 28, 29].includes(id_tipo) ? 'GA' : 'P';
                            prefix && connection.query(
                                `INSERT INTO ga_orion.${prefix === 'GA' ? 'ga_codes' : 'p_codes'} (id_material_unique) values ( ? )`,
                                [material_id], (error, results) => {
                                    if (error) { return connection.rollback(() => { throw error; }) }
                                    if (results.insertId) {
                                        code = prefix.concat(String(results.insertId))
                                        connection.query(`UPDATE ga_orion.material_uniq SET id_trabajador= ?, serial_number = ?, ga_code= ? WHERE id= ?`,
                                            [id_trabajador_destino, serial_number, code, material_id],
                                            (error, results) => {
                                                if (error) { return connection.rollback(() => { throw error; }) }
                                                (results.affectedRows !== 0) &&
                                                    connection.query(`INSERT INTO ga_orion.asignacion_material ( id_trabajador_origen, id_trabajador_destino, id_material_unico, notas, assigner ) VALUES ( ?, ?, ?, ?, ? )`,
                                                        [id_trabajador, id_trabajador_destino, material_id, comment, assigner],
                                                        (error, results) => {
                                                            if (error) { return connection.rollback(function () { throw error; }) };
                                                            if (results.insertId) {
                                                                if (id_tipo === 18) {
                                                                    connection.query(`INSERT INTO ga_orion.telefonia ( id_material_unique, imei ) VALUES ( ?, ? )`, [material_id, imei], (error, results) => {
                                                                        if (error) { return connection.rollback(() => { throw error; }) }
                                                                        if (results.insertId) {
                                                                            connection.commit(function (error) {
                                                                                if (error) { return connection.rollback(() => { throw error; }) }
                                                                                counter++;
                                                                                if (counter === join.length) { return res.status(200).json({ message: 'Asignación creada correctamente' }); }
                                                                            });
                                                                        }
                                                                    })
                                                                } else {
                                                                    connection.commit(function (error) {
                                                                        if (error) { return connection.rollback(() => { throw error; }) }
                                                                        counter++;
                                                                        if (counter === join.length) {
                                                                            return res.status(200).json({ message: 'Asignación creada correctamente' });
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                            });
                                    }
                                });
                        } else {
                            connection.query(`UPDATE ga_orion.material_uniq SET id_trabajador= ? WHERE id= ?`,
                                [id_trabajador_destino, material_id],
                                (error, results) => {
                                    if (error) { return connection.rollback(() => { throw error; }) }
                                    (results.affectedRows !== 0) &&
                                        connection.query(`INSERT INTO ga_orion.asignacion_material ( id_trabajador_origen, id_trabajador_destino, id_material_unico, notas, assigner ) VALUES ( ?, ?, ?, ?, ? )`,
                                            [id_trabajador, id_trabajador_destino, material_id, comment, assigner],
                                            (error) => {
                                                if (error) { return connection.rollback(function () { throw error }) }
                                                console.log('ASIGNACIÓN CREADA');
                                                connection.commit(function (error) {
                                                    if (error) { return connection.rollback(function () { throw error }) }
                                                    counter++;
                                                    if (counter === join.length) {
                                                        return res.status(200).json({ message: 'Asignación creada correctamente' });
                                                    }
                                                });
                                            })
                                })
                        }
                    })
                })
            })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear la asignación' });
    }
}

//! Gets log of assignments of a material by it's id
const getMaterialAssignmentLog = async (req, res) => {
    try {
        const { id } = req.params
        const log = await getLogByMaterial(id)
        if (log.length > 0) {
            return res.status(200).json(log);
        } else {
            return res.status(500).json({ message: 'No hay materiales únicos del tipo solicitado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al devolver log de asignaciones' });
    }
}

//! Gets assignments log by user
const getAssignmentsByUser = async (req, res) => {
    try {
        const { id } = req.params
        const log = await getLogByUser(id)
        if (log.length > 0) {
            return res.status(200).json(log);
        } else {
            return res.status(500).json({ message: 'No hay registro de asignación para este usuario' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al devolver log de asignaciones' });
    }
}

module.exports = { createManyAssignments, getMaterialAssignmentLog, getAssignmentsByUser };

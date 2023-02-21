//Imports
const baseUrl = process.env.BACK_URL;
const pdf = require('html-pdf');
const pdfTemplate = require('../documents/worker_materials')
const logsTemplate = require('../documents/worker_logs')
const pool = require("../config/db");
const sendMail = require('../middlewares/mails/worker_materials')
const sendWorkerLog = require('../middlewares/mails/worker_logs')
const { getUserDocuments, updateDocument } = require('../models/documents')
const fs = require('fs')


const getFileDate = (fecha) => {
    const day = (fecha.getDate() < 10) ? `0${fecha.getDate()}` : fecha.getDate()
    const month = (fecha.getMonth() < 10) ? `0${fecha.getMonth()}` : fecha.getMonth()
    const year = fecha.getFullYear()
    const hours = fecha.getHours() < 10 ? `0${fecha.getHours()}` : fecha.getHours()
    const minutes = fecha.getMinutes() < 10 ? `0${fecha.getMinutes()}` : fecha.getMinutes()
    return `${year}${month}${day}${hours}${minutes}`
}

const createPdf = async (req, res) => {
    try {
        const { nombre, apellidos, dni, materiales, worker_id, email, assigner } = req.body;
        const check = (nombre && apellidos && materiales && worker_id && email && assigner) && true;
        if (check) {
            const newName = nombre.split(' ').filter((n, i) => (i === 0)).join('');
            const newLastname = apellidos.split(' ').filter((a, i) => (i === 0)).join('');
            const fileName = `Asignacion-${newName}-${newLastname}-${getFileDate(new Date())}.pdf`;
            await pdf.create(pdfTemplate(req.body), { "format": 'Letter', "orientation": "portrait" })
                .toFile(`./src/storage/documents/${fileName}`, (error, result) => {
                    if (error) { res.send(Promise.reject()) }
                    const file = `${baseUrl}/431-1221/${fileName}`;
                    file && pool.getConnection((err, connection) => {
                        connection.beginTransaction(() => {
                            connection.query(`INSERT INTO ga_orion.documentos (file, worker, signed, sent, assigner) VALUES ( ?, ?, ?, ?, ?)`,
                                [file, worker_id, signed = 0, sent = 1, assigner], (error, result) => {
                                    if (error) { return connection.rollback(() => { throw error; }) }
                                    connection.commit((err) => {
                                        if (err) { return connection.rollback(() => { throw err; }) }
                                        sendMail(nombre, apellidos, email, file, fileName)
                                        return res.status(200).send({ promise: Promise.resolve(), message: '¡Email de asignación enviado!' });
                                    });
                                })
                        })
                    })
                })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al enviar el mail' });
    }
}

const getDocumentsByUser = async (req, res) => {
    try {
        const { id } = req.params
        if (id) {
            const documents = await getUserDocuments(parseInt(id))
            if (documents.length > 0) {
                return res.status(200).json(documents);
            } else {
                return res.status(500).json({ message: 'No hay documentos para este usuario' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al devolver los documentos' });
    }
}

const uploadSignedDocument = async (req, res) => {
    try {
        const { id_document, old_document } = req.body
        const check = req.file.filename && id_document && old_document && true
        if (check) {
            const file = `${baseUrl}/431-1221/${req.file.filename}`
            const signedDocument = await updateDocument(file, id_document)
            if (signedDocument.affectedRows !== 0) {
                //! TODO: verificar la url en old_document cuando esté en producción!!
                // fs.unlink('C:/Users/fabrizio.carella/Desktop/Projects/Orion/back/src/storage/documents/Asignacion-Fabrizio-Carella-202206191327.pdf', (error) => {
                fs.unlink(old_document, (error) => {
                    if (error) { return res.status(500).json({ message: 'Error al borrar el documento' }) }
                    return res.status(200).json({ message: 'Documento actualizado correctamente' })
                })
            } else { return res.status(500).json({ message: 'Error al subir el documento' }) }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al subir el documento' });
    }
}

const sendLog = async (req, res) => {
    try {
        const { worker, log, assigner } = req.body;
        const { nombre, apellidos } = worker;
        const check = Object.keys(worker).length > 0 && log.length > 0;
        if (check) {
            const newName = worker.nombre.split(' ').filter((n, i) => (i === 0)).join('');
            const newLastname = worker.apellidos.split(' ').filter((a, i) => (i === 0)).join('');
            const fileName = `Total-Logs-${newName}-${newLastname}-${getFileDate(new Date())}.pdf`;
            //TODO DESCOMENTAR EN PRODUCCIÓN
            // const path = `${baseUrl}/431-1221/${fileName}`;
            const path = `C:/Users/fabrizio.carella/Desktop/Projects/Orion/back/src/storage/documents/`;
            const fullPath = path + fileName;
            await pdf
                .create(logsTemplate(req.body), { "format": 'Letter', "orientation": "portrait" })
                .toFile(fullPath, async (error, result) => {
                    if (error) { res.send(Promise.reject()) };
                    await sendWorkerLog(nombre, apellidos, assigner, fullPath, fileName);
                    await fs.unlink(fullPath, (error) => {
                        if (error) { return res.status(500).json({ message: 'Error al borrar el documento' }) }
                        return res.status(200).send({ promise: Promise.resolve(), message: '¡Email de logs enviado!' });
                    })
                });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al enviar el documento' });
    }
}

module.exports = { createPdf, getDocumentsByUser, uploadSignedDocument, sendLog };
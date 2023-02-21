//Imports
const baseUrl = process.env.BACK_URL;
const { uploadNewInvoice, updateInvoice, getLastInvoices } = require("../models/invoice");

const editInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { comments, real_date, total_price } = req.body;

        let file;
        req.file
            ? file = `${baseUrl}/215-998/${req.file.filename}`
            : file = req.body.file;
        const updatedInvoice = await updateInvoice(file, comments, real_date, total_price, id)
        if (updatedInvoice.affectedRows !== 0) {
            return res.status(200).json({ message: 'La factura se ha modificado correctamente' });
        } else {
            return res.status(500).json({ message: 'Error al editar la factura' });
        }
    } catch (error) {
        return res.status(200).json({ message: 'Error al editar la factura' });

    }
}

const createSingleInvoice = async (req, res) => {
    try {
        const file = `${baseUrl}/431-1220/${req.file.filename}`;
        const { comments, real_date, price } = req.body
        const invoice = await uploadNewInvoice(file, comments, real_date, price)
        if (invoice.affectedRows !== 0) {
            return res.status(200).json({ message: 'Factura creada correctamente' })
        } else {
            return res.status(500).json({ message: 'Error al crear la factura' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear la factura' });
    }
}

const getInvoices = async (req, res) => {
    try {
        const invoices = await getLastInvoices()
        if (invoices.length > 0) {
            return res.status(200).json(invoices);
        } else {
            return res.status(500).json({ message: 'No hay facturas disponibles' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al cargar las facturas' });

    }
}


module.exports = { createSingleInvoice, editInvoice, getInvoices };

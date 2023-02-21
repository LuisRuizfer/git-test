//Imports
const route = require('express').Router();
const { createSingleInvoice, editInvoice, getInvoices } = require('../controllers/invoice');
const upload = require('../libs/factura-multer');

//Routes
// Add-Create
route.post('/api/invoice', upload.single('file'), createSingleInvoice);         // Uploads a single invoice

// Edit
route.put('/api/invoice/:id', /*upload.single('file'),*/ editInvoice)           // Updates invoice info

// Get
route.get('/api/invoice', getInvoices )                                         //! Gets all invoices (Checked)



module.exports = route;
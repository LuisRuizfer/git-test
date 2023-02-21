// Imports
const route = require('express').Router();
const { createPdf, getDocumentsByUser, uploadSignedDocument, sendLog } = require('../controllers/documents')
const upload = require('../libs/documents-multer')

// Routes
route.post('/api/documents', createPdf)
route.post('/api/documents-signed', upload.single('file'), uploadSignedDocument)
route.post('/api/document-log', sendLog)
route.get('/api/documents/:id', getDocumentsByUser)

module.exports = route;
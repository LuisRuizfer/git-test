// Imports
import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACK_URL

//! Create PDF document
export const createPdf = async (data) => {
    try {
        const response = await axios({
            url: `${baseUrl}/documents`,
            method: 'POST',
            data
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets all documents related to a user
export const getDocumentsByUser = async (id) => {
    try {
        const response = await axios({
            url: `${baseUrl}/documents/${id}`,
            method: 'GET',
        })
        return response
    } catch (error) {
        return error.response;

    }
}

//! Upload signed document
export const sendSignedDocument = async (selectedFile) => {
    try {
        const { image, id_document, old_document } = selectedFile
        const formData = new FormData();
        formData.append('file', image);
        formData.append('id_document', id_document);
        formData.append('old_document', old_document);
        const response = await axios({
            url: `${baseUrl}/documents-signed`,
            method: 'POST',
            data: formData
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Send logs document
export const sendLog = async (data) => {
    try {
        const response = await axios({
            url: `${baseUrl}/document-log`,
            method: 'POST',
            data
        })
        return response;
    } catch (error) {
        return error.response;
    }
}
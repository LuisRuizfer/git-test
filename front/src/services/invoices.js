import axios from "axios";

const baseUrl = process.env.REACT_APP_BACK_URL;

// Create Invoice data.
export async function createInvoice({ image, comments, real_date, price }) {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('comments', comments);
    formData.append('real_date', real_date);
    formData.append('price', parseInt(price));

    try {
        const response = await axios({
            url: `${baseUrl}/invoice`,
            method: 'POST',
            headers: {
                type: 'user'
            },
            data: formData
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets invoices (Checked)
export async function getInvoices() {

    try {
        const response = await axios({
            url: `${baseUrl}/invoice`,
            method: 'GET',
            headers: {
                type: 'user'
            },
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

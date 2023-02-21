import axios from "axios";

const baseUrl = process.env.REACT_APP_BACK_URL;

//! Gets all departments (Checked)
export async function getAllDepartments() {
    try {
        const response = await axios({
            url: `${baseUrl}/departments`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Creates a new location.
export async function createDepartament(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/departments`,
            method: 'POST',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}

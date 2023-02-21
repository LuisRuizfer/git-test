import axios from "axios";

const baseUrl = process.env.REACT_APP_BACK_URL;

export async function createUser(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/user`,
            method: 'POST',
            data
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets all workers (Checked)
export async function getAllWorkers() {
    try {
        const response = await axios({
            url: `${baseUrl}/users`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets worker info 
export async function getWorker(id) {
    try {
        const response = await axios({
            url: `${baseUrl}/users/${id}`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Gets worker info by EMAIL.
export async function getWorkerByEmail(email) {
    try {
        const response = await axios({
            url: `${baseUrl}/users/data/${email}`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Unsubscribe user
export async function unsubscribeUser(id, data) {
    try {
        const response = await axios({
            url: `${baseUrl}/user-cancel/${id}`,
            method: 'PUT',
            data
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Edit User.
export async function editUser(data, id) {
    try {
        const response = await axios({
            url: `${baseUrl}/edit_user/${id}`,
            method: 'PUT',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}

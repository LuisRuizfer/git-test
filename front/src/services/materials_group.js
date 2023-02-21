// Imports
import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACK_URL;

//! Gets all material groups (Checked)
export async function getAllMaterialsGroup() {
    try {
        const response = await axios({
            url: `${baseUrl}/material-group`,
            method: 'GET',
        })
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Creates a new material group
export async function createMaterialGroup(data) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-group`,
            method: 'POST',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}

//! Edit a material group
export async function editMaterialGroup(data, id) {
    try {
        const response = await axios({
            url: `${baseUrl}/material-group/${id}`,
            method: 'PUT',
            data
        }
        )
        return response;
    } catch (error) {
        return error.response;
    }
}

// //! Gets products name
// export async function getMaterialsFullName() {
//     try {
//         const response = await axios({
//             url: `${baseUrl}/material-group-name`,
//             method: 'GET',
//         }
//         )
//         return response;
//     } catch (error) {
//         return error.response;
//     }
// }

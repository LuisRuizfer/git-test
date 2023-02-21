//Imports
import { createContext, useState, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
// Services
import { getWorkerByEmail } from '../services/user'

export const UserRoleContext = createContext()
export default function UserRoleProvider({ children }) {

    const { accounts } = useMsal()
    const [role, setRole] = useState(0)
    //TODO: VALORAR ELIMINAR ESTE CONTEXT
    useEffect(() => {
        (async function () {
            // Call to worker by email service.
            if (accounts.length > 0) {
                const userData = await getWorkerByEmail(accounts[0].username)
                userData.data.length > 0 && setRole(userData.data[0].role)
            }
        })()
    }, [accounts])

    return (
        <UserRoleContext.Provider value={{ role }} >
            {children}
        </UserRoleContext.Provider>
    )
}

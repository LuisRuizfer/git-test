import { useContext } from 'react'
import Materials from "../components/Materials"
import Navbar from "../components/Navbar"
import { Login } from '../components/Login'
import { useIsAuthenticated } from '@azure/msal-react'

import { InfoUserContext } from '../context/infoUser';

function MaterialsPage() {
    const { infoUser } = useContext(InfoUserContext)
    const isAuthenticated = useIsAuthenticated()
    return (
        <>
            {(isAuthenticated === false || infoUser.role === 0)
                ? <Login />
                : <>
                    <Navbar />
                    <Materials />
                </>}
        </>
    )
}
export default MaterialsPage

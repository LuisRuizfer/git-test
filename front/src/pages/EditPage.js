// Imports.
import { useContext, useState } from 'react'
import { useIsAuthenticated } from '@azure/msal-react'
import { useNavigate } from 'react-router-dom'

// Components.
import Navbar from '../components/Navbar'
import EditMaterial from '../components/EditMaterial'
import EditUser from '../components/EditUser'
import { Login } from '../components/Login'

// Context.
import { InfoUserContext } from '../context/infoUser'

function EditPage() {
    const { infoUser }  = useContext(InfoUserContext)
    const isAuthentificated = useIsAuthenticated()
    const navigate = useNavigate()

    const [active, setActive] = useState({
        material: false,
        staff: false
    })

    return (
        <>
            { /**
                The component is only displayed in the following case: having a super-admin role.
                If you are not logged in or do not have access permissions: redirection to Login.
                If you are only a reader or admin: redirection to Home.
            **/}
            { (isAuthentificated === false) || (infoUser.role === 0) && <Login /> }
            { ((infoUser.role === 1) || (infoUser.role === 2)) ? navigate(`/`) : (
            <>
            <Navbar />
            <div className='create'>
                <button className='normalButton' onClick={() => setActive({
                    order: false, material: true, staff: false
                })}>Editar material</button>

                <div></div>

                <button className='normalButton' onClick={() => setActive({
                    order: false, material: false, staff: true
                })}>Editar personal</button>
            </div>

            {active.material && <EditMaterial /> }

            {active.staff && <EditUser /> }
            </> 
            )}
        </>
    )
}
export default EditPage

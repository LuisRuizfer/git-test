// Imports.
import { useIsAuthenticated } from '@azure/msal-react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Components.
import Navbar from '../components/Navbar'
import CreateMaterial from '../components/CreateMaterial'
import CreateOrder from '../components/CreateOrder'
import CreateUser from '../components/CreateUser'
import { Login } from '../components/Login'

// Context.
import { InfoUserContext } from '../context/infoUser'


function CreatePage() {
    const { infoUser} = useContext(InfoUserContext)
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()

    const [active, setActive] = useState({ order: false, material: false, staff: false })

    return (
        <>
            { /**
            The component is only displayed in the following case: having a super-admin role.
            If you are not logged in or do not have access permissions: redirection to Login.
            If you are only a reader or admin: redirection to Home.
            **/}
            {((isAuthenticated === false) || (infoUser.role === 0)) && <Login />}
            {((infoUser.role === 1) || (infoUser.role === 2))
                ? navigate(`/`)
                : (<>
                    <Navbar />
                    <div className='create'>
                        <button className='normalButton' onClick={() => setActive({
                            order: !active.order, material: false, staff: false
                        })}>añadir pedido</button>
                        <button className='normalButton' onClick={() => setActive({
                            order: false, material: !active.material, staff: false
                        })}>añadir material</button>
                        <button className='normalButton' onClick={() => setActive({
                            order: false, material: false, staff: !active.staff
                        })}>añadir personal</button>
                    </div>
                    {active.order && <CreateOrder />}
                    {active.material && <CreateMaterial />}
                    {active.staff && <CreateUser />}
                </>
                )}
        </>
    )
}
export default CreatePage

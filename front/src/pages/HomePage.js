//Imports
import { Outlet, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { Login } from '../components/Login'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from '@azure/msal-react';

// Services
import { Home } from '../components/Home'
import { InfoUserContext } from '../context/infoUser';

function HomePage() {
    const { infoUser } = useContext(InfoUserContext)
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const currentLocation = window.location.pathname;
    useEffect(() => {
        if (!isAuthenticated || infoUser.role === 0) {
            navigate('/login')
        }
    }, [isAuthenticated, infoUser.role])
    return (
        <>
            <AuthenticatedTemplate>
                {(currentLocation === '/' && infoUser.role !== 0) ? <Home /> : <Outlet />}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Login />
            </UnauthenticatedTemplate>
        </>
    )
}
export default HomePage
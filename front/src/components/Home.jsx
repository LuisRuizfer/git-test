import React, { useContext, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { InfoUserContext } from '../context/infoUser'
import Navbar from './Navbar'

export const Home = () => {
    const navigate = useNavigate()
    const { infoUser } = useContext(InfoUserContext)
    const [displayButtons, setDisplayButtons] = useState(false);
    const currentLocation = window.location.pathname;
    return (
        <div className='wrapper'>
            {currentLocation === '/'
                ? (<>
                    <Navbar />
                    <div className='home-wrapper'>
                        <button className='principal-button' onClick={() => navigate('users/list')}>Personal</button>
                        <button className='principal-button' onClick={() => navigate('/materials/stock')}>Stock</button>
                        {(infoUser.role === 2 || infoUser.role === 3) && <button className='principal-button' onClick={() => navigate('/user-assignment')}>Asignar material</button>}
                        {(infoUser.role === 3) && <button className='principal-button' onClick={() => setDisplayButtons(!displayButtons)}>Edición/Creación</button>}
                    </div>
                        {displayButtons && (<div className='actions'>
                            {infoUser.role === 3 && <button className='actions-buttons' onClick={() => navigate('/user-cancel')}>Realizar baja</button>}
                            {infoUser.role === 3 && <button className='actions-buttons' onClick={() => navigate('/create')}>Añadir</button>}
                            {infoUser.role === 3 && <button className='actions-buttons' onClick={() => navigate('/edit')}>Editar</button>}
                        </div>)
                        }
                </>)
                : <Outlet />
            }
        </div>
    )
}

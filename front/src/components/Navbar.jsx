import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logout } from './Logout'
import { useMsal } from '@azure/msal-react'

import LOGO_ORION from '../assets/LOGO_ORION.jpg'
import back from '../assets/back.png'
import forward from '../assets/forward.png'
import gear from '../assets/gear.png'
import closed from '../assets/closed.png'
import { InfoUserContext } from '../context/infoUser'


function Navbar() {
    const { infoUser } = useContext(InfoUserContext)
	const { accounts } = useMsal()
	const infoUserMail = accounts.length > 0 ? accounts[0].username : null
	const infoUserName = accounts.length > 0 ? accounts[0].name : null

	const [isCollapsed, setIsCollapsed] = useState()
	const navigate = useNavigate()

	return (
		<div className='navbar'>
			<div className='navbar__navigate' onClick={() => navigate(`/`)}>
				<img src={LOGO_ORION} alt='Logo Orión' className='navbar__logo' />
			</div>

			<div className='navbar__navigate-movement'>
				<div className='navbar__navigate-back' onClick={() => navigate(-1)}>
					<img src={back} alt='Atrás' className='navbar__navigate-back-img' />
					<p>Atrás</p>
				</div>

				<div className='navbar__navigate-back' onClick={() => navigate(1)}>
					<p>Adelante</p>
					<img src={forward} alt='Siguiente' className='navbar__navigate-back-img' />
				</div>
			</div>


			<div className='navbar__logger'>
				{isCollapsed ? (
					<div className='navbar__logger-on'>
						<div
							onClick={() => setIsCollapsed(!isCollapsed)}>
							<img src={closed} alt='' className='navbar__closed' />
						</div>
						{
							accounts && (
								<div>
									<p>{infoUserName}</p>
									<p>{infoUserMail}</p>
								</div>
							)
						}
						<Logout />
					</div>
				) : (
					<div className='navbar__logger-off'
						onClick={() => setIsCollapsed(!isCollapsed)}>
						<img src={gear} alt='' className='navbar__gear' />
					</div>
				)}
			</div>
		</div>
	)
}
export default Navbar

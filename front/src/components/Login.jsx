import { useIsAuthenticated, useMsal } from "@azure/msal-react"
import { loginRequest } from "../middleware/authConfig"
import video from '../assets/ORION.mp4'
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { InfoUserContext } from "../context/infoUser"

// Renders a button which, when selected, will open a popup for login

export const Login = () => {
	const { instance } = useMsal();
	const { infoUser } = useContext(InfoUserContext)
	const isAuthenticated = useIsAuthenticated();
	const navigate = useNavigate();
	const handleLogin = () => {
		instance.loginPopup(loginRequest)
			.catch(e => { console.error(e) })
	}
	useEffect(() => {
		if (isAuthenticated && infoUser.role === 0) {
			instance.logoutPopup({
				postLogoutRedirectUri: "/",
				mainWindowRedirectUri: "/"
			}).catch(e => {
				console.error(e)
			})
		}
		if (isAuthenticated && infoUser.role !== 0) {
			navigate('/')
		}
	}, [isAuthenticated])

	return (
		<>
			<video src={video} autoPlay={true} muted={true} loop={true} />
			<button variant="secondary" className="loginAzure" onClick={() => handleLogin()}>
				Login
			</button>
		</>
	)
}

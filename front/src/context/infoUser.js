//Imports
import { createContext, useEffect, useState } from "react";
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest, graphConfig } from '../middleware/authConfig';
import axios from "axios";

// Services
import { getWorkerByEmail } from '../services/user'

export const InfoUserContext = createContext();
export const InfoUserProvider = ({ children }) => {

	//Guardar info del usuario
	const [infoUser, setInfoUser] = useState({});
	//Call to msal, obtener token e intercambiarlo por la infor del user
	const { instance, accounts } = useMsal();
	const saveUserData = () => {
		const request = { ...loginRequest, account: accounts[0] }
		instance.acquireTokenSilent(request)
			.then(async (response) => {
				try {
					const bearer = `Bearer ${response.accessToken}`;
					const responseInfo = await axios({
						url: graphConfig.graphMeEndpoint,
						method: 'GET',
						headers: {
							'Authorization': bearer
						}
					});
					if (responseInfo.status === 200) {
						if (accounts.length > 0) {
							const userData = await getWorkerByEmail(accounts[0].username)
							if (userData.data[0].role === 0) {
								//TODO: LLEVAR A UNA PÁGINA DE ERROR DONDE SE INDIQUE QUE EL USUARIO NO TIENE LOS PERMISOS MÍNIMOS NECESARIOS PARA PODER ACCEDER (role !== 0) 
								window.location = 'https://globalalumni.org/'
							} else {
								setInfoUser({ ...responseInfo.data, role: userData.data[0].role })
							}
						}
					};
				} catch (error) { console.log(error) };
			})
			.catch((e) => {
				instance.acquireTokenRedirect(request).then((response) => {
					console.log('Ha habido un error al traer el token', response)
				})
			})
	}
	//Verificar si el usuario esta autentificado
	const isAuthenticated = useIsAuthenticated();
	useEffect(() => {
		if (isAuthenticated) { saveUserData() }
	}, [isAuthenticated])

	return (
		<InfoUserContext.Provider value={{ setInfoUser, infoUser }}>
			{children}
		</InfoUserContext.Provider>
	)
}
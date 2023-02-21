//Imports
import { BrowserRouter, Routes, Route } from "react-router-dom"

//Pages
import HomePage from "./pages/HomePage"
import MaterialsPage from "./pages/MaterialsPage"
import ErrorPage from "./pages/ErrorPage"
import CreatePage from "./pages/CreatePage"
import Users from './components/Users'
import MaterialAssignment from './components/MaterialAssignment'
import MaterialDetails from './components/MaterialDetails'
import UsersDetails from './components/UsersDetails'
import EditPage from "./pages/EditPage"

//Context
import { ModalProvider } from "./context/ModalContext"
import { MessagesProvider } from "./context/messagesContext"

import "./styles/App.scss"
import { InfoUserProvider } from "./context/infoUser"
import { Login } from "./components/Login"

function App() {
	return (
		<InfoUserProvider>
			<MessagesProvider>
				<ModalProvider>
					<BrowserRouter>
						<Routes>
							<Route exact={true} path="/" element={<HomePage />} >
								<Route exact={true} path="login" element={<Login />} />
								{/* Users */}
								<Route exact={true} path="users/:department" element={<Users />} />
								<Route exact={true} path="user" element={<Users />} />
								<Route exact={true} path="user/:id" element={<UsersDetails />} />
								{/* Materials */}
								<Route exact={true} path="materials/:type" element={<MaterialsPage />} />
								<Route exact={true} path="material-unique/:id" element={<MaterialDetails />} />
								<Route exact={true} path="user-cancel" element={<Users />} />
								<Route exact={true} path="user-cancel/:id" element={<UsersDetails />} />
								<Route exact={true} path="user-assignment" element={<Users />} />
								<Route exact={true} path="user-assignment/:id" element={<MaterialAssignment />} />
								<Route exact={true} path="create" element={<CreatePage />} />
								<Route exact={true} path="edit" element={<EditPage />} />
							</Route>
							<Route exact={true} path="*" element={<ErrorPage />} />
						</Routes>
					</BrowserRouter>
				</ModalProvider>
			</MessagesProvider>
		</InfoUserProvider>
	)
}
export default App

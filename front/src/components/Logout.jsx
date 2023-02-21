import React from "react"
import { useMsal } from "@azure/msal-react"

/**
 * Renders a button which, when selected, will open a popup for logout
 */
export const Logout = () => {
    const { instance } = useMsal()
    const handleLogout = () => {
        instance.logoutPopup({
            redirectUri: "/blank.html",
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        }).catch(e => {
            console.error(e)
        })
    }

    return (
        <button variant="secondary" className="logoutButton" onClick={() => handleLogout()}>CERRAR SESION</button>
    )
}

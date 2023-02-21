import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// Login Azure.
import { PublicClientApplication } from "@azure/msal-browser"
import { MsalProvider,
    // AuthenticatedTemplate, UnauthenticatedTemplate
} from "@azure/msal-react"
import { msalConfig } from "./middleware/authConfig"

const msalInstance = new PublicClientApplication(msalConfig)

ReactDOM.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <App />
        </MsalProvider>
    </React.StrictMode>,
    document.getElementById('root')
)

export const msalConfig = {
	auth: {
		clientId: '3d163f32-e9f5-4db4-8971-93d3cb134e4c',
		authority: 'https://login.microsoftonline.com/ce6c57e7-70a3-449f-b0b9-300681e00150',
		redirectUri: 'https://orion.globalalumni.org',
	},
	cache: {
		cacheLocation: 'sessionStorage', // This configures where your cache will be stored
		storeAuthStateInCookie: false, // Set this to 'true' if you are having issues on IE11 or Edge
	}
}

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
	scopes: ['User.Read'],
	prompt: 'select_account'
}

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
	graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me'
}

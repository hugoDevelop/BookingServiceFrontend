import * as msal from '@azure/msal-browser';
import { config } from '../authConfig';
import { authStore } from '../lib/store/authStore'; // Asegúrate de que la ruta es correcta

const msalConfig = {
    auth: {
        clientId: config.clientId,
        authority: `https://login.microsoftonline.com/${config.tenantId}`,
        redirectUri: config.redirectUri
    }
};

export const msalInstance = new msal.PublicClientApplication(msalConfig);

function base64URLEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await crypto.subtle.digest('SHA-256', data);
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const hashed = await sha256(codeVerifier);
    return base64URLEncode(hashed);
}

export async function initialize() {
    await msalInstance.initialize();
}

export async function login(email: string) {
    if (msalInstance.getAllAccounts().length > 0) {
        console.log("User already logged in");
        return;
    }

    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    console.log('codeVerifier:', codeVerifier);
    console.log('codeChallenge:', codeChallenge);

    // Store the codeVerifier in localStorage or sessionStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem('code_verifier', codeVerifier);
    }

    const loginRequest = {
        scopes: config.scopes,
        codeChallenge: codeChallenge,
        codeChallengeMethod: "S256"
    };
    msalInstance.loginPopup(loginRequest).then((loginResponse) => {
        console.log("id_token acquired at: " + new Date().toString());
        console.log(loginResponse);
   
        const tokenRequest = {
          scopes: ["User.Read"],
          account: loginResponse.account,
        };
   
        msalInstance.acquireTokenSilent(tokenRequest).then((tokenResponse) => {
            console.log("access_token acquired at: " + new Date().toString());
            console.log(tokenResponse.accessToken);
            authStore.set({
                isAuthenticated: true,
                accessToken: tokenResponse.accessToken,
                user: loginResponse.account
            });
        }).catch((error) => {
          console.error(error);
          msalInstance.acquireTokenPopup(tokenRequest).then((tokenResponse) => {
            console.log("access_token acquired at: " + new Date().toString());
            console.log(tokenResponse.accessToken);
            authStore.set({
                isAuthenticated: true,
                accessToken: tokenResponse.accessToken,
                user: loginResponse.account
            });
          }).catch((error) => {
            console.error(error);
          });
        });
      }).catch((error) => {
        console.error(error);
      });
}

export async function isLoggedIn() {
    console.log(msalInstance.getAllAccounts());
    return msalInstance.getAllAccounts().length > 0;
}

export async function handleRedirect() {
    const response = await msalInstance.handleRedirectPromise();
    if (response && response.account) {
        authStore.set({
            isAuthenticated: true,
            accessToken: response.accessToken,
            user: response.account
        });
    }
    return response;
}

export async function logout() {
    await msalInstance.logoutRedirect();
    authStore.set({
        isAuthenticated: false,
        accessToken: null,
        user: null
    });
}

export function getAccessToken() {
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
        return msalInstance.acquireTokenSilent({
            scopes: ["User.Read"],
            account
        });
    }
    return null;
}

function generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = crypto.getRandomValues(new Uint8Array(length));
    for (let i = 0; i < values.length; i++) {
        result += charset[values[i] % charset.length];
    }
    return result;
}
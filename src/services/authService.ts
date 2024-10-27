import * as msal from '@azure/msal-browser';
import { config } from '../authConfig';
import { authStore } from '../lib/store/authStore';
import { getUserSettings } from './apiService';
import { redirect } from '@sveltejs/kit';
import type { User } from '../models/User';

const msalConfig = {
    auth: {
        clientId: config.clientId,
        authority: `https://login.microsoftonline.com/${config.tenantId}`,
        redirectUri: config.redirectUri
    }
};

export let msalInstance = new msal.PublicClientApplication(msalConfig);

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
    // cambiar el client id y el tenant id
    msalConfig.auth.clientId = config.clientId;
    msalConfig.auth.authority = `https://login.microsoftonline.com/${config.tenantId}`;
    msalConfig.auth.redirectUri = config.redirectUri;
    msalInstance = new msal.PublicClientApplication(msalConfig);

    await msalInstance.initialize();
}

export async function login(user: User) {
    console.log(config);
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
    try {
        const loginResponse = await msalInstance.loginPopup(loginRequest);

        const tokenRequest = {
            scopes: [config.scopes[0]],
            account: loginResponse.account
        };

        const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
        authStore.set({
            isAuthenticated: true,
            accessToken: tokenResponse.accessToken,
            user: user
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function isLoggedIn() {
    console.log(msalInstance.getAllAccounts());
    return msalInstance.getAllAccounts().length > 0;
}

export async function logout() {
    await initialize();
    await msalInstance.logoutPopup();
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
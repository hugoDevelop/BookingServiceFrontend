export const config = {
    clientId: 'client_id',
    clientSecret: 'client_secret',
    authorizationEndpoint: 'authorization_endpoint',
    tokenEndpoint: 'token_endpoint',
    redirectUri: 'http://localhost:3000',
    scopes: ['openid', 'profile', 'offline_access'],
    tenantId: 'common',
    apiUrl: import.meta.env.VITE_API_URL
  };
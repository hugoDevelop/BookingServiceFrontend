export enum Rol {
    Admin = 'Admin',
    User = 'User'
}

export enum AuthMethod {
    OAuth = 'OAuth',
    SAML = 'SAML'
}

export interface Company {
    id: number;
    name: string;
    authMethod: AuthMethod;
    authUrl?: string;
    authClientId?: string;
    authClientSecret?: string;
    schema?: string;
    authOpenIdConfigUrl?: string;
    authRedirectUrl?: string;
    authRedirectUrlMobile?: string;
    authScope?: string;
    authAudience?: string;
    authIssuer?: string;
    authTokenUrl?: string;
}
import type { IconFile, IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class WhoisFreaksApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: {
        light: IconFile;
        dark: IconFile;
    };
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}

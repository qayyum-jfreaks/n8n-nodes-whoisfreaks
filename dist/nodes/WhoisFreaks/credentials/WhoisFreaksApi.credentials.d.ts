import type { IconFile, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class WhoisFreaksApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: {
        light: IconFile;
        dark: IconFile;
    };
    documentationUrl: string;
    properties: INodeProperties[];
    test: {
        request: {
            baseURL: string;
            url: string;
            method: "GET";
        };
    };
}

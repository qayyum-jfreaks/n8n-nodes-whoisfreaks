import type {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

const properties: INodeProperties[] = [
    {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        default: '',
        required: true,
        description: 'Enter API Key for WhoisFreaks API or get a new one from <a href="https://billing.whoisfreaks.com/" target="_blank">WhoisFreaks</a>.',
    },
];

export class WhoisFreaksApi implements ICredentialType {
    name = 'whoisFreaksApi';
    displayName = 'WhoisFreaks API';
    documentationUrl = 'whoisfreaks';
    properties = properties;
}
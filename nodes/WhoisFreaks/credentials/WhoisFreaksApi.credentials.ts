import type {
    IconFile,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

const properties: INodeProperties[] = [
	{
		displayName: 'API Key',
		name: 'apiKey',
		type: 'string',
		typeOptions: {
			password: true,
		},
		default: '',
		required: true,
		description: 'Enter the API key for WhoisFreaks or create a new one from <a href="https://billing.whoisfreaks.com/" target="_blank">WhoisFreaks</a>',
	},
];

export class WhoisFreaksApi implements ICredentialType {
	name = 'whoisFreaksApi';
	displayName = 'WhoisFreaks API';
	icon: { light: IconFile; dark: IconFile } = { 
        light: 'file:whoisfreaks-dark.svg', 
        dark: 'file:whoisfreaks-light.svg' 
    };
    documentationUrl = 'https://whoisfreaks.com/documentation';
	properties = properties;
	test = {
		request: {
			baseURL: 'https://api.whoisfreaks.com',
			url: '/v2.0/whois/live?domainName=whoisfreaks.com&format=json',
			method: 'GET' as const,
		},
	};
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhoisFreaksApi = void 0;
const properties = [
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
class WhoisFreaksApi {
    constructor() {
        this.name = 'whoisFreaksApi';
        this.displayName = 'WhoisFreaks API';
        this.icon = {
            light: 'file:whoisfreaks-dark.svg',
            dark: 'file:whoisfreaks-light.svg'
        };
        this.documentationUrl = 'https://whoisfreaks.com/documentation';
        this.properties = properties;
        this.authenticate = {
            type: 'generic',
            properties: {
                qs: {
                    apiKey: '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.whoisfreaks.com',
                url: '/v2.0/whois/live?domainName=whoisfreaks.com&format=json',
                method: 'GET',
            },
        };
    }
}
exports.WhoisFreaksApi = WhoisFreaksApi;
//# sourceMappingURL=WhoisFreaksApi.credentials.js.map
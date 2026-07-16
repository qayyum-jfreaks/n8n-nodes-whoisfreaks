"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequest = httpRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function httpRequest(method, endpoint, body) {
    const credentials = (await this.getCredentials('whoisFreaksApi'));
    if (credentials === undefined) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'No WhoisFreaks API credentials found' });
    }
    const apiKey = typeof credentials.apiKey === 'string' ? credentials.apiKey : '';
    const requestOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: method,
        body: body !== null && body !== void 0 ? body : undefined,
        url: `https://api.whoisfreaks.com/${endpoint}&apiKey=${apiKey}`,
        json: true,
    };
    try {
        return (await this.helpers.httpRequestWithAuthentication.call(this, 'whoisFreaksApi', requestOptions));
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
            message: error instanceof Error ? error.message : 'Unknown request error',
        });
    }
}
//# sourceMappingURL=HttpWrapper.js.map
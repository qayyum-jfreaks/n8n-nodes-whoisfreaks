import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function httpRequest(
	this: IExecuteFunctions,
	method: 'GET' | 'POST',
	endpoint: string,
	body: IDataObject | undefined,
): Promise<IDataObject> {
	const credentials = (await this.getCredentials('whoisFreaksApi')) as JsonObject;
	if (credentials === undefined) {
		throw new NodeApiError(this.getNode(), { message: 'No WhoisFreaks API credentials found' });
	}

	const apiKey = typeof credentials.apiKey === 'string' ? credentials.apiKey : '';
	const requestOptions: IHttpRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
		},
		method: method as IHttpRequestMethods,
		body: body ?? undefined,
		url: `https://api.whoisfreaks.com/${endpoint}&apiKey=${apiKey}`,
		json: true,
	};

	try {
		return (await this.helpers.httpRequestWithAuthentication.call(this, 'whoisFreaksApi', requestOptions)) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), {
			message: error instanceof Error ? error.message : 'Unknown request error',
		});
	}
}
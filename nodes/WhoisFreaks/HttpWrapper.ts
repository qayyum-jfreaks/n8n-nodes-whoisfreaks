import type {
IExecuteFunctions,
IDataObject, 
JsonObject,
IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';


export async function httpRequest(
    this: IExecuteFunctions,
    method: 'GET' | 'POST',
    endpoint: string,
    body: IDataObject | undefined,
): Promise<any>{
    const credentials = await this.getCredentials('whoisFreaksApi') as JsonObject;
    if (credentials === undefined) {
        throw new NodeApiError(this.getNode(), { message: 'No WhoisFreaks API credentials found!' });
    }

    const reqquestOptions ={
        headers:{
            "Content-Type": "application/json",
        },
        method: method as IHttpRequestMethods,
        body: body ? body : undefined,
        url: `https://api.whoisfreaks.com/${endpoint}&apiKey=${(credentials as any).apiKey}`,
        json: true,
    }

    try{
        return await this.helpers.httpRequest(reqquestOptions);
    } catch (error) {
        console.error("Error occurred during API request:", error);
        throw new NodeApiError(this.getNode(), error);
    }
}
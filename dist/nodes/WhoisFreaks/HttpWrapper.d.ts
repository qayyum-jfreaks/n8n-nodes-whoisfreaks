import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
export declare function httpRequest(this: IExecuteFunctions, method: 'GET' | 'POST', endpoint: string, body: IDataObject | undefined): Promise<IDataObject>;

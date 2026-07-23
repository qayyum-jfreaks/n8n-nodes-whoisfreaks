import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { httpRequest } from './HttpWrapper';

const operationOptions = [
	{
		name: 'Live WHOIS Lookup',
		value: 'whoisLive',
	},
	{
		name: 'Historical WHOIS Lookup',
		value: 'whoisHistorical',
	},
	{
		name: 'Reverse WHOIS Search',
		value: 'whoisReverse',
	},
	{
		name: 'Live DNS Lookup',
		value: 'dnsLive',
	},
	{
		name: 'Historical DNS Lookup',
		value: 'dnsHistorical',
	},
	{
		name: 'Reverse DNS Search',
		value: 'dnsReverse',
	},
	{
		name: 'SSL Lookup',
		value: 'sslLookup',
	},
	{
		name: 'Subdomains Lookup',
		value: 'subdomainsList',
	},
	{
		name: 'Domain Availability',
		value: 'domainAvailability',
	},
	{
		name: 'IP Geolocation',
		value: 'ipGeolocation',
	},
	{
		name: 'IP Reputation',
		value: 'ipReputation',
	},
	{
		name: 'Bulk WHOIS Lookup',
		value: 'bulkWhoisLookup',
	},
	{
		name: 'Bulk Domain DNS Lookup',
		value: 'bulkDomainLookup',
	},
	{
		name: 'Bulk Domain Availability Lookup',
		value: 'bulkDomainAvailabilityLookup',
	},
	{
		name: 'Bulk IP Geolocation Lookup',
		value: 'bulkIpGeolocationLookup',
	},
	{
		name: 'Bulk IP Reputation Lookup',
		value: 'bulkIpReputationLookup',
	},
	{
		name: 'Domain Reputation Lookup',
		value: 'domainReputationLookup',
	}, {
		name: "Typo Squatting Lookup",
		value: "typoSquattingLookup"
	}
];

export class WhoisFreaks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WhoisFreaks',
		name: 'whoisFreaks',
		icon: { light: 'file:whoisfreaks-dark.svg', dark: 'file:whoisfreaks-light.svg' },
		group: ['transform'],
		version: [1],
		usableAsTool: true,
		subtitle: '={{$parameter["operations"]}}',
		description:
			'Consume the WhoisFreaks API for WHOIS, DNS, SSL, subdomains, availability, geolocation, and reputation',
		defaults: {
			name: 'WhoisFreaks',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'whoisFreaksApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operations',
				type: 'options',
				options: operationOptions,
				default: 'whoisLive',
			},
			{
				displayName: 'Domain Name',
				name: 'domainName',
				type: 'string',
				default: '',
				placeholder: 'whoisfreaks.com',
				description: 'Enter the domain name to query',
				required: true,
				displayOptions: {
					show: {
						operations: [
							'whoisLive',
							'whoisHistorical',
							'dnsLive',
							'dnsHistorical',
							'domainAvailability',
							'sslLookup',
							'subdomainsList',
							'domainReputationLookup'
						],
					},
				},
			},
			{
				displayName: 'Domain Names',
				name: 'domainNames',
				type: 'string',
				default: '',
				placeholder: 'whoisfreaks.com, google.com, n8n.io',
				description: 'Enter the domain names as a comma-separated list',
				required: true,
				displayOptions: {
					show: {
						operations: ['bulkWhoisLookup', 'bulkDomainLookup', 'bulkDomainAvailabilityLookup'],
					},
				},
			},
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
				placeholder: '8.8.8.8',
				description: 'Enter the IP address to query',
				required: true,
				displayOptions: {
					show: {
						operations: ['ipGeolocation', 'ipReputation', 'dnsReverse'],
					},
				},
			},
			{
				displayName: 'IP Addresses',
				name: 'ipAddresses',
				type: 'string',
				default: '',
				placeholder: '8.8.8.8,1.1.1.1',
				description: 'Enter the IP addresses as a comma-separated list',
				displayOptions: {
					show: {
						operations: ['bulkDomainLookup', 'bulkIpGeolocationLookup', 'bulkIpReputationLookup'],
					},
				},
			},
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				default: '',
				placeholder: 'whoisfreaks',
				description: 'Enter the keyword to search for',
				required: true,
				displayOptions: {
					show: {
						operations: ['whoisReverse', 'typoSquattingLookup'],
					},
				},
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{
						name: 'JSON',
						value: 'json',
					},
					{
						name: 'XML',
						value: 'xml',
					},
				],
				default: 'json',
				description: 'Select the response format',
				displayOptions: {
					show: {
						operations: [
							'whoisLive',
							'whoisHistorical',
							'whoisReverse',
							'dnsLive',
							'dnsHistorical',
							'dnsReverse',
							'domainAvailability',
							'sslLookup',
							'subdomainsList',
							'bulkWhoisLookup',
							'bulkDomainLookup',
							'bulkDomainAvailabilityLookup',
							'domainReputationLookup'
						],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnItems: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operations', 0) as string;

		const executeOperation = async (): Promise<IDataObject> => {
			switch (operation) {
				case 'whoisLive': {
					const domainName = this.getNodeParameter('domainName', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v2.0/whois/live?domainName=${domainName}&format=${format}`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'whoisHistorical': {
					const domainName = this.getNodeParameter('domainName', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v1.0/whois/?whois=historical&domainName=${domainName}&format=${format}`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'whoisReverse': {
					const keyword = this.getNodeParameter('keyword', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v1.0/whois?whois=reverse&keyword=${keyword}&format=${format}`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'dnsLive': {
					const domainName = this.getNodeParameter('domainName', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v2.0/dns/live?type=all&domainName=${domainName}&format=${format}`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'dnsHistorical': {
					const domainName = this.getNodeParameter('domainName', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v2.0/dns/historical?domainName=${domainName}&format=${format}&type=all&page=1`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'dnsReverse': {
					const ipAddress = this.getNodeParameter('ipAddress', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v2.1/dns/reverse?value=${ipAddress}&format=${format}&type=a&exact=true&page=1`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'domainAvailability': {
					const domainName = this.getNodeParameter('domainName', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v1.0/domain/availability?domain=${domainName}&format=${format}&sug=false`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'sslLookup': {
					const domainName = this.getNodeParameter('domainName', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v1.0/ssl/live?domainName=${domainName}&format=${format}&chain=true&sslRaw=false`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'ipGeolocation': {
					const ipAddress = this.getNodeParameter('ipAddress', 0) as string;
					const endpoint = `/v1.0/geolocation?ip=${ipAddress}`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'subdomainsList': {
					const domainName = this.getNodeParameter('domainName', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v1.0/subdomains?domain=${domainName}&format=${format}&page=1`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'ipReputation': {
					const ipAddress = this.getNodeParameter('ipAddress', 0) as string;
					const endpoint = `/v1.0/security?ip=${ipAddress}`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'bulkWhoisLookup': {
					const domainNames = this.getNodeParameter('domainNames', 0) as string;
					const domainList = domainNames.split(',').map((domain) => domain.trim());
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v2.0/bulkwhois/live?format=${format}`;
					return await httpRequest.call(this, 'POST', endpoint, { domainNames: domainList });
				}
				case 'bulkDomainLookup': {
					const domainNames = this.getNodeParameter('domainNames', 0) as string;
					const domainList = domainNames.split(',').map((domain) => domain.trim());
					const ipAddresses = this.getNodeParameter('ipAddresses', 0) as string;
					const ipList = ipAddresses.split(',').map((ip) => ip.trim());
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v2.0/dns/bulk/live?format=${format}&type=all`;
					return await httpRequest.call(this, 'POST', endpoint, {
						domainNames: domainList,
						ipAddresses: ipList,
					});
				}
				case 'bulkDomainAvailabilityLookup': {
					const domainNames = this.getNodeParameter('domainNames', 0) as string;
					const domainList = domainNames.split(',').map((domain) => domain.trim());
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `/v1.0/domain/availability?format=${format}`;
					return await httpRequest.call(this, 'POST', endpoint, { domainNames: domainList });
				}
				case 'bulkIpGeolocationLookup': {
					const ipAddresses = this.getNodeParameter('ipAddresses', 0) as string;
					const ipList = ipAddresses.split(',').map((ip) => ip.trim());
					const endpoint = '/v1.0/geolocation?format=json';
					return await httpRequest.call(this, 'POST', endpoint, { ips: ipList });
				}
				case 'bulkIpReputationLookup': {
					const ipAddresses = this.getNodeParameter('ipAddresses', 0) as string;
					const ipList = ipAddresses.split(',').map((ip) => ip.trim());
					const endpoint = '/v1.0/security?format=json';
					return await httpRequest.call(this, 'POST', endpoint, { ips: ipList });
				}
				case 'domainReputationLookup': {
					const domainName = this.getNodeParameter('domainName', 0) as string;
					const format = this.getNodeParameter('format', 0, 'json') as string;
					const endpoint = `v1/domain/security?domainName=${domainName}&format=${format}`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				case 'typoSquattingLookup': {
					const keyword = this.getNodeParameter('keyword', 0) as string;
					const endpoint = `v3.0/domain/typos?keyword=${keyword}`;
					return await httpRequest.call(this, 'GET', endpoint, undefined);
				}
				default:
					throw new NodeOperationError(
						this.getNode(),
						`Operation "${operation}" is not supported.`,
					);
			}
		};
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const response = await executeOperation();
				returnItems.push({
					json: response,
					pairedItem: { item: itemIndex },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnItems.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error',
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw new NodeOperationError(
					this.getNode(),
					error instanceof Error ? error : new Error('Unknown error'),
					{ itemIndex },
				);
			}
		}

		return [returnItems];
	}
}

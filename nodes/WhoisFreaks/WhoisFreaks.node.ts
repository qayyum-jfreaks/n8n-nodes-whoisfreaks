import type {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { httpRequest } from './HttpWrapper';
const operationOptions = [
	{
		name: 'Live WHOIS Lookup',
		value: 'whoisLive',
		description: 'Get live WHOIS details for a domain',
	},
	{
		name: 'Historical WHOIS Lookup',
		value: 'whoisHistorical',
		description: 'Get historical WHOIS details',
	},
	{
		name: 'Reverse WHOIS Search',
		value: 'whoisReverse',
		description: 'Search WHOIS by keyword/owner',
	},

	{
		name: 'Live DNS Lookup',
		value: 'dnsLive',
		description: 'Fetch live DNS records',
	},
	{
		name: 'Historical DNS Lookup',
		value: 'dnsHistorical',
		description: 'Fetch historical DNS records',
	},
	{
		name: 'Reverse DNS Search',
		value: 'dnsReverse',
		description: 'Search DNS by keyword',
	},

	{
		name: 'SSL Lookup',
		value: 'sslLookup',
		description: 'Lookup SSL certificate details',
	},
	{
		name: 'Subdomains Lookup',
		value: 'subdomainsList',
		description: 'List subdomains for a domain',
	},
	{
		name: 'Domain Availability',
		value: 'domainAvailability',
		description: 'Check if a domain is available',
	},
	{
		name: 'IP Geolocation',
		value: 'ipGeolocation',
		description: 'Find location data for an IP',
	},
	{
		name: 'IP Reputation',
		value: 'ipReputation',
		description: 'Check risk data for an IP',
	},
	{
		name: 'Bulk WHOIS Lookup',
		value: 'bulkWhoisLookup',
		description: 'Perform bulk WHOIS lookups',
	},
	{
		name: 'Bulk Domain DNS Lookup',
		value: 'bulkDomainLookup',
		description: 'Perform bulk domain DNS lookups',
	},
	{
		name: 'Bulk Domain Availability Lookup',
		value: 'bulkDomainAvailabilityLookup',
		description: 'Perform bulk domain availability lookups',
	},
	{
		name: 'Bulk Ip Geolocation Lookup',
		value: 'bulkIpGeolocationLookup',
		description: 'Perform bulk IP geolocation lookups',
	},
    {
        name: 'Bulk Ip Reputation Lookup',
        value: 'bulkIpReputationLookup',
        description: 'Perform bulk IP reputation lookups',
    }
];
export class WhoisFreaks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WhoisFreaks',
		name: 'whoisFreaks',
		icon: { light: 'file:whois-logo-light.png', dark: 'file:whois-logo.png' },
		group: ['transform'],
		version: [1],
		description:
			'Consume the WhoisFreaks API for WHOIS, DNS, SSL, subdomains, availability, geolocation, and reputation.',
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
				displayName: 'Operations',
				name: 'operations',
				type: 'options',
				options: operationOptions,
				default: 'whoisLive',
				description: 'Select the operation to perform.',
			},
			{
				displayName: 'Domain name',
				name: 'domainName',
				type: 'string',
				default: '',
				placeholder: 'whoisfreaks.com',
				description: 'Enter the domain name for which you want to perform the selected operation.',
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
						],
					},
				},
			},
			{
				displayName: 'Domain names',
				name: 'domainNames',
				type: 'string',
				default: '',
				placeholder: 'whoisfreaks.com, google.com, n8n.io',
				description:
					'Enter the domain names (comma-separated) for which you want to perform the selected operation.',
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
				description: 'Enter the IP address for which you want to perform the selected operation.',
				required: true,
				displayOptions: {
					show: {
						operations: [
							'ipGeolocation',
							'ipReputation',
							,
							'dnsReverse',
							'ipGeolocation',
							'ipReputation',
						],
					},
				},
			},
			{
				displayName: 'IP Addresses',
				name: 'ipAddresses',
				type: 'string',
				default: '',
				placeholder: '8.8.8.8,1.1.1.1',
				description:
					'Enter the IP addresses (comma-separated) for which you want to perform the selected operation.',
				displayOptions: {
					show: {
						operations: ['bulkDomainLookup', 'bulkIpGeolocationLookup',
                            'bulkIpReputationLookup'
                        ],
					},
				},
			},
			{
				displayName: 'Key Word',
				name: 'keyword',
				type: 'string',
				default: '',
				placeholder: 'whoisfreaks',
				description: 'Enter the keyword for which you want to perform the selected operation.',
				required: true,
				displayOptions: {
					show: {
						operations: ['whoisReverse'],
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
				description: 'Select the response format for the API request.',
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
						],
					},
				},
			},
		],
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let domainName = '';
		const operation = this.getNodeParameter('operations', 0) as string;
		let format = '';

		if (operation === 'whoisLive') {
			domainName = this.getNodeParameter('domainName', 0) as string;
			format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v2.0/whois/live?domainName=${domainName}&format=${format}`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'whoisHistorical') {
			domainName = this.getNodeParameter('domainName', 0) as string;
			format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v1.0/whois/?whois=historical&domainName=${domainName}&format=${format}`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'whoisReverse') {
			const keyword = this.getNodeParameter('keyword', 0) as string;
			format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v1.0/whois?whois=reverse&keyword=${keyword}&format=${format}`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'dnsLive') {
			domainName = this.getNodeParameter('domainName', 0) as string;
			format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v2.0/dns/live?type=all&domainName=${domainName}&format=${format}`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'dnsHistorical') {
			domainName = this.getNodeParameter('domainName', 0) as string;
			format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v2.0/dns/historical?domainName=${domainName}&format=${format}&type=all&page=1`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'dnsReverse') {
			const ipAddress = this.getNodeParameter('ipAddress', 0) as string;
			format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v2.1/dns/reverse?value=${ipAddress}&format=${format}&type=a&exact=true&page=1`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'domainAvailability') {
			domainName = this.getNodeParameter('domainName', 0) as string;
			format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v1.0/domain/availability?domain=${domainName}&format=${format}&sug=false`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'sslLookup') {
			domainName = this.getNodeParameter('domainName', 0) as string;
			format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v1.0/ssl/live?domainName=${domainName}&format=${format}&chain=true&sslRaw=false`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'ipGeolocation') {
			const ipAddress = this.getNodeParameter('ipAddress', 0) as string;
			const endpoint = `/v1.0/geolocation?ip=${ipAddress}`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'subdomainsList') {
			domainName = this.getNodeParameter('domainName', 0) as string;
			format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v1.0/subdomains?domain=${domainName}&format=${format}&page=1`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'ipReputation') {
			const ipAddress = this.getNodeParameter('ipAddress', 0) as string;
			const endpoint = `/v1.0/security?ip=${ipAddress}`;
			const response = await httpRequest.call(this, 'GET', endpoint, undefined);
			return [[{ json: response }]];
		} else if (operation === 'bulkWhoisLookup') {
			const domainNames = this.getNodeParameter('domainNames', 0) as string;
			const domainList = domainNames.split(',').map((domain) => domain.trim());
			const format = this.getNodeParameter('format', 0) as string;

			const endpoint = `/v2.0/bulkwhois/live?format=${format}`;
			const body = {
				domainNames: domainList,
			};
			const response = await httpRequest.call(this, 'POST', endpoint, body);
			return [[{ json: response }]];
		} else if (operation === 'bulkDomainLookup') {
			const domainNames = this.getNodeParameter('domainNames', 0) as string;
			const domainList = domainNames.split(',').map((domain) => domain.trim());
			const ipAddresses = this.getNodeParameter('ipAddresses', 0) as string;
			const ipList = ipAddresses.split(',').map((ip) => ip.trim());
			const body = {
				domainNames: domainList,
				ipAddresses: ipList,
			};
			const format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v2.0/dns/bulk/live?format=${format}&type=all`;
			const response = await httpRequest.call(this, 'POST', endpoint, body);
			return [[{ json: response }]];
		} else if (operation === 'bulkDomainAvailabilityLookup') {
			const domainNames = this.getNodeParameter('domainNames', 0) as string;
			const domainList = domainNames.split(',').map((domain) => domain.trim());
			const body = {
				domainNames: domainList,
			};
			const format = this.getNodeParameter('format', 0) as string;
			const endpoint = `/v1.0/domain/availability?format=${format}`;
			const response = await httpRequest.call(this, 'POST', endpoint, body);
			return [[{ json: response }]];
		} else if (operation === 'bulkIpGeolocationLookup') {
			const ipAddresses = this.getNodeParameter('ipAddresses', 0) as string;
			const ipList = ipAddresses.split(',').map((ip) => ip.trim());
			const body = {
				ips: ipList,
			};
			const endpoint = `/v1.0/geolocation?format=json`;
			const response = await httpRequest.call(this, 'POST', endpoint, body);
			return [[{ json: response }]];
		} else if (operation === 'bulkIpReputationLookup') {
            const ipAddresses = this.getNodeParameter('ipAddresses', 0) as string;
            const ipList = ipAddresses.split(',').map((ip) => ip.trim());
            const body = {
                ips: ipList,
            };
            const endpoint = `/v1.0/security?format=json`;
            const response = await httpRequest.call(this, 'POST', endpoint, body);
            return [[{ json: response }]];
        }

        throw new NodeOperationError(this.getNode(), `Operation "${operation}" is not supported.`);
    
	}
}

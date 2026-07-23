# n8n-nodes-whoisfreaks

This is an n8n community node that allows you to seamlessly integrate the [WhoisFreaks](https://whoisfreaks.com) service into your n8n workflows. 

WhoisFreaks is an advanced domain and network intelligence platform offering real-time and historical WHOIS, DNS, SSL, and subdomain data tracking, alongside IP geolocation and reputation capabilities.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation
1. Go to **Settings > Community Nodes** in your n8n instance.
2. Click **Install a node**.
3. Enter `n8n-nodes-whoisfreaks` in the **npm Package Name** field.
4. Agree to the risks and click **Install**.

---

## Operations

This node natively supports the following WhoisFreaks features across both single targets and bulk inputs:

### Standard Operations
* **Live WHOIS Lookup:** Retrieve current ownership registration details for a domain.
* **Historical WHOIS Lookup:** Inspect historical changes in ownership records.
* **Reverse WHOIS Search:** Query domains related to specific keywords or registrant terms.
* **Live DNS Lookup:** Fetch current A, AAAA, MX, NS, TXT, or CNAME records.
* **Historical DNS Lookup:** Uncover past adjustments to a domain's DNS structure.
* **Reverse DNS Search:** Uncover what domains resolve back to a targeted IP address.
* **SSL Lookup:** Analyze live SSL/TLS certificates and certificate trust chains.
* **Subdomains Lookup:** Discover and list all public subdomains linked to a domain.
* **Domain Availability:** Instantly verify whether a domain name is available for purchase.
* **IP Geolocation:** Trace geographical positioning variables (country, city, ASN) from an IP address.
* **IP Reputation:** Run advanced security assessment queries on IP addresses.
* **Domain Reputation Lookup:** Check domain reputation if a domain is being used in any sort of malware or phishing campaign.
* **Typo Squatting Lookup** Check domain typosquatting.

### Bulk Operations
* **Bulk WHOIS Lookup:** Batch audit multiple domain registrants at once.
* **Bulk Domain DNS Lookup:** Execute massive batch transformations across a mixture of domains/IP addresses.
* **Bulk Domain Availability Lookup:** Perform scalable automated availability sweeps.
* **Bulk IP Geolocation Lookup:** Map arrays of network traffic coordinates in one call.
* **Bulk IP Reputation Lookup:** Fast-track incident response logs by batch scanning malicious assets.

---

## Credentials

To authorize your node requests, you must obtain an API Key from the service provider.

### Setting up the connection:
1. Log in or create an account via the [WhoisFreaks Dashboard](https://billing.whoisfreaks.com/).
2. Copy your unique **API Key** generated inside your account space.
3. In n8n, create a new **WhoisFreaks API** credential block.
4. Paste your key into the **API Key** parameter space and hit save.

---

## Compatibility

* **Minimum n8n Version:** `1.0.0`
* Tested up through modern n8n deployment configurations (`v1.x+`).

---

## Usage

When designing workflows with WhoisFreaks:
* **Comma Separated Values:** When managing bulk parameters (like `Domain Names` or `IP Addresses`), ensure your entities are split evenly using simple commas (e.g., `google.com, n8n.io`). The node splits and parses these queries internally for payload structuring.
* **Response Formats:** Most basic queries let you dynamically toggle output schemas between standard `JSON` or structured `XML` representations straight to node outputs.

---

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [WhoisFreaks Official API Documentation](https://whoisfreaks.com/documentation)
* [Register at WhoisFreaks](https://billing.whoisfreaks.com/)

---

## Version history

### 1.0.0
* Initial release providing complete coverage for WHOIS, DNS, SSL, Subdomains, Geolocation, and Reputation endpoints, supporting single and batch bulk payload architectures.